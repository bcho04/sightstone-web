import { connect } from "react-redux";
import Navigation from "../components/Navigation";

const mapStateToProps = (state) => {
    return {
        hasSearched: state.render.show != "INPUT_FORM" ? true : false,
    };
}

const ConnectedNavigation = connect(mapStateToProps)(Navigation);

export default ConnectedNavigation;