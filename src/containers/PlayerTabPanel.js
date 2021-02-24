import { connect } from 'react-redux';
import PlayerTabPanel from '../components/PlayerTabPanel';

const mapStateToProps = (state) => ({
    className: state.render.show === 'PLAYER_STATS' ? 'show' : 'hide',
});

const ConnectedPlayerTabPanel = connect(mapStateToProps)(PlayerTabPanel);

export default ConnectedPlayerTabPanel;
