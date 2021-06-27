/* eslint-disable consistent-return */

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const process = require('process');
const XRegExp = require('xregexp');
const async = require('async');
const _ = require('lodash');
const GaleforceModule = require('galeforce');
const mongoose = require('mongoose');
const csp = require('express-csp-header');
const rateLimit = require("express-rate-limit");
require('dotenv').config();

const galeforce = new GaleforceModule({
    'riot-api': {
        key: process.env.RIOT_KEY,
    },
    
    'rate-limit': {
        cache: {
            type: process.env.CACHE_TYPE,
            uri: process.env.CACHE_URI,
        },
        options: {
            intervals: JSON.parse(process.env.RATE_LIMIT_INTERVALS),
        },
    },
    debug: ['riot-api'],
});

const app = express();

const globalMasteryLeaderboard = {};
const globalRankedLeaderboard = {};
const updateHistory = {};

// app.set('trust proxy', 1);
const limiter = rateLimit(JSON.parse(process.env.EXPRESS_RATE_LIMIT));

//  apply to all requests
app.use(limiter);

app.use(helmet());
app.use(cors());
app.use(csp.expressCspHeader({
    directives: {
        'default-src': [csp.SELF, 'localhost:*', 'https://sightstone-web.herokuapp.com'],
        'script-src': [csp.SELF, 'localhost:*/js/bundle.js', 'https://sightstone-web.herokuapp.com/js/bundle.js', '\'unsafe-eval\''],
        'style-src': [csp.SELF, 'https://cdn.jsdelivr.net', 'fonts.googleapis.com', '\'unsafe-inline\''],
        'img-src': [csp.SELF, 'localhost:*', 'https://sightstone-web.herokuapp.com', 'https://ddragon.leagueoflegends.com'],
        'font-src': ['fonts.gstatic.com'],
    },
}));

/* Mongoose model definitions and initialization */

mongoose.set('useNewUrlParser', true); // Preventing deprecation warnings.
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const matchSchema = new mongoose.Schema({
    gameId: Number,
    gameCreation: Number,
    gameDuration: Number,
    gameMode: String,
    gameType: String,
    gameVersion: String,
    mapId: Number,
    participantIdentities: [],
    participants: [],
    platformId: String,
    queueId: String,
    seasonId: String,
    teams: [],
    timeline: [],
}, { strict: false });

const matchModel = mongoose.model('Match', matchSchema);

const summonerSchema = new mongoose.Schema({
    summoner: Object,
    league: Object,
    matchlist: Object,
    mastery: Object,
}, { strict: false });

const summonerModel = mongoose.model('Summoner', summonerSchema);

const metricsSchema = new mongoose.Schema({
    endpoint: String,
    time: Date,
}, { strict: false });

const metricsModel = mongoose.model('Metrics', metricsSchema);

const viewsSchema = new mongoose.Schema({
    time: Date,
}, { strict: false });

const viewsModel = mongoose.model('Views', viewsSchema);

/* Server endpoint handlers */

const distPath = path.join(__dirname, '..', 'dist');
const serverPath = path.join(__dirname);

app.get('/', (req, res) => {
    res.sendFile(path.join(serverPath, 'index.html'));
    viewsModel.create({ time: Date.now() });
});

app.get('/js/bundle.js', (req, res) => {
    res.sendFile(path.join(distPath, 'bundle.js'));
});

app.get('/riot.txt', (req, res) => {
    res.sendFile(path.join(serverPath, 'riot.txt'));
});

app.get('/api/update', async (request, response) => {
    const server = request.query.server?.toString().toLowerCase();
    const username = request.query.username?.toString().toLowerCase().replace(/\s/g, '');
    const queryLimit = parseInt(process.env.MATCH_QUERY_END_INDEX, 10);

    // Input checks
    if (server === undefined || username === undefined || !(Object.values(galeforce.region.lol).includes(server)) || !(XRegExp('^[0-9\\p{L} _\\.]+$').test(username))) {
        return response.sendStatus(400); // handle bad input data
    }

    // Check if previously updated
    if (Date.now() - (updateHistory[`${username} ${server}`] || 0) < 15 * 60 * 1000) { // Update only once per 15 minutes
        return response.status(429).json({ timeLeft: 15 * 60 * 1000 - (Date.now() - (updateHistory[`${username} ${server}`] || 0)) }); // rate limiting updates
    }

    try {
        const sd = await galeforce.lol.summoner()
            .region(server)
            .name(username)
            .exec();
        
        metricsModel.create({ endpoint: 'summoner', time: Date.now() });

        async.parallel({
            summoner: (callback) => callback(null, { server, ...sd }),
            league: (callback) => galeforce.lol.league.entries().region(server).summonerId(sd.id).exec().then((data) => callback(null, data)),
            mastery: (callback) => galeforce.lol.mastery.list().region(server).summonerId(sd.id).exec().then((data) => callback(null, data)),
            matchlist: (callback) => galeforce.lol.match.list().region(server).accountId(sd.accountId).query({ endIndex: queryLimit || 100 }).exec().then((data) => callback(null, data)),      
        }, async (err, data) => {
            metricsModel.insertMany([
                { endpoint: 'league', time: Date.now() },
                { endpoint: 'mastery', time: Date.now() },
                { endpoint: 'matchlist', time: Date.now() },
            ]);
            // Upsert data into database.
            const summonerQuery = { 'summoner.puuid': data.summoner.puuid }; // select by unique PUUID
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            await summonerModel.findOneAndUpdate(summonerQuery, data, options).exec();

            await async.each(data.matchlist.matches, async (match) => {
                const matchQuery = { gameId: match.gameId }; // select by match ID
                const exists = (await matchModel.findOne(matchQuery, { _id: 1 })) !== null; // Don't re-upsert already upserted matches
                if (!exists) {
                    metricsModel.create({ endpoint: 'match', time: Date.now() });
                    const matchData = await galeforce.lol.match.match()
                        .region(match.platformId.toLowerCase())
                        .matchId(match.gameId)
                        .exec();
                    await matchModel.findOneAndUpdate(matchQuery, matchData, options).exec();
                }
            });
            response.sendStatus(200);
            updateHistory[`${username} ${server}`] = Date.now();
        });
    } catch (e) {
        console.log(e);
        response.sendStatus(parseInt(e.message.split(' ')[e.message.split(' ').length - 1], 10) || 500);
    }
});

app.get('/api/summoner', async (request, response) => {
    const server = request.query.server?.toString();
    const username = request.query.username?.toString().toLowerCase().replace(/\s/g, '');

    if (server === undefined || username === undefined || !(Object.values(galeforce.region.lol).includes(server)) || !(XRegExp('^[0-9\\p{L} _\\.]+$').test(username))) {
        // handle bad input data
        return response.sendStatus(400);
    }

    try {
        const summonerData = await summonerModel.find({
            'summoner.name': new RegExp('^' + username.split('').join('\\s*') + '$', 'iu'),
            'summoner.server': server,
        }).exec();
        response.status(200).json(summonerData[0]);
    } catch (e) {
        console.log(e);
        response.sendStatus(e.message.split(' ')[e.message.split(' ').length - 1] || 500);
    }
});

app.get('/api/mastery/distribution', async (request, response) => {
    try {
        const responseValue = {};

        Object.keys(globalMasteryLeaderboard).forEach((champion) => {
            const masteryPoints = globalMasteryLeaderboard[champion].map((item) => item.masteryPoints);
            const masteryHistogram = new Array(500000 / 10000 + 1).fill(0);

            masteryPoints.forEach((value) => {
                masteryHistogram[Math.min(Math.floor(value / 10000), masteryHistogram.length - 1)] += 1;
            });
            const xAxis = Array.from(Array(500000 / 10000 + 1).keys()).map((x) => 10000 * x);

            const data = xAxis.map((value, index) => ({
                x: value,
                y: masteryHistogram[index],
            }));

            responseValue[champion] = data;
        });

        response.status(200).json(responseValue);
    } catch (e) {
        response.sendStatus(500);
    }
});

function convertToLeaguePoints(tier, rank, leaguePoints) {
    const tierToLeaguePoints = {
        IRON: 0,
        BRONZE: 400,
        SILVER: 800,
        GOLD: 1200,
        PLATINUM: 1600,
        DIAMOND: 2000,
        MASTER: 2400,
        GRANDMASTER: 2400,
        CHALLENGER: 2400,
    };

    const rankToLeaguePoints = {
        IV: 0,
        III: 100,
        II: 200,
        I: 300,
    };

    if (!['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier)) {
        return tierToLeaguePoints[tier] + rankToLeaguePoints[rank] + leaguePoints;
    }
    return tierToLeaguePoints[tier] + leaguePoints;
}

app.get('/api/league/distribution', async (request, response) => {
    try {
        const server = request.query.server?.toString();

        if (server === undefined || !(Object.values(galeforce.region.lol).includes(server))) {
            // handle bad input data
            return response.sendStatus(400);
        }

        const responseValue = {};
        const binSize = 50;
        const maxValue = 4500;

        Object.keys(globalRankedLeaderboard).forEach((queueType) => {
            const masteryPoints = globalRankedLeaderboard[queueType].filter((x) => x.server === server).map((item) => convertToLeaguePoints(item.tier, item.rank, item.leaguePoints));
            const masteryHistogram = new Array(maxValue / binSize + 1).fill(0);

            masteryPoints.forEach((value) => {
                masteryHistogram[Math.min(Math.floor(value / binSize), masteryHistogram.length - 1)] += 1;
            });
            const xAxis = Array.from(Array(maxValue / binSize + 1).keys()).map((x) => binSize * x);

            const data = xAxis.map((value, index) => ({
                x: value,
                y: masteryHistogram[index],
            }));

            responseValue[queueType] = data;
        });

        response.status(200).json(responseValue);
    } catch (e) {
        console.log(e);
        response.sendStatus(500);
    }
});

app.get('/api/mastery/ranking', async (request, response) => {
    try {
        const username = request.query.username?.toString().toLowerCase().replace(/\s/g, '');
        const server = request.query.server?.toString();

        if (server === undefined || username === undefined || !(Object.values(galeforce.region.lol).includes(server)) || !(XRegExp('^[0-9\\p{L} _\\.]+$').test(username))) {
            return response.sendStatus(400); // handle bad input data
        }

        const responseValue = {};
        Object.keys(globalMasteryLeaderboard).forEach((ls) => {
            responseValue[ls] = {
                pos: -1,
                total: globalMasteryLeaderboard[ls].length,
                points: 0,
                level: 0,
                time: 0,
            };
            globalMasteryLeaderboard[ls].forEach((item, index) => {
                if (item.lowerName === username && item.server === server) {
                    responseValue[ls].pos = index + 1;
                    responseValue[ls].points = item.masteryPoints;
                    responseValue[ls].level = item.masteryLevel;
                    responseValue[ls].time = item.lastPlayTime;
                }
            });
        });
        response.status(200).json(responseValue);
    } catch (e) {
        console.log(e);
        response.sendStatus(500);
    }
});

app.get('/api/league/ranking', async (request, response) => {
    try {
        const username = request.query.username?.toString().toLowerCase().replace(/\s/g, '');
        const server = request.query.server?.toString();

        if (server === undefined || username === undefined || !(Object.values(galeforce.region.lol).includes(server)) || !(XRegExp('^[0-9\\p{L} _\\.]+$').test(username))) {
            return response.sendStatus(400); // handle bad input data
        }

        const responseValue = {};
        Object.keys(globalRankedLeaderboard).forEach((ls) => {
            responseValue[ls] = {
                pos: -1,
                total: globalRankedLeaderboard[ls].filter((x) => x.server === server).length,
                tier: '',
                rank: '',
                leaguePoints: 0,
                equivalentRank: 0,
            };
            globalRankedLeaderboard[ls].filter((x) => x.server === server).forEach((item, index) => {
                if (item.lowerName === username && item.server === server) {
                    responseValue[ls].pos = index + 1;
                    responseValue[ls].tier = item.tier;
                    responseValue[ls].rank = item.rank;
                    responseValue[ls].leaguePoints = item.leaguePoints;
                    responseValue[ls].equivalentRank = convertToLeaguePoints(item.tier, item.rank, item.leaguePoints);
                }
            });
        });
        response.status(200).json(responseValue);
    } catch (e) {
        console.log(e);
        response.sendStatus(500);
    }
});

app.get('/api/mastery/leaderboard', async (request, response) => {
    try {
        const responseValue = {};
        Object.keys(globalMasteryLeaderboard).forEach((key) => {
            responseValue[key] = globalMasteryLeaderboard[key].slice(0, 100);
        });
        response.status(200).json(responseValue);
    } catch (e) {
        response.sendStatus(500);
    }
});

app.get('/api/social/frequent', async (request, response) => {
    const server = request.query.server?.toString();
    const username = request.query.username?.toString().toLowerCase().replace(/\s/g, '');

    if (server === undefined || username === undefined || !(Object.values(galeforce.region.lol).includes(server)) || !(XRegExp('^[0-9\\p{L} _\\.]+$').test(username))) {
        // handle bad input data
        return response.sendStatus(400);
    }

    const summonerData = await summonerModel.find({
        'summoner.name': new RegExp('^' + username.split('').join('\\s*') + '$', 'iu'),
        'summoner.server': server,
    }).exec();

    const matchData = await matchModel.find({
        'participantIdentities.player.accountId': summonerData[0].summoner.accountId,
        queueId: { $nin: [800, 810, 820, 830, 840, 850] }, // exclude bot games
    }, ['participantIdentities.player.summonerName', 'participantIdentities.player.accountId'].join(' ')).exec();

    const participantByMatch = matchData.map((match) => match.participantIdentities).flat().map((participant) => participant.player);

    const frequencies = _.countBy(participantByMatch.map((player) => player.accountId));

    const frequents = Object.keys(_.pickBy(frequencies, (value) => value >= 2));

    response.status(200).json({
        nodes: frequents.map((key) => ({
            id: key,
            name: participantByMatch.find((player) => player.accountId === key).summonerName,
            server: summonerData[0].summoner.server,
        })),
        links: frequents.map((key) => ({
            source: summonerData[0].summoner.accountId,
            target: key,
        })),
    });
});

async function getRankedLeaderboard(queueTypes) {
    const query = { league: { $elemMatch: { queueType: { $in: queueTypes } } } };
    const projection = ['summoner.server', 'summoner.name', 'league.queueType', 'league.tier', 'league.rank', 'league.leaguePoints'].join(' ');
    const filteredData = await summonerModel.find(query, projection).exec();
    // Restructure filteredData to allow for efficient sorting.
    const combinedFilteredArray = [];
    queueTypes.forEach((queueType) => {
        const filteredArray = [];
        filteredData.forEach((summonerData) => {
            const LMDElem = summonerData.league.find((elem) => elem.queueType === queueType);
            if (typeof LMDElem !== 'undefined') {
                const { queueType } = LMDElem;
                const { tier } = LMDElem;
                const { rank } = LMDElem;
                const { leaguePoints } = LMDElem;

                filteredArray.push({
                    name: summonerData.summoner.name,
                    server: summonerData.summoner.server,
                    queueType,
                    tier,
                    rank,
                    leaguePoints,
                });
            }
        });

        filteredArray.sort((a, b) => Math.sign(convertToLeaguePoints(b.tier, b.rank, b.leaguePoints) - convertToLeaguePoints(a.tier, a.rank, a.leaguePoints))); // Reverse order
        combinedFilteredArray.push(filteredArray);
    });
    return combinedFilteredArray;
}

async function getMasteryLeaderboard(ids) {
    const query = { mastery: { $elemMatch: { championId: { $in: ids } } } };
    const projection = ['summoner.server', 'summoner.name', 'mastery.championPoints', 'mastery.championId', 'mastery.championLevel', 'mastery.lastPlayTime'].join(' ');
    const filteredData = await summonerModel.find(query, projection).exec();
    // Restructure filteredData to allow for efficient sorting.
    const combinedFilteredArray = [];
    ids.forEach((id) => {
        const filteredArray = [];
        filteredData.forEach((summonerData) => {
            const LMDElem = summonerData.mastery.find((elem) => elem.championId === id);
            if (typeof LMDElem !== 'undefined') {
                const champion = LMDElem.championId;
                const masteryPoints = LMDElem.championPoints;
                const masteryLevel = LMDElem.championLevel;
                const { lastPlayTime } = LMDElem;

                filteredArray.push({
                    name: summonerData.summoner.name,
                    server: summonerData.summoner.server,
                    champion,
                    masteryPoints,
                    masteryLevel,
                    lastPlayTime,
                });
            }
        });

        filteredArray.sort((a, b) => Math.sign(b.masteryPoints - a.masteryPoints)); // Reverse order
        combinedFilteredArray.push(filteredArray);
    });
    return combinedFilteredArray;
}

async function updateGlobalLeaderboards(paramChampData) {
    // console.log(`[${new Date().toLocaleString()}] [server] [global-leaderboard]: Updating global ranked leaderboards...`);
    const RLB = await getRankedLeaderboard(['RANKED_SOLO_5x5', 'RANKED_FLEX_SR']);
    ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].forEach((name, index) => {
        globalRankedLeaderboard[name] = RLB[index].map((entry) => {
            entry.lowerName = entry.name.toLowerCase().replace(/\s/g, '');
            return entry;
        });
    });

    // console.log(`[${new Date().toLocaleString()}] [server] [global-leaderboard]: Updating global mastery leaderboards...`);
    champData = Object.values(paramChampData.data);

    const MLB = await getMasteryLeaderboard(champData.map((a) => parseInt(a.key, 10)));

    champData.map((a) => a.name).forEach((name, index) => {
        globalMasteryLeaderboard[name] = MLB[index].map((entry) => {
            entry.lowerName = entry.name.toLowerCase().replace(/\s/g, '');
            return entry;
        });
    });

    // console.log(`[${new Date().toLocaleString()}] [server] [global-leaderboard]: Finished updating all leaderboards. Setting timer for recalculation.`);
    setTimeout(() => updateGlobalLeaderboards(paramChampData), 1 * 1000); // Wait 1 second to recalculate leaderboard.
}

(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
    const champData = await galeforce.lol.ddragon.champion.list().version(process.env.PATCH).locale('en_US').exec();
    await updateGlobalLeaderboards(champData);

    console.log('[server] [network]: Listening on port', process.env.PORT);
    app.listen(process.env.PORT);
}());
