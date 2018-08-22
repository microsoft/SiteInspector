import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, TextField, Table } from './FluentWeb';

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPage: 0,
      data: props.data,
      searchText: props.searchText,
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    this.getFilteredRows();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data,
      });
      this.getFilteredRows(nextProps.data);
    }
  }

  componentWillUnmount() {
    // update only when component is unmounting
    this.props.updateSearchText(this.state.searchText || '');
  }

  onPageChange = (event, item) => {
    this.setState({ selectedPage: item.pageNumber - 1 });
  }

  onSearch = (event) => {
    this.setState({
      searchText: event.target.value,
    }, function () {
      this.getFilteredRows();
    });
  }

  getFilteredRows = (data) => {
    let filteredRows = data || this.props.data;

    filteredRows = filteredRows.filter(row =>
              row && row.cells && row.cells.some(column =>
                  (column.text && column.text.toLowerCase()
                  .includes(this.state.searchText.toLowerCase())) ||
              (column.children && column.children[0] && column.children[0].props.children
                  .toLowerCase().includes(this.state.searchText.toLowerCase()))));

    const numberOfPages = Math.ceil(filteredRows.length / this.props.sizePerPage);
    const selectedPage = this.state.selectedPage > numberOfPages - 1
          ? !numberOfPages ? 0 : numberOfPages - 1
          : this.state.selectedPage;

    this.setState({
      data: filteredRows,
      selectedPage,
    });
  }

  searchControl = () => (
    <TextField
      type="search"
      placeholder="Filter Bugs..."
      value={this.state.searchText}
      onChange={this.onSearch}
      className="c-search si-data-table-search-control"
    />
  )

  renderPages = () => {
    const numberOfPages = Math.ceil(this.state.data.length / this.props.sizePerPage);
    const pages = [];
    const tables = [];

    for (let i = 1; i <= numberOfPages; i += 1) {
      const rowsStartIndex = (i - 1) * this.props.sizePerPage;
      const rowsEndIndex = Math.min(
        rowsStartIndex + this.props.sizePerPage,
        this.state.data.length);

      tables.push(this.renderTable(rowsStartIndex, rowsEndIndex, i - 1));

      pages.push({
        text: i,
        href: 'javascript:void(0)',
        pageNumber: i,
        activeItemLabelFormatter: `Currently on page ${i}`,
        inactiveItemLabelFormatter: `Page ${i}`,
      });
    }

    return (
      <div className="si-pagination-container flex-column">
        <div className="flex-column">
          {tables}
        </div>
        <div className="si-pagination-controls">
          <Pagination
            activeIndex={this.state.selectedPage}
            items={pages}
            nextarialabel="Next page"
            onChange={this.onPageChange}
            previousarialabel="Previous page"
          />
        </div>
      </div>
    );
  }

  renderTable = (rowStart, rowEnd, key) => {
    const rows = this.state.data.slice(rowStart, rowEnd);
    return (<Table
      aria-hidden={key !== this.state.selectedPage}
      divided
      key={key}
      rows={rows}
      subcategories={this.props.headers}
    />);
  }

  render() {
    return (
      <div className="si-data-table flex-column">
        <div className="si-data-table-controls">
          <div className="si-left">
            { this.props.insertButton && this.props.insertButton }
          </div>
          <div className="si-right">
            { this.props.search && this.searchControl() }
            { this.props.refreshButton && this.props.refreshButton }
          </div>
        </div>
        {
          this.props.sizePerPage >= this.state.data.length
            ? this.renderTable(0, this.state.data.length, 0)
            : this.renderPages()
        }
      </div>
    );
  }
}

DataTable.defaultProps = {
  insertButton: null,
  refreshButton: null,
  search: false,
  sizePerPage: 50,
  searchText: '',
  updateSearchText() { },
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    cells: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
    })),
  })).isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({
    colspan: PropTypes.number,
    id: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
  insertButton: PropTypes.element,
  refreshButton: PropTypes.element,
  search: PropTypes.bool,
  searchText: PropTypes.string,
  sizePerPage: PropTypes.number,
  updateSearchText: PropTypes.func,
};

export default DataTable;
