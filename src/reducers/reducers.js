import * as Actions from "../actions/actions.js";
import { combineReducers } from "redux";

function dataReducer(state={}, action) {
    switch(action.type) {
        case Actions.SET_USERNAME:
            return Object.assign({}, state, {
                username: action.username
            });
        case Actions.SET_SERVER:
            return Object.assign({}, state, {
                server: action.server
            });
        case Actions.SET_SUMMONER:
            return Object.assign({}, state, {
                summoner: action.summoner
            });
        case Actions.SET_RANKING:
            return Object.assign({}, state, {
                ranking: action.ranking
            });
        case Actions.SET_LEADERBOARD:
            return Object.assign({}, state, {
                leaderboard: action.leaderboard
            });
        case Actions.SET_HISTOGRAM:
            return Object.assign({}, state, {
                histogram: action.histogram
            });
        case Actions.UPDATE_NODES:
            return Object.assign({}, state, {
                network: {
                    nodes: [... new Set([...state.network.nodes.map((n) => JSON.stringify(n)), ...action.nodes.map((n) => JSON.stringify(n))])].map((n) => JSON.parse(n)),
                    links: state.network.links
                }
            })
        case Actions.UPDATE_LINKS:
            return Object.assign({}, state, {
                network: {
                    nodes: state.network.nodes,
                    links: [... new Set([...state.network.links.map((n) => JSON.stringify(n)), ...action.links.map((n) => JSON.stringify(n))])].map((n) => JSON.parse(n)),
                }
            })
        default:
            return state;
    }
}

function renderReducer(state={}, action) {
    switch(action.type) {
        case Actions.SHOW_INPUT_FORM:
            return Object.assign({}, state, {
                show: "INPUT_FORM"
            });
        case Actions.SHOW_PLAYER_STATS:
            return Object.assign({}, state, {
                show: "PLAYER_STATS"
            });
        case Actions.SHOW_CHAMPION_STATS:
            return Object.assign({}, state, {
                show: "CHAMPION_STATS"
            });
        case Actions.SHOW_NETWORK:
            return Object.assign({}, state, {
                show: "NETWORK"
            });
        default:
            return state;
    }
}

const appReducer = combineReducers({
    info: dataReducer, 
    render: renderReducer
});

export default appReducer;