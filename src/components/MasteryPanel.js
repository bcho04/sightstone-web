import React from "react";
import DataChart from "./DataChart";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

class MasteryPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let championPanelList = [];
        Object.keys(this.props.championData).sort().forEach((key) => {
            championPanelList.push(
                <ListGroup.Item action href={"#"+key}>
                    {key}
                        <Badge variant="secondary" style={{float: "right", marginTop: '3px'}}>{this.props.championData[key].points}</Badge>
                </ListGroup.Item>
            );
        });

        let championTabContent = [];
        Object.keys(this.props.championData).sort().forEach((key) => {
            let currentObj = this.props.championData[key];
            championTabContent.push(
                <Tab.Pane eventKey={"#"+key}>
                    <h1>{currentObj.pos.toString() + " / " + currentObj.total.toString()}</h1>
                </Tab.Pane>
            );
        });
        

        return (
            <div id="mastery-panel" className={this.props.className}>
                <Tab.Container>
                    <Row>
                        <Col xs={2}>
                            <ListGroup variant="flush" className="mastery-panel-lg">
                                {championPanelList}
                            </ListGroup>
                        </Col>
                        <Col xs={8}>
                            <Tab.Content>
                                {championTabContent}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

export default MasteryPanel;