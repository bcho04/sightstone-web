/* We have the application state as follows:

{
    username: <string>,
    server: <string>,
    data: <dict>
    render: {
        inputForm: <boolean>,
        playerStats: <boolean>
    }
}
*/

export const SET_USERNAME           = "SET_USERNAME";
export const SET_SERVER             = "SET_SERVER";
export const SET_SUMMONER           = "SET_SUMMONER";
export const SET_RANKING            = "SET_RANKING";
export const SET_LEADERBOARD        = "SET_LEADERBOARD";
export const SET_HISTOGRAM          = "SET_HISTOGRAM";
export const SHOW_INPUT_FORM        = "SHOW_INPUT_FORM";
export const SHOW_PLAYER_STATS      = "SHOW_PLAYER_STATS";
export const SHOW_CHAMPION_STATS    = "SHOW_CHAMPION_STATS";

export function setUsername(username) {
    return {
        type: SET_USERNAME,
        username
    };
}

export function setServer(server) {
    return {
        type: SET_SERVER,
        server
    };
}

export function setSummoner(summoner) {
    return {
        type: SET_SUMMONER,
        summoner
    };
}

export function setRanking(ranking) {
    return {
        type: SET_RANKING,
        ranking
    };
}

export function setLeaderboard(leaderboard) {
    return {
        type: SET_LEADERBOARD,
        leaderboard
    }
}

export function setHistogram(histogram) {
    return {
        type: SET_HISTOGRAM,
        histogram
    }
}

export function showInputForm() {
    return {
        type: SHOW_INPUT_FORM
    };
}

export function showPlayerStats() {
    return {
        type: SHOW_PLAYER_STATS
    };
}

export function showChampionStats() {
    return {
        type: SHOW_CHAMPION_STATS
    };
}