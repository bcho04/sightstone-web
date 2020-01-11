import { connect } from "react-redux";
import ChampionPanel from "../components/ChampionPanel";

const mapStateToProps = (state) => {
    return {
        className: state.render.show == "CHAMPION_STATS" ? "show" : "hide",
        leaderboard: state.info.leaderboard,
    };
}

const ChampionStatsPanel = connect(mapStateToProps)(ChampionPanel);

export default ChampionStatsPanel;