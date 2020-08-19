import React from "react";
import Button from "../components/Button";
import FEBE from "../methods/FEBE";
import Modal from "react-bootstrap/Modal";
import ChampionMasteryPanel from "../containers/MasteryPanel";

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

                                let update_options = {
                                    server: this.props.server,
                                    username: this.props.username,
                                    type: "update",
                                };
                                
                                FEBE.request(update_options).then(() => {
                                    this.setState({showModal: true});
                                    this.setState({modalHeader: "Information"});
                                    this.setState({modalText: "Player data updated successfully."});
                                    this.setState({updateClickable: true});
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