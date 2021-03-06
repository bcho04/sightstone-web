import React from 'react';
import Chart from 'chart.js';
import InputForm from '../containers/InputForm';
import StatsPanel from '../containers/StatsPanel';
import Navigation from '../containers/Navigation';
import ChampionPanel from '../containers/ChampionPanel';
import Network from '../containers/Network';

class App extends React.Component {
    render() {
        Chart.defaults.global.defaultFontFamily = "'Exo 2'";

        // Vertical line plugin from https://stackoverflow.com/questions/30256695/chart-js-drawing-an-arbitrary-vertical-line.
        const verticalLinePlugin = {
            getLinePosition(chart, pointIndex) {
                const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
                const { data } = meta;
                return data[pointIndex]._model.x;
            },
            renderVerticalLine(chartInstance, pointIndex) {
                const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
                const scale = chartInstance.scales['y-axis-0'];
                const context = chartInstance.chart.ctx;

                // render vertical line
                context.beginPath();
                context.strokeStyle = '#ff0000';
                context.moveTo(lineLeftOffset, scale.top);
                context.lineTo(lineLeftOffset, scale.bottom);
                context.stroke();

                // write label
                context.fillStyle = '#ff0000';
                context.textAlign = 'center';
                // context.fillText('You', lineLeftOffset, 0.03 * (scale.bottom - scale.top) + scale.top);
            },

            afterDatasetsDraw(chart, easing) {
                if (chart.config.options.lineAtIndex) {
                    chart.config.options.lineAtIndex.forEach((pointIndex) => this.renderVerticalLine(chart, pointIndex));
                }
            },
        };

        Chart.plugins.register(verticalLinePlugin);

        return (
            <div>
                <div className="navbar" id="navbar">
                    <Navigation />
                </div>
                <div id="background" className="background" />
                <div className="screen-center" id="input">
                    <InputForm placeholder="Enter summoner..." />
                </div>
                <div className="network" id="network">
                    <Network />
                </div>
                <div className="player-info" id="player-info">
                    <StatsPanel />
                </div>
                <div className="champion-stats" id="player-stats">
                    <ChampionPanel />
                </div>
                <div id="footer" className="small-font footer">
                    <footer>
                        <div className="container">
                            <p>©&nbsp;<a href="https://github.com/bcho04">Brandon Cho</a> 2020-2021. All rights reserved.</p>
                            <hr></hr>
                            <p>Sightstone isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing<br></br>
                            League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.<br></br></p>
                            {/* <ul className="list-inline">
                                <li className="list-inline-item"><a href="index.html">Home</a></li>
                                <li className="list-inline-item"><a href="legal.html">Legal</a></li>
                            </ul> */}
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;
