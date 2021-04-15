import React from 'react';
import Chart from 'chart.js/auto';
import deepEqual from 'deep-equal';
import { v4 as uuidv4 } from 'uuid';

class DistributionChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: uuidv4(),
        };
        this.chartRef = null;
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps, this.props);
    }

    componentDidMount() {
        if (this.chartRef) {
            this.chartRef.destroy();
        }

        const ctx = document.getElementById('chart-' + this.state.uuid).getContext('2d');
        const graph = {
            datasets: [
                {
                    label: 'Players',
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,0.5)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: this.props.data,
                },
            ],
        };
        const options = {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: this.props.xLabel,
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: this.props.title,
                    font: {
                        size: 20,
                    },
                },
            },
            lineAtIndex: [this.props.lineIndex],
        };

        const DistributionChart = new Chart(ctx, {
            type: 'line',
            data: graph,
            options: options,
        });

        this.chartRef = DistributionChart;
    }

    componentDidUpdate() {
        this.componentDidMount();
    }

    render() {
        return (
            <div className={this.props.className} id={this.state.uuid}>
                <canvas id={'chart-' + this.state.uuid} />
            </div>
        );
    }
}

export default DistributionChart;
