import React from 'react';
import PropTypes from 'prop-types';

class TagList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      tags: (this.props.input.value && Array.isArray(this.props.input.value) ?
        this.props.input.value : []),
      onChange: this.props.input && this.props.input.onChange ? this.props.input.onChange : null,
      onBlur: this.props.input && this.props.input.onBlur ? this.props.input.onBlur : null,
    };
  }

  addTagClick() {
    this.setState({
      isAdding: true,
    });
    if (this.state.onBlur) {
      this.state.onBlur(this.state.tags || []);
    }
  }

  cancelTag() {
    this.setState({
      isAdding: false,
    });
    if (this.state.onBlur) {
      this.state.onBlur(this.state.tags || []);
    }
  }

  addTag(newTag) {
    if (newTag) {
      const tags = [...this.state.tags] || [];
      newTag.split(';').forEach((tag) => {
        tag = tag.trim();
        if (tag && tags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });
      this.setState({
        isAdding: false,
        tags,
      });
      if (this.state.onChange) {
        this.state.onChange(tags);
      }
      if (this.state.onBlur) {
        this.state.onBlur(tags);
      }
    }
  }

  deleteTag(tag) {
    if (tag) {
      const tags = [...this.state.tags] || [];
      const tagIndex = this.state.tags.indexOf(tag);
      if (tagIndex >= 0) {
        tags.splice(tagIndex, 1);
        this.setState({
          tags,
        });
        if (this.state.onChange) {
          this.state.onChange(tags);
        }
      }
      if (this.state.onBlur) {
        this.state.onBlur(tags);
      }
    }
  }

  renderAddTag() {
    return (
      <input
        className="si-tag-input c-text-field" autoFocus type="text" placeholder="Tag Name" maxLength="30"
        title="Input new tag name, escape to cancel"
        onKeyDown={(event) => {
          if (event.keyCode === 13) event.preventDefault();
          if (event.keyCode === 27) this.cancelTag();
        }}
        onKeyUp={(event) => {
          if (event.keyCode === 13) {
            this.addTag(event.target.value);
          }
        }}
        onBlur={(event) => {
          if (event.target.value.trim().length === 0) {
            this.cancelTag();
          } else {
            this.addTag(event.target.value);
          }
        }}
      />);
  }

  render() {
    const tagClass = `si-tag-list ${this.props.className}`;
    return (
      <div id={this.props.id} className={tagClass}>
        {this.state.tags.map(value =>
          <span key={`${value}`} className="si-tag-container" tabIndex="0">
            <span className="si-tag-label" title={`${value} tag`}>{value}</span>
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
            <span className="si-tag-button" role="button" title={`Remove ${value} tag`} aria-label={`Remove ${value} tag`} onClick={() => { this.deleteTag(value); }} tabIndex="0">
              <span className="si-tag-delete-icon" />
            </span>
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
          </span>,
        )}

        {this.state.isAdding ? this.renderAddTag() : (
          <span className="si-tag-container">
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
            <span
              role="button"
              className="si-tag-button"
              title="Add new tag"
              aria-label="Add new tag"
              onClick={() => { this.addTagClick(); }}
              onKeyUp={(event) => { if (event.keyCode === 13) this.addTagClick(); }}
              tabIndex="0"
            >
              <span className="si-tag-add-icon" />
            </span>
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
          </span>
         )}
      </div>
    );
  }
}

TagList.defaultProps = {
  id: '',
  className: undefined,
  input: {
    value: '',
  },
};

TagList.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

module.exports = {
  TagList,
  ArrayLimit: (
    limit => (value) => {
      if (value && value instanceof Array) {
        if (value.length > limit) {
          return `Maximum limit is ${limit} items`;
        }
      }
      return undefined;
    }
  ),
};
