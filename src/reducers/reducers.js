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
        case Actions.SET_PLAYER:
            return Object.assign({}, state, {
                data: action.data
            });
        case Actions.SET_LEADERBOARD:
            return Object.assign({}, state, {
                leaderboard: action.leaderboard
            });
        case Actions.SET_HISTOGRAM:
            return Object.assign({}, state, {
                histogram: action.histogram
            });
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
        default:
            return state;
    }
}

const appReducer = combineReducers({
    info: dataReducer, 
    render: renderReducer
});

export default appReducer;