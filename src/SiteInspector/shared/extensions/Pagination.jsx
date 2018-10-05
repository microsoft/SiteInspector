import React from 'react';
import PropTypes from 'prop-types';

class Pagination {
  constructor() {
    this.determineItemsToRender = this.determineItemsToRender.bind(this);
    this.handleNextClickEvent = this.handleNextClickEvent.bind(this);
    this.handlePreviousClickEvent = this.handlePreviousClickEvent.bind(this);
    this.renderCurrent = this.renderCurrent.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderPreviousButton = this.renderPreviousButton.bind(this);
    this.renderNextButton = this.renderNextButton.bind(this);
  }

  handleNextClickEvent = function (e) {
    if (this.state.activeIndex !== this.props.items.length - 1) {
      if (this.props.onChange) {
        this.props.onChange(e, this.props.items[this.state.activeIndex + 1]);
      }

      this.setState({
        activeIndex: this.state.activeIndex + 1,
      });
    }
  };

  handlePreviousClickEvent = function (e) {
    if (this.state.activeIndex !== 0) {
      if (this.props.onChange) {
        this.props.onChange(e, this.props.items[this.state.activeIndex - 1]);
      }

      this.setState({
        activeIndex: this.state.activeIndex - 1,
      });
    }
  }

  renderPreviousButton = function () {
    if (this.props.activeIndex > 0) {
      return (
        React.createElement('li', null,
          React.createElement('a', {
            className: 'c-glyph',
            href: this.props.items[this.props.activeIndex - 1].href,
            'aria-label': this.props.previousAriaLabel,
            onClick: this.handlePreviousClickEvent,
          },
            React.createElement('span', null, this.props.previousText),
          ),
        )
      );
    }

    return null;
  };

  renderNextButton = function () {
    if (this.props.activeIndex < this.props.items.length - 1) {
      return (
        React.createElement('li', null,
          React.createElement('a', {
            className: 'c-glyph',
            href: this.props.items[this.props.activeIndex + 1].href,
            'aria-label': this.props.nextAriaLabel,
            onClick: this.handleNextClickEvent,
          },
            React.createElement('span', null, this.props.nextText),
          ),
        )
      );
    }

    return null;
  };

  renderEllipsis = function () {
    return (
      <li>
        <span className="c-glyph glyph-more" />
      </li>
    );
  }

  renderCurrent = function () {
    const ariaLabel = `Currently on page ${this.props.activeIndex + 1}`;
    return (
      // eslint-disable-next-line jsx-a11y/aria-props
      <li aria-current data-label={ariaLabel}>
        <span aria-label={ariaLabel} data-label={ariaLabel}>
          {this.props.activeIndex + 1}
        </span>
      </li>
    );
  }

  renderItem = function (index) {
    const ariaLabel = `Page ${index + 1}`;
    return (
      <li data-label={ariaLabel}>
        <a
          href="javascript:void(0)"
          aria-label={ariaLabel}
          data-label={ariaLabel}
          onClick={(e) => {
            this.props.onChange(e, this.props.items[index]);
            this.setState({
              activeIndex: index,
            });
          }}
        >
          {index + 1}
        </a>
      </li>
    );
  }

  determineItemsToRender = function () {
    const items = [];
    let i = 0;

    const beforeStartIndex = this.props.activeIndex - this.props.numberOfSiblingsToDisplay;
    const afterEndIndex = this.props.activeIndex + this.props.numberOfSiblingsToDisplay;
    const endExtremityStartIndex =
      this.props.items.length - this.props.numberOfExtremitiesToDisplay;

    // Add elements at the start of list until we reach either the limit or the active index.
    for (i = 0; i < this.props.numberOfExtremitiesToDisplay && i < this.props.activeIndex; i += 1) {
      items.push(this.renderItem(i));
    }

    // If range does not overlap start of list, add ellipsis.
    if (beforeStartIndex > this.props.numberOfExtremitiesToDisplay - 1) {
      items.push(this.renderEllipsis());
      i = beforeStartIndex;
    }

    // Add elements in range immediately before active index.
    for (i; i < this.props.activeIndex; i += 1) {
      items.push(this.renderItem(i));
    }

    // Add currently selected item.
    items.push(this.renderCurrent());

    // Add elements in range immediately after active index.
    for (i = this.props.activeIndex + 1; i < endExtremityStartIndex && i <= afterEndIndex; i += 1) {
      items.push(this.renderItem(i));
    }

    // If range does not overlap end of list, add ellipsis.
    if (endExtremityStartIndex > afterEndIndex) {
      items.push(this.renderEllipsis());
      i = endExtremityStartIndex;
    }

    // Add remaining items.
    for (i; i < this.props.items.length; i += 1) {
      items.push(this.renderItem(i));
    }

    return items;
  }

  render = function () {
    return (
      <ul
        className="c-pagination"
        items={this.props.items}
        nextarialabel={this.props.nextAriaLabel}
        previousarialabel={this.props.previousAriaLabel}
      >
        {this.renderPreviousButton()}
        {this.determineItemsToRender()}
        {this.renderNextButton()}
      </ul>
    );
  }
}

Pagination.propTypes = {
  activeIndex: PropTypes.number,
  numberOfSiblingsToDisplay: PropTypes.number,
  numberOfExtremitiesToDisplay: PropTypes.number,
};

Pagination.defaultProps = {
  activeIndex: 0,
  numberOfSiblingsToDisplay: 2,
  numberOfExtremitiesToDisplay: 1,
};

export default Pagination;
