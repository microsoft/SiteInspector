import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Label, Select, Textarea, TextField } from './FluentWeb';
import { TagList, ArrayLimit } from './TagList';

class RenderField extends React.Component {
  componentDidMount() {
    // Hack: Fluent Web's Select component does not have type="button".
    if (this.props.type === 'select') {
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this.selectControl)
        .querySelector('button')
        .setAttribute('type', 'button');
    }

    // Hack: Fluent Web's TextArea does not support placeholder.
    if (this.props.type === 'textarea' && this.props.placeholder) {
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this.textareaControl)
        .querySelector('textarea')
        .setAttribute('placeholder', this.props.placeholder);
    }
  }

  render() {
    // Hack?: ensure className is a string, otherwise will get set as boolean
    const className = `${this.props.meta.touched &&
      ((this.props.meta.error && 'si-validation-error ') || (this.props.meta.warning && 'si-validation-warning ')) +
      (this.props.className ? this.props.className : '')}`;

    const renderDynamicContent = () => {
      switch (this.props.type) {
        case 'textarea':
          return (
            <div>
              <Textarea
                {...this.props.input}
                className={className}
                id={this.props.id}
                label={{ text: this.props.label }}
                readOnly={this.props.readOnly}
                ref={(textareaControl) => { this.textareaControl = textareaControl; }}
                rows={this.props.rows}
              />
            </div>);
        case 'select':
          return (<Select
            border
            className={className}
            id={this.props.id}
            label={{ text: this.props.label }}
            onChange={this.props.input.onChange}
            options={this.props.options.map(listItem => ({
              key: listItem,
              value: listItem,
              text: listItem,
            }))}
            ref={(selectControl) => { this.selectControl = selectControl; }}
            value={this.props.input.value}
          />);
        case 'taglist':
          return (<div>
            <Label text={this.props.label} />
            <TagList
              id={this.props.id}
              className={className}
              meta={this.props.meta}
              input={this.props.input}
            />
          </div>);
        default:
          return (<div>
            <Label text={this.props.label} />
            <TextField
              {...this.props.input}
              className={className}
              id={this.props.id}
              placeholder={this.props.placeholder}
              readOnly={this.props.readOnly}
              type={this.props.type}
            />
          </div>);
      }
    };

    return (
      <div>
        {renderDynamicContent()}
        {this.props.meta.touched &&
            ((this.props.meta.error && <span className="si-label si-label-error">{this.props.meta.error}</span>) ||
            (this.props.meta.warning && <span className="si-label si-label-warning">{this.props.meta.warning}</span>))}
      </div>
    );
  }
}

RenderField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
  }).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  meta: PropTypes.shape({
    initial: PropTypes.any,
    touched: PropTypes.bool,
    warning: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  readOnly: PropTypes.string,
  rows: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
};

RenderField.defaultProps = {
  className: undefined,
  readOnly: '',
  options: [],
  rows: '',
  placeholder: '',
};

module.exports = {
  RenderField,
  Required: (value => (value ? undefined : 'Required')),
  ArrayLimit,
};
