import { combineReducers } from 'redux';
import * as Actions from '../actions/actions.js';

function dataReducer(state = {}, action) {
    switch (action.type) {
    case Actions.SET_USERNAME:
        return { ...state, username: action.username };
    case Actions.SET_SERVER:
        return { ...state, server: action.server };
    case Actions.SET_SUMMONER:
        return { ...state, summoner: action.summoner };
    case Actions.SET_RANKING:
        return { ...state, ranking: action.ranking };
    case Actions.SET_LEAGUE_RANKING:
        return {
            ...state,
            league: {
                ranking: action.ranking,
                histogram: state.league.histogram,
            },
        };
    case Actions.SET_LEADERBOARD:
        return { ...state, leaderboard: action.leaderboard };
    case Actions.SET_HISTOGRAM:
        return { ...state, histogram: action.histogram };
    case Actions.SET_LEAGUE_HISTOGRAM:
        return {
            ...state,
            league: {
                ranking: state.league.ranking,
                histogram: action.histogram,
            },
        };
    case Actions.UPDATE_NETWORK:
        return {
            ...state,
            network: {
                nodes: [...new Set([...state.network.nodes.map((n) => JSON.stringify(n)), ...action.network.nodes.map((n) => JSON.stringify(n))])].map((n) => JSON.parse(n)),
                links: [...new Set([...state.network.links.map((n) => JSON.stringify(n)), ...action.network.links.map((n) => JSON.stringify(n))])].map((n) => JSON.parse(n)),
            },
        };
    default:
        return state;
    }
}

function renderReducer(state = {}, action) {
    switch (action.type) {
    case Actions.SHOW_INPUT_FORM:
        return { ...state, show: 'INPUT_FORM' };
    case Actions.SHOW_PLAYER_STATS:
        return { ...state, show: 'PLAYER_STATS' };
    case Actions.SHOW_CHAMPION_STATS:
        return { ...state, show: 'CHAMPION_STATS' };
    case Actions.SHOW_NETWORK:
        return { ...state, show: 'NETWORK' };
    default:
        return state;
    }
}

const appReducer = combineReducers({
    info: dataReducer,
    render: renderReducer,
});

export default appReducer;
