import React from 'react';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

class ChampionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            champion: '',
        };
    }

    render() {
        const championPanelList = [];
        Object.keys(this.props.leaderboard).sort().forEach((key) => {
            championPanelList.push(
                <ListGroup.Item action onClick={(event) => {
                    this.setState({ champion: key });
                    event.preventDefault();
                }}>
                    <center>{key}</center>
                </ListGroup.Item>,
            );
        });

        const tableEntries = [];
        Object.keys(this.props.leaderboard).sort().forEach((key) => {
            const tableListEntries = [];
            this.props.leaderboard[key].forEach((elem, index) => {
                tableListEntries.push(
                    <tr>
                        <td>{index + 1}</td>
                        <td>{elem.name}</td>
                        <td>{elem.server}</td>
                        <td>{elem.masteryPoints}</td>
                        <td>{elem.masteryLevel}</td>
                        <td>{new Date(elem.lastPlayTime).toLocaleString()}</td>
                    </tr>,
                );
            });

            tableEntries.push(
                <Tab.Pane active={this.state.champion === key} className={this.props.className}>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Server</th>
                                <th>Mastery Points</th>
                                <th>Mastery Level</th>
                                <th>Last Played</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableListEntries}
                        </tbody>
                    </Table>
                </Tab.Pane>,
            );
        });

        return (
            <div className={this.props.className}>
                <Tab.Container>
                    <Row style={{ width: '90vw' }}>
                        <Col xs={2}>
                            <ListGroup variant="flush" className="leaderboard-panel-lg">
                                {championPanelList}
                            </ListGroup>
                        </Col>
                        <Col xs={10}>
                            <Tab.Content className="leaderboard-table">
                                {tableEntries}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

export default ChampionPanel;
