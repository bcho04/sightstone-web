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
export const SET_DATA               = "SET_DATA";
export const TOGGLE_INPUT_FORM      = "TOGGLE_INPUT_FORM";
export const TOGGLE_PLAYER_STATS    = "TOGGLE_PLAYER_STATS";

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

export function setData(data) {
    return {
        type: SET_DATA,
        data
    };
}

export function toggleInputForm() {
    return {
        type: TOGGLE_INPUT_FORM
    };
}

export function togglePlayerStats() {
    return {
        type: TOGGLE_PLAYER_STATS
    };
}