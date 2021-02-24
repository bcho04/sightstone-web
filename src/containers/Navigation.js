import { connect } from 'react-redux';
import Navigation from '../components/Navigation';

const mapStateToProps = (state) => ({
    hasSearched: !(Object.keys(state.info.summoner).length === 0 && state.info.summoner.constructor === Object),
});

const ConnectedNavigation = connect(mapStateToProps)(Navigation);

export default ConnectedNavigation;
