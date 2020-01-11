import { connect } from "react-redux";
import StatsPanel from "../components/StatsPanel";

const mapStateToProps = (state) => {
    let lastPlayed = new Date(Math.max.apply(Math, Object.values(state.info.data).map((obj) => obj.time)));
    let sincePlayed = (Date.now() - lastPlayed);

    let seconds = Math.round(sincePlayed / 1000);
    let minutes = Math.round(sincePlayed / (1000 * 60));
    let hours = Math.round(sincePlayed / (1000 * 60 * 60));
    let days = Math.round(sincePlayed / (1000 * 60 * 60 * 24));
    let months = Math.round(sincePlayed / (1000 * 60 * 60 * 24 * 30));
    let years = Math.round(sincePlayed / (1000 * 60 * 60 * 24 * 365));
    let sincePlayedString;

    if (lastPlayed.getTime() == 0) {
        sincePlayedString = "never";
    } else if (seconds < 60) {
        sincePlayedString = seconds.toString() + " second" + (seconds > 1 ? "s" : "") + " ago";
    } else if (minutes < 60) {
        sincePlayedString = minutes.toString() + " minute" + (minutes > 1 ? "s" : "") + " ago";
    } else if (hours < 24) {
        sincePlayedString = hours.toString() + " hour" + (hours > 1 ? "s" : "") + " ago";
    } else if (days < 30) {
        sincePlayedString = days.toString() + " day" + (days > 1 ? "s" : "") + " ago";
    } else if (months < 12) {
        sincePlayedString = months.toString() + " month" + (months > 1 ? "s" : "") + " ago";
    } else {
        sincePlayedString = years.toString() + " year" + (years > 1 ? "s" : "") + " ago";
    }

    let totalPoints = Object.values(state.info.data).map(item => item.points).reduce((prev, next) => prev + next, 0);
    let masteryScore = Object.values(state.info.data).map(item => item.level).reduce((prev, next) => prev + next, 0);

    return {
        className: state.render.show == "PLAYER_STATS" ? "show" : "hide",
        server: state.info.server,
        username: state.info.username,
        lastPlayed: sincePlayedString,
        totalPoints,
        masteryScore,
    };
}

const PlayerStatsPanel = connect(mapStateToProps)(StatsPanel);

export default PlayerStatsPanel;