import React from "react";
import ReduxHeader from "./ReduxHeader";
import ReduxText from "./ReduxText";
import Button from "../components/Button";
import DataChart from "../components/DataChart";
import { setData } from "../actions/actions"
import { connect } from "react-redux";
import FEBE from "../methods/FEBE";
import Modal from "react-bootstrap/Modal";

class PlayerStatsTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalHeader: "",
            modalText: ""
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <div id="user-server">
                    <center>
                        <ReduxHeader type="username" className="redux-header" />
                        <ReduxText type="server" className="redux-text" />
                        <Button text="Update" className="button" onClick={(event) => {
                            let request_options = {
                                server: this.props.server,
                                username: this.props.username,
                                type: "update"
                            };
                    
                            FEBE.request(request_options).then((body) => {
                                this.props.dispatch(setData(body.data));
                                this.setState({showModal: true});
                                this.setState({modalHeader: "Information"});
                                this.setState({modalText: "Player data update request successfully sent."});
                            }).catch((error) => {
                                this.setState({showModal: true, modalHeader: "Error"});
                                if(error == 404) this.setState({modalText: "Username not found in server. Please check your username and server spelling and try again."});
                                else if(error == 500) this.setState({modalText: "There was a server-side error."});
                                else this.setState({modalText: "There was an error while attempting this search. Please check your username and server and try again."});
                            });
                    
                            event.preventDefault();
                        }} />
                    </center>
                    <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})} animation={true}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.modalHeader}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{this.state.modalText}</Modal.Body>
                    </Modal>
                </div>
                <div id="charts"></div>
                <div id="chart-scripts"></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        className: state.render.playerStats ? "show" : "hide",
        server: state.info.server,
        username: state.info.username
    };
}

const PlayerStatsPanel = connect(mapStateToProps)(PlayerStatsTemplate);

export default PlayerStatsPanel;