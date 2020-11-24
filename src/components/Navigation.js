import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import { setLeaderboard, showChampionStats, showNetwork } from '../actions/actions';
import FEBE from "../methods/FEBE";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalHeader: "",
            modalText: "",
        };
    }

    render(){
        return (
            <div>
                <Navbar bg="light" variant="light" fixed="top">
                    <Navbar.Brand href="index.html"><strong>Sightstone</strong></Navbar.Brand>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            {/* <Nav.Link onClick={(event) => {
                                this.props.dispatch(showInputForm());
                                event.preventDefault();
                            }}>Home</Nav.Link> */}
                            <Nav.Link onClick={(event) => {
                                if(this.props.hasSearched) {
                                    this.props.dispatch(showNetwork());
                                } else {
                                    this.setState({showModal: true});
                                    this.setState({modalHeader: "Information"});
                                    this.setState({modalText: "Please search for a user before using the Network feature."})
                                }
                                event.preventDefault();
                            }}>Network</Nav.Link>

                            <Nav.Link onClick={(event) => {
                                let request_options = {
                                    type: "mastery/leaderboard"
                                };

                                FEBE.request(request_options).then((resp) => {
                                    this.props.dispatch(setLeaderboard(JSON.parse(resp)));
                                    this.props.dispatch(showChampionStats());
                                });
                                event.preventDefault();
                            }}>Leaderboards</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.modalText}</Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Navigation;