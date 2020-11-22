import React from "react";
import Button from "../components/Button";
import FEBE from "../methods/FEBE";
import Modal from "react-bootstrap/Modal";
import ChampionMasteryPanel from "../containers/MasteryPanel";
import { setSummoner, setRanking, setHistogram, showPlayerStats } from "../actions/actions";

class StatsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalHeader: "",
            modalText: "",
            updateClickable: true
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <div id="user-server">
                    <div className="name-header">
                        <h2>{this.props.username}</h2>
                        <span>{this.props.server}</span>
                        <span>(<b>{this.props.totalPoints}</b> total points | <b>{this.props.masteryScore}</b> mastery score)</span>
                        <div className="user-server-right">
                            <span style={{marginRight: "10px"}}>Last played: <b>{this.props.lastPlayed}</b></span>
                            <Button text="Update" className="button" disabled={!this.state.updateClickable} onClick={(event) => {
                                this.setState({updateClickable: false});

                                let request_options_u = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: "update",
                                };
                    
                                let request_options_s = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: "summoner",
                                };
                                
                                let request_options_r = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: "mastery/ranking",
                                };
                    
                                let request_options_d = {
                                    type: "mastery/distribution",
                                };
                                
                                FEBE.request(request_options_u).then(() => {
                                    FEBE.request(request_options_s).then((body_s) => {
                                        FEBE.request(request_options_r).then((body_r) => {
                                            FEBE.request(request_options_d).then((body_h) => {
                                                this.setState({showModal: true});
                                                this.setState({modalHeader: "Information"});
                                                this.setState({modalText: "Player data updated successfully."});
                                                this.setState({updateClickable: true});
                                                this.props.dispatch(setSummoner(JSON.parse(body_s)));
                                                this.props.dispatch(showPlayerStats());
                                                this.props.dispatch(setRanking(JSON.parse(body_r)));
                                                this.props.dispatch(setHistogram(JSON.parse(body_h)));
                                            });
                                        });
                                    });
                                }).catch((error) => {
                                    this.setState({showModal: true, modalHeader: "Error"});
                                    if(error == 500) this.setState({modalText: "There was a server-side error."});
                                    else this.setState({modalText: "There was an error while connecting. Please try again later."});
                                    this.setState({updateClickable: true});
                                });
                        
                                event.preventDefault();
                            }} />
                        </div>
                    </div>
                    <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})} animation={true}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.modalHeader}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{this.state.modalText}</Modal.Body>
                    </Modal>
                </div>
                <ChampionMasteryPanel className="mastery-panel" />
            </div>
        );
    }
}

export default StatsPanel;