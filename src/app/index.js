import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "../components/App"

import appReducer from '../reducers/reducers';
import "../style/styles.css";

/* Redux Definition */

var url = new URL(window.location.href);

const serverLookup = {
    "br": "br1",
    "eune": "eun1",
    "euw": "euw1",
    "jp": "jp1",
    "kr": "kr1",
    "lan": "la1",
    "las": "la2",
    "na": "na1",
    "oce": "oc1",
    "tr": "tr1",
    "ru": "ru1",
    "": ""
}

const store = createStore(appReducer, {
    info: {
        username: (url.searchParams.get("username") || ""), 
        server: serverLookup[(url.searchParams.get("server") || "")],
        data: {},
        leaderboard: {},
    },
    render: {
        show: "INPUT_FORM"
    }
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);