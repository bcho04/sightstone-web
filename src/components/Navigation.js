import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { setLeaderboard, showChampionStats } from '../actions/actions';
import FEBE from "../methods/FEBE";

class Navigation extends React.Component {
    render(){
        return (
            <Navbar bg="light" variant="light" fixed="top">
                <Navbar.Brand href="index.html"><strong>Sightstone</strong></Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        {/* <Nav.Link onClick={(event) => {
                            this.props.dispatch(showInputForm());
                            event.preventDefault();
                        }}>Home</Nav.Link> */}
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
        );
    }
}

export default Navigation;