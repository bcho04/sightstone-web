import React from "react";
import DistributionChart from "./DistributionChart";
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
        Object.keys(this.props.championData).sort((a, b) => this.props.championData[b].points - this.props.championData[a].points).forEach((key) => {
            let variant = "secondary";
            if (this.props.championData[key].level == 7) variant = "info";
            if (this.props.championData[key].level == 6) variant = "m6";
            if (this.props.championData[key].level == 5) variant = "danger";

            championPanelList.push(
                <ListGroup.Item action href={"#"+key}>
                    {key}
                        <Badge variant={variant} style={{float: "right", marginTop: '3px'}}>{this.props.championData[key].points}</Badge>
                </ListGroup.Item>
            );
        });

        let championTabContent = [];
        Object.keys(this.props.championData).sort().forEach((key) => {
            let currentObj = this.props.championData[key];
            let currentHist = this.props.histogramData[key];
            championTabContent.push(
                <Tab.Pane eventKey={"#"+key}>
                    <DistributionChart champion={key} data={currentHist}
                        rank={currentObj.pos != -1 ? "Rank: " + currentObj.pos.toString() + " / " + currentObj.total.toString() : "not ranked"}
                        lineIndex={Math.min(Math.floor(this.props.championData[key].points/10000), 50)}
                    />
                </Tab.Pane>
            );
        });

        return (
            <div id="mastery-panel" className={this.props.className}>
                <Tab.Container>
                    <Row style={{width: '95vw'}}>
                        <Col xs={2}>
                            <ListGroup variant="flush" className="mastery-panel-lg">
                                {championPanelList}
                            </ListGroup>
                        </Col>
                        <Col xs={10}>
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