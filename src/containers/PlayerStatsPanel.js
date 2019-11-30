import React from "react";
import ReduxHeader from "./ReduxHeader";
import ReduxText from "./ReduxText";
import Button from "../components/Button";
import DataChart from "../components/DataChart";
import { setData } from "../actions/actions"
import { connect } from "react-redux";
import FEBE from "../methods/FEBE";

class PlayerStatsTemplate extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <div id="user-server">
                    <center>
                        <ReduxHeader type="username" className="redux-header" />
                        <ReduxText type="server" className="redux-text" />
                        <Button text="Update" className="button" onClick={(event) => {
                            let request_options = {
                                server: this.props.server,
                                username: this.props.username,
                                type: "update"
                            };
                    
                            FEBE.request(request_options).then((body) => {
                                this.props.dispatch(setData(body.data));
                            }).catch((error) => {
                                if(error == 404) alert("Username not found in server. Please check your username spelling and server and try again.");
                                else if(error == 500) alert("There was a server-side error.");
                                else alert("There was an error while attempting this search. Please check your username and server and try again.");
                            });
                    
                            event.preventDefault();
                        }} />
                    </center>
                </div>
                <div id="charts">
                    <DataChart width="300" height="200" options={{
                        type: "bar",
                        data: {
                            labels: ["a", "b", "c"],
                            datasets: [{
                                label: "X",
                                data: [1,2,3],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                ],
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    }} />
                </div>
                <div id="chart-scripts"></div>
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