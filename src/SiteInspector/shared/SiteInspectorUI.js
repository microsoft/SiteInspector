// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/* components to export for use outside the shell
 * 
 * */
import BladeComponent from './components/Blade';
import ChipComponent from './components/Chip';
import DatePicker from './components/DatePicker';
import ListItemComponent from './components/ListItem';
import ModalComponent from './components/Modal';
import SpinnerComponent from './components/Spinner';
import TabComponent from './components/Tab';
import TabNavigationComponent from './components/TabNavigation';
import LineChartComponent from './components/LineChart';

module.exports = {
  Blade: BladeComponent,
  Chip: ChipComponent,
  DatePicker,
  ListItem: ListItemComponent,
  Modal: ModalComponent,
  Spinner: SpinnerComponent,
  LineChart: LineChartComponent,
  Tab: TabComponent,
  TabNavigation: TabNavigationComponent,
};
