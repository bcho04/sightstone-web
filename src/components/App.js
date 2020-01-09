import React from "react";
import Background from "./Background"
import InputForm from "../containers/InputForm";
import StatsPanel from "../containers/StatsPanel";
import Navigation from "./Navigation";

class App extends React.Component {
    render() {
        return (
            <div>
                <div className="navbar" id="navbar">
                    <Navigation />
                </div>
                <div id="background" className="background">
                    <Background />
                </div>
                <div className="screen-center" id="input">
                    <InputForm placeholder="Enter summoner..." />
                </div>
                <div className="player-info" id="player-info">
                    <StatsPanel />
                </div>
                <div id="footer" className="small-font footer">
                    <footer>
                        <div className="container">
                            <p>©&nbsp;Brandon Cho 2020. All rights reserved.</p>
                            <p>We're open source! View our <a href="https://github.com/bcho04/sightstone">server</a> and <a href="https://github.com/bcho04/sightstone-web">web</a> source code.</p>
                            <hr></hr>
                            <p>Sightstone isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing<br></br>
                            League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.<br></br></p>
                            <ul className="list-inline">
                                <li className="list-inline-item"><a href="index.html">Home</a></li>
                                <li className="list-inline-item"><a href="legal.html">Legal</a></li>
                            </ul>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;