import { connect } from 'react-redux';
import Network from '../components/Network';

const mapStateToProps = (state) => {
    const propNetwork = JSON.parse(JSON.stringify(state.info.network)); // create deep copy
    propNetwork.links.forEach((link) => {
        const a = propNetwork.nodes.find((node) => node.id === link.source);
        const b = propNetwork.nodes.find((node) => node.id === link.target);
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(JSON.parse(JSON.stringify(b)));
        b.neighbors.push(JSON.parse(JSON.stringify(a)));

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(JSON.parse(JSON.stringify(link)));
        b.links.push(JSON.parse(JSON.stringify(link)));
    });

    return {
        className: state.render.show === 'NETWORK' ? 'show' : 'hide',
        network: propNetwork,
        selected: state.info?.summoner?.summoner?.name || '',
    };
};

const ChampionMasteryPanel = connect(mapStateToProps)(Network);

export default ChampionMasteryPanel;
