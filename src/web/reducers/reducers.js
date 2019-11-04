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
        case Actions.SET_DATA:
            return Object.assign({}, state, {
                data: action.data
            });
        default:
            return state;
    }
}

function renderReducer(state={}, action) {
    switch(action.type) {
        case Actions.TOGGLE_INPUT_FORM:
            return Object.assign({}, state, {
                inputForm: !state.inputForm
            });
        case Actions.TOGGLE_PLAYER_STATS:
            return Object.assign({}, state, {
                playerStats: !state.playerStats
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