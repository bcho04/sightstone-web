import { connect } from "react-redux";
import Network from "../components/Network";

const mapStateToProps = (state) => {
    return {
        className: state.render.show == "NETWORK" ? "show" : "hide",
        network: JSON.parse(JSON.stringify(state.info.network)), // create deep copy
        selected: state.info?.summoner?.summoner?.name || "",
    };
}

const ChampionMasteryPanel = connect(mapStateToProps)(Network);

export default ChampionMasteryPanel;