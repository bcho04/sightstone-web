import { connect } from "react-redux";
import StatsPanel from "../components/StatsPanel";

const mapStateToProps = (state) => {
    return {
        className: state.render.playerStats ? "show" : "hide",
        server: state.info.server,
        username: state.info.username
    };
}

const PlayerStatsPanel = connect(mapStateToProps)(StatsPanel);

export default PlayerStatsPanel;