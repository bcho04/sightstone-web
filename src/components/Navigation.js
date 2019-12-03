import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class Navigation extends React.Component {
    render(){
        return (
            <Navbar bg="light" variant="light" fixed="top">
                <Navbar.Brand href="#home"><strong>Rubidium</strong></Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="index.html">Home</Nav.Link>
                        <Nav.Link href="index.html">Test</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;