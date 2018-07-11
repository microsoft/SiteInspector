import { connect } from 'react-redux';
import ContactViewer from './component';

const mapStateToProps = state => ({
  title: state.ContactViewerState.title,
  email: state.ContactViewerState.email,
});

const ContactViewerContainer = connect(
    mapStateToProps,
)(ContactViewer);

export default ContactViewerContainer;
