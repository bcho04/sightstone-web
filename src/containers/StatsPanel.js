import { connect } from 'react-redux';
import StatsPanel from '../components/StatsPanel';

const mapStateToProps = (state) => {
    const lastPlayed = new Date(Math.max.apply(Math, Object.values(state.info.ranking).map((obj) => obj.time)));
    const sincePlayed = (Date.now() - lastPlayed);

    const seconds = Math.round(sincePlayed / 1000);
    const minutes = Math.round(sincePlayed / (1000 * 60));
    const hours = Math.round(sincePlayed / (1000 * 60 * 60));
    const days = Math.round(sincePlayed / (1000 * 60 * 60 * 24));
    const months = Math.round(sincePlayed / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(sincePlayed / (1000 * 60 * 60 * 24 * 365));
    let sincePlayedString;

    if (lastPlayed.getTime() === 0) {
        sincePlayedString = 'never';
    } else if (seconds < 60) {
        sincePlayedString = `${seconds.toString()} second${seconds > 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
        sincePlayedString = `${minutes.toString()} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        sincePlayedString = `${hours.toString()} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 30) {
        sincePlayedString = `${days.toString()} day${days > 1 ? 's' : ''} ago`;
    } else if (months < 12) {
        sincePlayedString = `${months.toString()} month${months > 1 ? 's' : ''} ago`;
    } else {
        sincePlayedString = `${years.toString()} year${years > 1 ? 's' : ''} ago`;
    }

    const totalPoints = Object.values(state.info.ranking).map((item) => item.points).reduce((prev, next) => prev + next, 0);
    const masteryScore = Object.values(state.info.ranking).map((item) => item.level).reduce((prev, next) => prev + next, 0);
    const soloRankObj = state.info.summoner.league?.find((rank) => rank.queueType === 'RANKED_SOLO_5x5');
    const soloRank = typeof soloRankObj !== 'undefined' ? `${soloRankObj.tier} ${soloRankObj.rank} ${soloRankObj.leaguePoints.toString()}LP` : 'unranked';

    const flexRankObj = state.info.summoner.league?.find((rank) => rank.queueType === 'RANKED_FLEX_SR');

    const flexRank = typeof flexRankObj !== 'undefined' ? `${flexRankObj.tier} ${flexRankObj.rank} ${flexRankObj.leaguePoints.toString()}LP` : 'unranked';

    return {
        className: state.render.show === 'PLAYER_STATS' ? 'show' : 'hide',
        server: state.info.summoner?.summoner?.server ? state.info.summoner.summoner.server : '',
        username: state.info.summoner?.summoner?.name ? state.info.summoner.summoner.name : '',
        lastPlayed: sincePlayedString,
        totalPoints,
        masteryScore,
        soloRank,
        flexRank,
    };
};

const PlayerStatsPanel = connect(mapStateToProps)(StatsPanel);

export default PlayerStatsPanel;
