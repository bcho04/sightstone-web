import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import * as request from "request";
import * as THREE from "three";
import "./styles.css";

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

var SCREEN_WIDTH  = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mouseX        = 0
var mouseY        = 0;
var windowHalfX   = window.innerWidth / 2;
var windowHalfY   = window.innerHeight / 2;
var camera, scene, renderer;

var store = redux.createStore(setState);
var url = new URL(window.location.href);
store.dispatch({type: "SET_US", username: (url.searchParams.get("username") || ""), server: serverLookup[(url.searchParams.get("server") || "")]}); // Default values.

/* FEBE definition */

class FEBE {
    static request(options){
        return new Promise((resolve, reject) => {
            options.type = options.type == null ? "get" : options.type;

            let uri = "http://127.0.0.1:8080/v1/summoner/" + options.type + "?";
            uri += "server=" + options.server + "&";
            uri += "username=" + options.username;

            request.get(uri, (err, response, body) => {
                if(err) return reject(err);
                body = JSON.parse(body);
                if(Math.floor(body.requestInfo.statusCode/100) == 4) return reject(body.requestInfo.statusCode);
                if(Math.floor(body.requestInfo.statusCode/100) == 5) return reject(body.requestInfo.statusCode);
                return resolve(body);
            });
        });
    }
}

/* Three.js background definitions */

class BackgroundApp extends React.Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentTouchStart = this.onDocumentTouchStart.bind(this);
        this.onDocumentTouchMove = this.onDocumentTouchMove.bind(this);
        this.renderCamera = this.renderCamera.bind(this);
    }

    componentDidMount() {
        this.init();
        this.animate();
    }

    init() {
        var separation = 100, amountX = 50, amountY = 50, particles, particle;
        camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        camera.position.z = 1000;
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        document.getElementById("background").appendChild( renderer.domElement );
        // particles
        var PI2 = Math.PI * 2;
        var material = new THREE.SpriteMaterial( {
            color: 0xffffff,
            program: function ( context ) {
                context.beginPath();
                context.arc( 0, 0, 0.5, 0, PI2, true );
                context.fill();
            }
        } );
        for ( var i = 0; i < 1000; i ++ ) {
            particle = new THREE.Sprite( material );
            particle.position.x = Math.random() * 2 - 1;
            particle.position.y = Math.random() * 2 - 1;
            particle.position.z = Math.random() * 2 - 1;
            particle.position.normalize();
            particle.position.multiplyScalar( Math.random() * 10 + 450 );
            particle.scale.multiplyScalar( 2 );
            scene.add( particle );
        }
        // lines
        for (var i = 0; i < 300; i++) {
            var geometry = new THREE.Geometry();
            var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            vertex.normalize();
            vertex.multiplyScalar( 450 );
            geometry.vertices.push( vertex );
            var vertex2 = vertex.clone();
            vertex2.multiplyScalar( Math.random() * 0.3 + 1 );
            geometry.vertices.push( vertex2 );
            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
            scene.add( line );
        }
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );

        window.addEventListener( 'resize', this.onWindowResize, false ); 
    }

    onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    //
    onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }
    onDocumentTouchStart( event ) {
        if ( event.touches.length > 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
    }
    onDocumentTouchMove( event ) {
        if ( event.touches.length == 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
    }

    animate() {
        requestAnimationFrame( this.animate );
	    this.renderCamera();
    }

    renderCamera() {
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }

    render() {
        return (
            <div ref={ref => (this.el = ref)} />
        );
    }
}


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
            let request_options = {
                server: this.state.server,
                username: this.state.name,
                type: "get"
            };

            FEBE.request(request_options).then((body) => {
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
                        <input type="text" className="input" value={this.state.name} onChange={this.handleNameChange} placeholder={this.state.placeholder} />
                    </label>
                    <select className="select" value={this.state.server} onChange={this.handleServerChange}>
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
                    <input id="submit" className="button" onClick={this.handleSubmit} disabled={!(summonerRegex.exec(this.state.name) && this.state.server) ? true : false} type="submit" value="Search &#x300B;" />
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
    render() {
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

class FooterApp extends React.Component {
    render() {
        return (
            <div>
                <center>
                    <p>Terms of Service</p>
                    <p>Privacy Policy</p>
                    <p>► © 2019 Brandon Cho. All rights reserved.</p>
                </center>
            </div>
        );
    }
}

ReactDOM.render(
    <BackgroundApp />, 
    document.getElementById('background')
);

ReactDOM.render(
    <InputApp />,
    document.getElementById('input')
);

ReactDOM.render(
    <PlayerStatsApp />,
    document.getElementById('player-info')
);

ReactDOM.render(
    <FooterApp />,
    document.getElementById("footer")
)