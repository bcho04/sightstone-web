import React from 'react';
import PropTypes from 'prop-types';
import async from 'async';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import XRegExp from 'xregexp';
import FEBE from '../methods/FEBE';
import {
    setUsername, setServer, setSummoner, showNetwork, updateNetwork,
} from '../actions/actions';

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleServerChange = this.handleServerChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            alertText: 'This is a demo/mock version of the Sightstone website, and does not have API search capabilities.',
            showSpinner: false,
        };
    }

    handleNameChange(event) {
        this.props.dispatch(setUsername(event.target.value));
    }

    handleServerChange(event) {
        this.props.dispatch(setServer(event.target.value));
    }

    handleSubmit(event) {
        this.setState({ showSpinner: true });
        this.setState({ alertText: '' });
        if (window.onLine || navigator.onLine) {
            const request_options_u = {
                server: 'na1', // For demo purposes
                username: 'SSG Xayah',
                type: 'update',
            };

            const request_options_s = {
                server: 'na1',
                username: 'SSG Xayah',
                type: 'summoner',
            };

            const request_options_n = {
                server: 'na1',
                username: 'SSG Xayah',
                type: 'social/frequent',
            };

            FEBE.request(request_options_u).then((response_u) => {
                async.parallel({
                    body_s: (callback) => {
                        FEBE.request(request_options_s).then((x) => callback(null, x));
                    },
                    body_n: (callback) => {
                        FEBE.request(request_options_n).then((x) => callback(null, x));
                    },
                }).then((results) => {
                    this.setState({ showSpinner: false });
                    this.setState({ alertText: '' });
                    this.props.dispatch(setSummoner(JSON.parse(results.body_s)));
                    this.props.dispatch(showNetwork());
                    this.props.dispatch(updateNetwork(JSON.parse(results.body_n)));
                });
            }).catch((error) => {
                this.setState({ showSpinner: false });
                if (error.statusCode === 404) this.setState({ alertText: 'Username not found. Please check your username spelling and server and try again.' });
                else if (error.statusCode === 500) this.setState({ alertText: 'There was a server-side error.' });
                else this.setState({ alertText: 'There was an error while attempting this search. Please check your username and server and try again.' });
            });
        } else {
            this.setState({ showSpinner: false });
            this.setState({ alertText: 'You are offline. Please reconnect to search.' });
        }
        event.preventDefault();
    }

    render() {
        const summonerRegex = XRegExp('^[0-9\\p{L} _\\.]+$');
        return (
            <div className={this.props.className}>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" className="input" value={this.props.username} onChange={this.handleNameChange} placeholder={this.props.placeholder} />
                    </label>
                    <select className="select" value={this.props.server} onChange={this.handleServerChange}>
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
                    <input id="submit" className="button" onClick={this.handleSubmit} disabled={!(summonerRegex.test(this.props.username) && this.props.server)} type="submit" value="Search &#x300B;" />
                </form>
                <center className="loading-info">
                    {this.state.showSpinner && <Spinner animation="border" variant="secondary" size="lg" />}
                    {this.state.alertText !== '' && <Alert variant="danger">{this.state.alertText}</Alert>}
                </center>
            </div>
        );
    }
}

NameForm.propTypes = {
    name: PropTypes.string,
    server: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default NameForm;
