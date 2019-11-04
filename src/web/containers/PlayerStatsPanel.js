import React from "react";
import ReduxHeader from "./ReduxHeader";
import ReduxText from "./ReduxText";
import Button from "../components/Button";
import { connect } from "react-redux";
import FEBE from "../methods/FEBE";

class PlayerStatsTemplate extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <center>
                    <ReduxHeader type="username" className="redux-header" />
                    <ReduxText type="server" className="redux-text" />
                    <Button text="Update" className="button" onClick={(event) => {
                        let request_options = {
                            server: this.props.server,
                            username: this.props.username,
                            type: "update"
                        };
                
                        FEBE.request(request_options);
                
                        event.preventDefault();
                    }} />
                </center>
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