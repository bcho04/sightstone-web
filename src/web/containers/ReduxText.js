import Text from "../components/Header";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
    return {
        text: state.info[ownProps.type],
        className: ownProps.className
    };
}

const ReduxText = connect(mapStateToProps)(Text);

export default ReduxText;