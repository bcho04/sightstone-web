import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import MasteryPanel from "../containers/MasteryPanel";
import RankedPanel from "../containers/RankedPanel";

class PlayerTabPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="player-tab-panel-div" className={this.props.className}>
                <Tabs defaultActiveKey="mastery" id="player-tab-panel">
                    <Tab eventKey="mastery" title="Mastery">
                        <MasteryPanel className="mastery-panel"/>
                    </Tab>
                    <Tab eventKey="ranked" title="Ranked">
                        <RankedPanel className="ranked-panel"/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default PlayerTabPanel;