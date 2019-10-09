const React = require("react");
const ReactDOM = require("react-dom");
const redux = require("redux");
const request = require("request");

const FEBE = require('./connection');
const stylesheet = require('./styles.css');

/* Redux Definition */

function setState(state={}, action){
    switch(action.type){
        case "SET_US":
            return Object.assign({}, state, {
                "username": action.username,
                "server": action.server
            });
        default:
            return state;
    }
}

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

var store = redux.createStore(setState);
var url = new URL(window.location.href);
store.dispatch({type: "SET_US", username: (url.searchParams.get("username") || ""), server: serverLookup[(url.searchParams.get("server") || "")]}); // Default values.

/* React Definitions */

class ReduxHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: {},
            type: props.type,
            classes: "name-header hide",
        };
        store.subscribe(() => {
            this.setState({classes: "name-header show"}); // Show text now.
            this.setState({data: store.getState()});
        });
    }

    render(){
        const {value} = this.props;
        return (
            <div className={this.state.classes}>
                <h2>{this.state.data[this.state.type]}</h2>
            </div>
        );
    }
}

class ReduxText extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: {},
            type: props.type,
            classes: "name-text hide",
        };
        store.subscribe(() => {
            this.setState({classes: "name-text show"}); // Show text now.
            this.setState({data: store.getState()});
        });
    }

    render(){
        const {value} = this.props;
        return (
            <div className={this.state.classes}>
                <p>{this.state.data[this.state.type]}</p>
            </div>
        );
    }
}

class Button extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text: props.text,
            classes: props.className,
            onClick: props.onClick
        };
    }

    render(){
        return (
            <button className={this.state.classes} onClick={this.state.onClick}>
            {this.state.text}
            </button>
        );
    }
}

class NameForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: store.getState().username,
            server: store.getState().server,
            placeholder: props.placeholder,
            classes: 'show',
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleServerChange = this.handleServerChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event){
        this.setState({name: event.target.value});
    }

    handleServerChange(event){
        this.setState({server: event.target.value});
    }

    handleSubmit(event){
        if(window.onLine || navigator.onLine){
          FEBE.get(this.state.server, this.state.name).then((body) => {
              console.log(body);
              let serverName;
              Object.keys(serverLookup).forEach((key) => {
                  if(serverLookup[key] == this.state.server) serverName = key;
              });
              store.dispatch({type: "SET_US", username: this.state.name, server: serverName.toUpperCase()});
              this.setState({classes: "hide"});
              window.dispatchEvent(new Event("sumsubmit"));
          }).catch((error) => {
              if(error == 404) alert("Username not found in server. Please check your username spelling and server and try again.");
              else if(error == 500) alert("There was a server-side error.");
              else alert("There was an error while attempting this search. Please check your username and server and try again.");

          });
        } else {
            alert("You are offline. Please reconnect to search.");
        }
        event.preventDefault();
    }

    render(){
        let summonerRegex = /^[^\ ][0-9_\-A-Za-z\ ]{2,}$/
        return (
            <div className={this.state.classes}>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" className={stylesheet.input} value={this.state.name} onChange={this.handleNameChange} placeholder={this.state.placeholder} />
                    </label>
                    <select className={stylesheet.select} value={this.state.server} onChange={this.handleServerChange}>
                        <option value="">Server...</option>
                        <option value="na1">NA</option>
                        <option value="euw1">EUW</option>
                        <option value="eun1">EUNE</option>
                        <option value="kr">KR</option>
                        <option value="la1">LAN</option>
                        <option value="la2">LAS</option>
                        <option value="oc1">OCE</option>
                        <option value="jp1">JP</option>
                        <option value="ru">RU</option>
                        <option value="br1">BR</option>
                        <option value="tr1">TR</option>
                    </select>
                    <input id="submit" className={stylesheet.button} onClick={this.handleSubmit} disabled={!(summonerRegex.exec(this.state.name) && this.state.server) ? true : false} type="submit" value="Search &#x300B;" />
                </form>
            </div>
        );
    }
}

class InputApp extends React.Component {
    render(){
        return (
            <div>
                <NameForm placeholder="Enter summoner..." />
            </div>
        );
    }
}

class PlayerStatsApp extends React.Component {
    render(){
        return (
            <div>
                <center>
                    <ReduxHeader type="username" />
                    <ReduxText type="server" />
                </center>
            </div>
        );
    }
}

ReactDOM.render(
    <InputApp />,
    document.getElementById('input')
);

ReactDOM.render(
    <PlayerStatsApp />,
    document.getElementById('player-info')
);
