import React from "react";
import { Line, Chart} from "react-chartjs-2";
import { v4 as uuidv4 } from "uuid";

class DistributionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: uuidv4(),
        }
    }

    render() {
        let graph = {
            labels: [...Array(41).keys()].map(x => 25000*x),
            datasets: [
                {
                    label: 'Number of People',
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: this.props.data,
                }
            ]
        };
        return (
            <div className={this.props.className} id={this.state.uuid}>
                <Line data={graph}
                    options={{
                        title: {
                            display: true,
                            text: this.props.champion + ' Mastery Distribution (' + this.props.rank + ')',
                            fontSize: 20,
                        },
                        lineAtIndex: [this.props.lineIndex],
                    }}
                />
            </div>
        );
    }
}

export default DistributionChart;