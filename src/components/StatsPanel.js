import React from 'react';
import async from 'async';
import Modal from 'react-bootstrap/Modal';
import Button from './Button';
import FEBE from '../methods/FEBE';
import {
    setSummoner, setRanking, setHistogram, setLeagueRanking, setLeagueHistogram, showPlayerStats, showNetwork,
} from '../actions/actions';
import PlayerTabPanel from '../containers/PlayerTabPanel';

class StatsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalHeader: '',
            modalText: '',
            updateClickable: true,
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <div id="user-server">
                    <div className="name-header">
                        <h2>{this.props.username}</h2>
                        <span>{this.props.server}</span>
                        <span>(<b>{this.props.totalPoints}</b> total points | <b>{this.props.masteryScore}</b> mastery score | <b>{this.props.soloRank}</b> solo | <b>{this.props.flexRank}</b> flex)</span>
                        <div className="user-server-right">
                            <span style={{ marginRight: '10px' }}>Last played: <b>{this.props.lastPlayed}</b></span>
                            <Button text="Back" className="button" disabled={!this.state.updateClickable} onClick={(event) => {
                                this.props.dispatch(showNetwork());
                                event.preventDefault();
                            }} />
                            <span style={{ marginRight: '5px' }} />
                            <Button text="Update" className="button" disabled={!this.state.updateClickable} onClick={(event) => {
                                this.setState({ updateClickable: false });

                                const request_options_u = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: 'update',
                                };

                                const request_options_s = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: 'summoner',
                                };

                                const request_options_rr = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: 'league/ranking',
                                };

                                const request_options_rd = {
                                    server: this.props.server,
                                    type: 'league/distribution',
                                };

                                const request_options_r = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: 'mastery/ranking',
                                };

                                const request_options_d = {
                                    type: 'mastery/distribution',
                                };

                                FEBE.request(request_options_u).then((response_u) => {
                                    if (response_u.statusCode === 429) {
                                        this.setState({ showModal: true });
                                        this.setState({ modalHeader: 'Error' });
                                        console.log(response_u);
                                        this.setState({ modalText: `Already updated. Please try again in ${Math.floor(parseInt(response_u.timeLeft) / 1000)} seconds.` });
                                        this.setState({ updateClickable: true });
                                        return;
                                    }
                                    async.parallel({
                                        body_s: (callback) => {
                                            FEBE.request(request_options_s).then((x) => callback(null, x));
                                        },
                                        body_r: (callback) => {
                                            FEBE.request(request_options_r).then((x) => callback(null, x));
                                        },
                                        body_d: (callback) => {
                                            FEBE.request(request_options_d).then((x) => callback(null, x));
                                        },
                                        body_rr: (callback) => {
                                            FEBE.request(request_options_rr).then((x) => callback(null, x));
                                        },
                                        body_rd: (callback) => {
                                            FEBE.request(request_options_rd).then((x) => callback(null, x));
                                        },
                                    }).then((results) => {
                                        this.setState({ showModal: true });
                                        this.setState({ modalHeader: 'Information' });
                                        this.setState({ modalText: 'Player data updated successfully.' });
                                        this.setState({ updateClickable: true });
                                        this.props.dispatch(setSummoner(JSON.parse(results.body_s)));
                                        this.props.dispatch(setRanking(JSON.parse(results.body_r)));
                                        this.props.dispatch(setHistogram(JSON.parse(results.body_d)));
                                        this.props.dispatch(setLeagueRanking(JSON.parse(results.body_rr)));
                                        this.props.dispatch(setLeagueHistogram(JSON.parse(results.body_rd)));
                                        this.props.dispatch(showPlayerStats());
                                    });
                                }).catch((error) => {
                                    this.setState({ showModal: true, modalHeader: 'Error' });
                                    console.log(error);
                                    if (error.statusCode === 500) this.setState({ modalText: 'There was a server-side error.' });
                                    else this.setState({ modalText: 'There was an error while connecting. Please try again later.' });
                                    this.setState({ updateClickable: true });
                                });

                                event.preventDefault();
                            }} />
                        </div>
                    </div>
                    <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.modalHeader}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{this.state.modalText}</Modal.Body>
                    </Modal>
                </div>
                <PlayerTabPanel className="player-tab-panel" />
            </div>
        );
    }
}

export default StatsPanel;
