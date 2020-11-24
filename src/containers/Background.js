import { connect } from "react-redux";
import Background from "../components/Background";

const mapStateToProps = (state, ownProps) => {
    return {
        className: state.render.show == "INPUT_FORM" ? "show" : "hide"
    };
}

const ConnectedBackground = connect(mapStateToProps)(Background);

export default ConnectedBackground;