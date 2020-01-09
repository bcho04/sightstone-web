import { connect } from "react-redux";
import MasteryPanel from "../components/MasteryPanel";

const mapStateToProps = (state) => {
    return {
        className: state.render.playerStats ? "show" : "hide",
        championData: state.info.data,
    };
}

const ChampionMasteryPanel = connect(mapStateToProps)(MasteryPanel);

export default ChampionMasteryPanel;