import Header from "../components/Header";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
    return {
        text: state.info[ownProps.type],
        className: ownProps.className
    };
}

const ReduxHeader = connect(mapStateToProps)(Header);

export default ReduxHeader;