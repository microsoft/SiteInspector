import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { addDays, getDateRangeArray } from 'office-ui-fabric-react/lib/utilities/dateMath/DateMath';
import {
  Calendar,
  DateRangeType,
  DayOfWeek,
} from 'office-ui-fabric-react/lib/Calendar';
import { Flyout, Label, TextField } from './FluentWeb';

initializeIcons(undefined, { disableWarnings: true });

const DayPickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
  ],

  goToToday: 'Go to today',
};

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCalendar: false,
      inputValue: this.formatDate(props.value),
    };

    this.onCloseCalendarClick = this.onCloseCalendarClick.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goPrevious = this.goPrevious.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onCloseCalendarClick(e) {
    let element = e.target;

    // Check ancestors to see if clicked element is a child of this DatePicker
    while (element && element.id !== this.props.id) {
      element = element.parentElement;
    }

    if (!element || e.target.id === this.props.id || e.target.className.indexOf('c-label') > -1) {
      this.setState({ showCalendar: false });

      document.removeEventListener('mouseup', this.onCloseCalendarClick);
    }
  }

  onDismiss() {
    this.setState(prevState => prevState);
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  onInputBlur() {
    const newDate = moment(this.state.inputValue, 'MM/DD/YYYY', true);

    if (newDate.isValid() && newDate.format('MM/DD/YYYY') !== this.formatDate(this.props.value)) {
      this.props.onChange(newDate);
    } else {
      this.setState({ inputValue: this.formatDate(this.props.value) });
    }
  }

  onInputFocus() {
    this.setState({ showCalendar: true });

    document.addEventListener('mouseup', this.onCloseCalendarClick);
  }

  formatDate = date => moment(date).format('MM/DD/YYYY');

  goNext() {
    const selectedDate = this.props.value || new Date();
    const dateRangeArray =
      getDateRangeArray(selectedDate, this.props.dateRangeType, DayOfWeek.Sunday);

    const newDate = addDays(dateRangeArray && dateRangeArray.pop(), 1);

    this.handleChange(newDate);
  }

  goPrevious() {
    const selectedDate = this.props.value || new Date();
    const dateRangeArray =
      getDateRangeArray(selectedDate, this.props.dateRangeType, DayOfWeek.Sunday);

    let subtractFrom = dateRangeArray[0];
    let daysToSubtract = dateRangeArray.length;

    if (this.props.dateRangeType === DateRangeType.Month) {
      subtractFrom = new Date(subtractFrom.getFullYear(), subtractFrom.getMonth(), 1);
      daysToSubtract = 1;
    }

    const newDate = addDays(subtractFrom, -daysToSubtract);

    this.handleChange(newDate);
  }

  handleChange(newDate) {
    this.setState({
      inputValue: this.formatDate(newDate),
      showCalendar: false,
    });
    this.props.onChange(newDate);
  }

  render() {
    return (
      <div id={this.props.id} className="si-date-picker">
        { this.props.label && this.props.label.length
          ? <Label text={this.props.label} />
          : null
        }
        <TextField
          value={this.state.inputValue}
          onBlur={this.onInputBlur}
          onChange={this.onInputChange}
          onFocus={this.onInputFocus}
        />
        <div className="si-flyout-wrapper">
          <Flyout
            beak
            placement="bottom"
            visible={this.state.showCalendar}
            role="dialog"
          >
            <Calendar
              autoNavigateOnSelection={this.props.autoNavigateOnSelection}
              dateRangeType={this.props.dateRangeType}
              firstDayOfWeek={this.props.firstDayOfWeek
                ? this.props.firstDayOfWeek
                : DayOfWeek.Sunday}
              highlightCurrentMonth={this.props.highlightCurrentMonth}
              isDayPickerVisible={this.props.isDayPickerVisible}
              isMonthPickerVisible={this.props.isMonthPickerVisible}
              onDismiss={this.onDismiss}
              onSelectDate={this.handleChange}
              showGoToToday={this.props.showGoToToday}
              showMonthPickerAsOverlay={this.props.showMonthPickerAsOverlay}
              showSixWeeksByDefault={this.props.showSixWeeksByDefault}
              showWeekNumbers={this.props.showWeekNumbers}
              strings={DayPickerStrings}
              value={this.props.value}
              workWeekDays={this.props.workWeekDays}
            />
            { this.props.showNavigateButtons &&
              <div>
                <DefaultButton className="si-calendar-button" onClick={this.goPrevious} text="Previous" />
                <DefaultButton className="si-calendar-button" onClick={this.goNext} text="Next" />
              </div>
            }
          </Flyout>
        </div>
      </div>
    );
  }
}

DatePicker.defaultProps = {
  autoNavigateOnSelection: true,
  dateRangeType: 0,
  firstDayOfWeek: 0,
  highlightCurrentMonth: true,
  isDayPickerVisible: true,
  isMonthPickerVisible: true,
  label: null,
  onChange() {},
  showGoToToday: true,
  showMonthPickerAsOverlay: false,
  showNavigateButtons: false,
  showSixWeeksByDefault: false,
  showWeekNumbers: false,
  value: new Date(),
  workWeekDays: [1, 2, 3, 4, 5],
};

DatePicker.propTypes = {
  autoNavigateOnSelection: PropTypes.bool,
  dateRangeType: PropTypes.number,
  firstDayOfWeek: PropTypes.number,
  highlightCurrentMonth: PropTypes.bool,
  id: PropTypes.string.isRequired,
  isDayPickerVisible: PropTypes.bool,
  isMonthPickerVisible: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  showGoToToday: PropTypes.bool,
  showMonthPickerAsOverlay: PropTypes.bool,
  showNavigateButtons: PropTypes.bool,
  showSixWeeksByDefault: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  workWeekDays: PropTypes.arrayOf(PropTypes.number),
};

export default DatePicker;
