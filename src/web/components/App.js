import React from "react";
import Background from "./Background"
import InputForm from "../containers/InputForm";
import PlayerStatsPanel from "../containers/PlayerStatsPanel";

class App extends React.Component {
    render() {
        return (
            <div>
                <div id="background">
                    <Background />
                </div>
                <div class="screen-center" id="input">
                    <InputForm placeholder="Enter summoner..." />
                </div>
                <div>
                    <div class="player-info" id="player-info">
                        <PlayerStatsPanel />
                    </div>
                    <div id="charts"></div>
                </div>
                <div id="footer"  class="small-font">
                    <center>
                        <p>Terms of Service</p>
                        <p>Privacy Policy</p>
                        <p>► © 2019 Brandon Cho. All rights reserved.</p>
                    </center>
                </div>
            </div>
        );
    }
}

export default App;