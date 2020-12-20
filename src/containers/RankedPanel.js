import { connect } from "react-redux";
import RankedPanel from "../components/RankedPanel";

const mapStateToProps = (state) => {
    return {
        className: state.render.show == "PLAYER_STATS" ? "show" : "hide",
        ranking: state.info.league.ranking,
        histogram: state.info.league.histogram,
    };
}

const ConnectedRankedPanel = connect(mapStateToProps)(RankedPanel);

export default ConnectedRankedPanel;