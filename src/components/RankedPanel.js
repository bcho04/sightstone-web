import React from "react";
import DistributionChart from "./DistributionChart";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

class RankedPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "solo"
        }
    }

    render() {
        if(this.props.ranking?.RANKED_SOLO_5x5?.pos == -1 && this.props.ranking?.RANKED_FLEX_SR?.pos == -1) {
            return (
                <div id="ranked-panel" className={this.props.className}>
                    <div className="centered">
                        <h2 style={{color: "#606060"}}>unranked</h2>
                    </div>
                </div>
            )
        }

        let soloRank = (this.props.ranking?.RANKED_SOLO_5x5?.pos || -1) != -1 ? "Rank: " + this.props.ranking.RANKED_SOLO_5x5.pos.toString() + " / " + this.props.ranking.RANKED_SOLO_5x5.total.toString() : "not ranked";
        let flexRank = (this.props.ranking?.RANKED_FLEX_SR?.pos || -1) != -1 ? "Rank: " + this.props.ranking.RANKED_FLEX_SR.pos.toString() + " / " + this.props.ranking.RANKED_FLEX_SR.total.toString() : "not ranked";

        return (
            <div id="ranked-panel" className={this.props.className}>
                <Tab.Container unmountOnExit={true}>
                    <Row style={{width: '95vw'}}>
                        <Col xs={2}>
                            <ListGroup variant="flush" className="ranked-panel-lg">
                                <ListGroup.Item action onClick={(event) => {
                                    this.setState({view: "solo"});
                                    event.preventDefault();
                                }}>
                                    {"Solo/Duo"}
                                        <Badge variant="info" style={{float: "right", marginTop: '3px'}}>{this.props.ranking.RANKED_SOLO_5x5?.equivalentRank}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item action onClick={(event) => {
                                    this.setState({view: "flex"});
                                    event.preventDefault();
                                }}>
                                    {"Flex"}
                                        <Badge variant="info" style={{float: "right", marginTop: '3px'}}>{this.props.ranking.RANKED_FLEX_SR?.equivalentRank}</Badge>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col xs={10}>
                            <Tab.Content>
                                <Tab.Pane active={this.state.view == "solo"} unmountOnExit={true} className={this.props.className}>
                                    <DistributionChart 
                                        data={this.props.histogram.RANKED_SOLO_5x5 || []} 
                                        xLabel="Total League Points" 
                                        title={"Solo/Duo Ranked Distribution (" + soloRank + ")"}
                                        lineIndex={Math.min(Math.floor(this.props.ranking.RANKED_SOLO_5x5?.equivalentRank/50), 90)}
                                    />
                                </Tab.Pane>
                                <Tab.Pane active={this.state.view == "flex"} unmountOnExit={true} className={this.props.className}>
                                    <DistributionChart 
                                        data={this.props.histogram.RANKED_FLEX_SR || []} 
                                        xLabel="Total League Points" 
                                        title={"Flex Ranked Distribution (" + flexRank + ")"}
                                        lineIndex={Math.min(Math.floor(this.props.ranking.RANKED_FLEX_SR?.equivalentRank/50), 90)}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

export default RankedPanel;