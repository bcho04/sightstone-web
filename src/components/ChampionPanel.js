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
            let filename = key.toLowerCase().replace('\'', '').replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(' ', '').replace('.', '');
            if(key === 'Wukong') filename = 'MonkeyKing'; // Handle manual exceptions
            if(key === 'Nunu & Willump') filename = 'Nunu';
            if(key === 'Rek\'Sai') filename = 'RekSai';
            if(key === 'Kog\'Maw') filename = 'KogMaw';
            if(key === 'Jarvan IV') filename = 'JarvanIV';

            championPanelList.push(
                <ListGroup.Item action onClick={(event) => {
                    this.setState({ champion: key });
                    event.preventDefault();
                }}>
                    <center>
                        <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.PATCH}/img/champion/${filename}.png`} height='60px' />
                        <p style={{marginBottom: '0px'}}>{key}</p>
                    </center>
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
                    <Table striped hover responsive>
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

        const splashArtList = [];
        Object.keys(this.props.leaderboard).sort().forEach((key) => {
            let filename = key.toLowerCase().replace('\'', '').replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(' ', '').replace('.', '');
            if(key === 'Wukong') filename = 'MonkeyKing'; // Handle manual exceptions
            if(key === 'Nunu & Willump') filename = 'Nunu';
            if(key === 'Rek\'Sai') filename = 'RekSai';
            if(key === 'Kog\'Maw') filename = 'KogMaw';
            if(key === 'Jarvan IV') filename = 'JarvanIV';

            splashArtList.push(
                <Tab.Pane active={this.state.champion === key} className={this.props.className}>
                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${filename}_0.jpg`} />
                </Tab.Pane>,
            );
        });

        return (
            <div className={this.props.className} style={{width: Math.max(window.innerWidth, 1000)}}>
                <Tab.Container>
                    <Row>
                        <Col xs={1.5}>
                            <ListGroup variant="flush" className="leaderboard-panel-lg">
                                {championPanelList}
                            </ListGroup>
                        </Col>
                        <Col>
                            <Tab.Content className="leaderboard-table">
                                {tableEntries}
                            </Tab.Content>
                        </Col>
                        <Col xs={3}>
                            <Tab.Content>
                                {splashArtList}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

export default ChampionPanel;
