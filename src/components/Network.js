import React from "react";
import ForceGraph3D from "react-force-graph-3d";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import FEBE from "../methods/FEBE"
import Spinner from "react-bootstrap/Spinner";
import { setSummoner, setRanking, setHistogram, updateNodes, updateLinks, showPlayerStats } from "../actions/actions";

class Network extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: uuidv4(),
            showModal: false,
            modalHeader: "",
            modalText: "",
            showSpinner: false,
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <ForceGraph3D
                    graphData={this.props.network}
                    backgroundColor="#00000000"
                    showNavInfo={false}
                    nodeColor={(d) => d.id == this.props.selected ? "#192841": "#10cdde"}
                    linkColor={() => "#666666"}
                    linkOpacity={1}
                    nodeResolution={16}
                    nodeLabel={d => `<span class="node">${d.id}</span>`}
                    onNodeClick={(node, event) => {
                        if(window.onLine || navigator.onLine){
                            this.setState({showSpinner: true});
                            let request_options_u = {
                                server: node.server,
                                username: node.id,
                                type: "update",
                            };

                            let request_options_n = {
                                server: node.server,
                                username: node.id,
                                type: "social/frequent",
                            }

                            FEBE.request(request_options_u).then(() => {
                                FEBE.request(request_options_n).then((body_n) => {
                                    this.props.dispatch(updateNodes(JSON.parse(body_n).nodes))
                                    this.props.dispatch(updateLinks(JSON.parse(body_n).links))
                                    this.setState({showSpinner: false});
                                });
                            }).catch((error) => {
                                this.setState({showSpinner: false});
                                this.setState({showModal: true});
                                this.setState({modalHeader: "Error"});
                                if(error == 404) this.setState({modalText: "Username not found in server."});
                                else if(error == 500) this.setState({modalText: "There was a server-side error."});
                                else this.setState({modalText: "There was an error while attempting this search."});
                            });
                        } else {
                            this.setState({showSpinner: false});
                            this.setState({showModal: true});
                            this.setState({modalHeader: "Error"});
                            this.setState({modalText: "You are offline. Please reconnect to search."});
                        }
                        event.preventDefault();
                    }}

                    onNodeRightClick={(node, event) => {
                        this.setState({showSpinner: true});
                        if(window.onLine || navigator.onLine){
                            let request_options_u = {
                                server: node.server,
                                username: node.id,
                                type: "update",
                            };
                
                            let request_options_s = {
                                server: node.server,
                                username: node.id,
                                type: "summoner",
                            };
                            
                            let request_options_r = {
                                server: node.server,
                                username: node.id,
                                type: "mastery/ranking",
                            };
                
                            let request_options_d = {
                                type: "mastery/distribution",
                            };
                
                            let request_options_n = {
                                server: node.server,
                                username: node.id,
                                type: "social/frequent",
                            };
                
                            FEBE.request(request_options_u).then(() => {
                                FEBE.request(request_options_s).then((body_s) => {
                                    FEBE.request(request_options_r).then((body_r) => {
                                        FEBE.request(request_options_d).then((body_h) => {
                                            FEBE.request(request_options_n).then((body_n) => {
                                                console.log(body_n);
                                                this.setState({showSpinner: false});
                                                this.props.dispatch(setSummoner(JSON.parse(body_s)));
                                                this.props.dispatch(showPlayerStats());
                                                this.props.dispatch(setRanking(JSON.parse(body_r)));
                                                this.props.dispatch(setHistogram(JSON.parse(body_h)));
                                                this.props.dispatch(updateNodes(JSON.parse(body_n).nodes));
                                                this.props.dispatch(updateLinks(JSON.parse(body_n).links));
                                            });
                                        });
                                    });
                                });
                            }).catch((error) => {
                                this.setState({showSpinner: false});
                                this.setState({showModal: true});
                                this.setState({modalHeader: "Error"});
                                if(error == 404) this.setState({modalText: "Username not found in server. Please check your username spelling and server and try again."});
                                else if(error == 500) this.setState({modalText: "There was a server-side error."});
                                else this.setState({modalText: "There was an error while attempting this search. Please check your username and server and try again."});
                            });
                        } else {
                            this.setState({showSpinner: false});
                            this.setState({showModal: true});
                            this.setState({modalHeader: "Error"});
                            this.setState({modalText: "You are offline. Please reconnect to search."});
                        }
                    }}
                />
                <div className="network-spinner">
                    {this.state.showSpinner && <Spinner animation="border" variant="secondary" size="lg" />}
                </div>
                <p align="right" className="network-instructions">left-click node to expand network, right-click node for player details</p>
                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.modalText}</Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default Network;