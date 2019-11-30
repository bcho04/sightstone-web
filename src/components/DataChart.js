import React from "react";
import * as Chart from "chart.js";
import uuidv4 from "uuid/v4";

class DataChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: uuidv4()
        }
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.async = true;
        script.text = `
            var ctx = document.getElementById("${this.state.uuid}").getContext('2d');
            var ct = new Chart(ctx, ${JSON.stringify(this.props.options)});
            ct.canvas.parentNode.style.height = '60%';
            ct.canvas.parentNode.style.width = '60%';
        `;
        document.getElementById("chart-scripts").appendChild(script);
    }

    render() {
        return (
            <div className={this.props.className}>
                <canvas id={this.state.uuid}></canvas>
            </div>
        );
    }
}

export default DataChart;