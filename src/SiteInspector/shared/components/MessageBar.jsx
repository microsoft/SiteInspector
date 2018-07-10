import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MessageBar as OfficeMessageBar } from 'office-ui-fabric-react/lib/MessageBar';

const MessageBar = ({ messages, removeMessage }) => (
  <div className="si-messages">
    {messages.map(message => (
      <OfficeMessageBar
        messageBarType={message.type
          ? message.type
          : 0}
        className={classnames({ collapsing: message.isCollapsing })}
        dismissButtonAriaLabel="Close"
        onDismiss={function () { removeMessage(message.key); }}
        key={message.key}
      >
        {message.text}
      </OfficeMessageBar>))}
  </div>
  );

MessageBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    isCollapsing: PropTypes.bool,
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.number,
    timeout: PropTypes.number,
  })),
  removeMessage: PropTypes.func.isRequired,
};

MessageBar.defaultProps = {
  messages: {},
};

export default MessageBar;
