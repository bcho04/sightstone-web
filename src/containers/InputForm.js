import { connect } from 'react-redux';
import NameForm from '../components/NameForm';

const mapStateToProps = (state, ownProps) => ({
    server: state.info.server,
    username: state.info.username,
    placeholder: ownProps.placeholder,
    className: state.render.show === 'INPUT_FORM' ? 'show' : 'hide',
});

const InputForm = connect(mapStateToProps)(NameForm);

export default InputForm;
