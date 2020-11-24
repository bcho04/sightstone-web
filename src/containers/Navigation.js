import { connect } from "react-redux";
import Navigation from "../components/Navigation";

const mapStateToProps = (state) => {
    return {
        hasSearched: !(Object.keys(state.info.summoner).length == 0 && state.info.summoner.constructor === Object) ? true : false,
    };
}

const ConnectedNavigation = connect(mapStateToProps)(Navigation);

export default ConnectedNavigation;