import { connect } from "react-redux";
import Background from "../components/Background";

const mapStateToProps = (state, ownProps) => {
    return {
        className: ["INPUT_FORM", "CHAMPION_STATS"].includes(state.render.show) ? "show" : "hide"
    };
}

const ConnectedBackground = connect(mapStateToProps)(Background);

export default ConnectedBackground;