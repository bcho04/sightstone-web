import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import async from 'async';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import FEBE from '../methods/FEBE';
import {
    setSummoner, setRanking, setHistogram, setLeagueRanking, setLeagueHistogram, updateNetwork, showPlayerStats,
} from '../actions/actions';

class Network extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalHeader: '',
            modalText: '',
            showSpinner: false,
            clicked: [],
            highlightNodes: new Set(),
            highlightLinks: new Set(),
            hoverNode: null,
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <ForceGraph2D
                    graphData={this.props.network}
                    backgroundColor="#00000000"
                    showNavInfo={false}
                    nodeColor={(d) => {
                        if (d.name === this.props.selected) return '#192841';
                        if (this.state.clicked.includes(`${d.server} ${d.id}`)) return '#338fff';
                        return '#10cdde';
                    }}
                    linkColor={() => '#666666'}
                    linkVisibility={(link) => {
                        if (this.state.hoverNode === null) return true;
                        return !!this.state.highlightLinks.has(link.index);
                    }}
                    linkDirectionalParticles={1}
                    linkDirectionalParticleWidth={(link) => (this.state.highlightLinks.has(link.index) ? 4 : 0)}
                    height={window.innerHeight - 40}
                    width={window.innerWidth}
                    nodeResolution={16}
                    nodeLabel={(d) => `<span class="node">${`${d.name} (${d.server})`}</span>`}
                    onNodeClick={(node, event) => {
                        if (window.onLine || navigator.onLine) {
                            this.setState({ showSpinner: true });
                            const request_options_u = {
                                server: node.server,
                                username: node.name,
                                type: 'update',
                            };

                            const request_options_n = {
                                server: node.server,
                                username: node.name,
                                type: 'social/frequent',
                            };

                            FEBE.request(request_options_u).then((response_u) => {
                                if (response_u.statusCode === 429) this.setState({ modalText: `Already updated. Please try again in ${Math.floor(response_u.timeLeft / 1000)} seconds.` });
                                FEBE.request(request_options_n).then((body_n) => {
                                    this.props.dispatch(updateNetwork(JSON.parse(body_n)));
                                    this.setState({ showSpinner: false });
                                    this.setState({ clicked: this.state.clicked.concat(`${node.server} ${node.id}`) });
                                });
                            }).catch((error) => {
                                this.setState({ showSpinner: false });
                                this.setState({ showModal: true });
                                this.setState({ modalHeader: 'Error' });
                                if (error.statusCode === 404) this.setState({ modalText: 'Username not found in server.' });
                                else if (error.statusCode === 500) this.setState({ modalText: 'There was a server-side error.' });
                                else this.setState({ modalText: 'There was an error while attempting this search.' });
                            });
                        } else {
                            this.setState({ showSpinner: false });
                            this.setState({ showModal: true });
                            this.setState({ modalHeader: 'Error' });
                            this.setState({ modalText: 'You are offline. Please reconnect to search.' });
                        }
                        event.preventDefault();
                    }}

                    onNodeRightClick={(node, event) => {
                        if (window.onLine || navigator.onLine) {
                            this.setState({ showSpinner: true });
                            const request_options_u = {
                                server: node.server,
                                username: node.name,
                                type: 'update',
                            };

                            const request_options_s = {
                                server: node.server,
                                username: node.name,
                                type: 'summoner',
                            };

                            const request_options_r = {
                                server: node.server,
                                username: node.name,
                                type: 'mastery/ranking',
                            };

                            const request_options_d = {
                                type: 'mastery/distribution',
                            };

                            const request_options_rr = {
                                server: node.server,
                                username: node.name,
                                type: 'league/ranking',
                            };

                            const request_options_rd = {
                                server: node.server,
                                type: 'league/distribution',
                            };

                            const request_options_n = {
                                server: node.server,
                                username: node.name,
                                type: 'social/frequent',
                            };

                            FEBE.request(request_options_u).then((response_u) => {
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
                                    body_n: (callback) => {
                                        FEBE.request(request_options_n).then((x) => callback(null, x));
                                    },
                                    body_rr: (callback) => {
                                        FEBE.request(request_options_rr).then((x) => callback(null, x));
                                    },
                                    body_rd: (callback) => {
                                        FEBE.request(request_options_rd).then((x) => callback(null, x));
                                    },
                                }).then((results) => {
                                    this.setState({ showSpinner: false });
                                    this.props.dispatch(setSummoner(JSON.parse(results.body_s)));
                                    this.props.dispatch(showPlayerStats());
                                    this.props.dispatch(setRanking(JSON.parse(results.body_r)));
                                    this.props.dispatch(setHistogram(JSON.parse(results.body_d)));
                                    this.props.dispatch(setLeagueRanking(JSON.parse(results.body_rr)));
                                    this.props.dispatch(setLeagueHistogram(JSON.parse(results.body_rd)));
                                    this.props.dispatch(updateNetwork(JSON.parse(results.body_n)));
                                    this.setState({ clicked: this.state.clicked.concat(`${node.server} ${node.id}`) });
                                });
                            }).catch((error) => {
                                this.setState({ showSpinner: false });
                                this.setState({ showModal: true });
                                this.setState({ modalHeader: 'Error' });
                                if (error.statusCode === 404) this.setState({ modalText: 'Username not found in server. Please check your username spelling and server and try again.' });
                                else if (error.statusCode === 500) this.setState({ modalText: 'There was a server-side error.' });
                                else this.setState({ modalText: 'There was an error while attempting this search. Please check your username and server and try again.' });
                            });
                        } else {
                            this.setState({ showSpinner: false });
                            this.setState({ showModal: true });
                            this.setState({ modalHeader: 'Error' });
                            this.setState({ modalText: 'You are offline. Please reconnect to search.' });
                        }
                    }}

                    onNodeHover={(node) => {
                        const newHighlightNodes = new Set();
                        const newHighlightLinks = new Set();

                        if (node) {
                            this.props.network.nodes.filter((n) => n.id === node.id).forEach((node) => {
                                newHighlightNodes.add(node.index);
                                node.neighbors?.forEach((neighbor) => newHighlightNodes.add(neighbor.index)); // Maybe no neighbors
                                node.links?.forEach((link) => newHighlightLinks.add(link.index)); // Maybe no links
                            });
                        }

                        this.setState({ highlightNodes: newHighlightNodes });
                        this.setState({ highlightLinks: newHighlightLinks });
                        this.setState({ hoverNode: node?.index || null });
                    }}

                    onLinkHover={(link) => {
                        const newHighlightNodes = new Set();
                        const newHighlightLinks = new Set();

                        if (link) {
                            newHighlightLinks.add(link.index);
                            newHighlightNodes.add(link.source.index);
                            newHighlightNodes.add(link.target.index);
                        }
                        this.setState({ highlightNodes: newHighlightNodes });
                        this.setState({ highlightLinks: newHighlightLinks });
                    }}
                />
                <div className="network-spinner">
                    {this.state.showSpinner && <Spinner animation="border" variant="secondary" size="lg" />}
                </div>
                <p align="right" className="network-instructions">left-click node to expand network, right-click node for player details</p>
                <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.modalText}</Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Network;
