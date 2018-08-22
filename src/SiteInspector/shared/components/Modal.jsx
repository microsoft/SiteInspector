import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const Modal = ({ visible, title, closeHandler, displayUI, contentOverride }) => (
  <ReactModal
    isOpen={visible}
    onRequestClose={closeHandler}
    style={contentOverride}
    contentLabel={title}
    overlayClassName="si-modal-overlay"
    className="si-modal-dialog"
    shouldCloseOnOverlayClick
  >
    <div className="si-modal-content">
      <div className="si-modal-header">
        <div className="si-modal-header-title">{title}</div>
        <a href="javascript:void(0)" className="si-close-panel-icon c-glyph glyph-clear" onClick={closeHandler} />
      </div>
      <div className="si-modal-body">
        {displayUI}
      </div>
    </div>
  </ReactModal>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  displayUI: PropTypes.node.isRequired,
  contentOverride: PropTypes.shape(),
};

Modal.defaultProps = {
  contentOverride: undefined,
};

export default Modal;
