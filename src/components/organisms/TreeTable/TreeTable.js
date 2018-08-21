import React, { Component } from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import dateFormat from 'dateformat'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip'

import EnhancedTableHead from '../../molecules/EnhancedTableHead/EnhancedTableHead'

// change 88 to unit spacing,
const styles = theme => ({
  root: {
    position: 'relative',
    top: '88px',
    paddingLeft: '70px',
    overflowX: 'auto'
  },
  locationCol: {
    width: '270px'
  },
  table: {
    minHeight: '100vh'
  },
  tableBody: {
    minHeight: '100vh'
  },
  pagination: {
    position: 'sticky',
    bottom: '0px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.15)'
  }
})

class TreeTable extends Component {

  constructor(props) {
    super(props)
    this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this)
  }

  componentDidMount() {
    const payload = {
      page: this.props.page,
      rowsPerPage: this.props.rowsPerPage,
      order: this.props.order,
      orderBy: this.props.orderBy
    }
    this.props.getTreesAsync(payload)
  }

  handleSelection = (e) => {

  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    this.setState({ selected: newSelected })
  }

  onPageChange = (event, page) => {
    this.props.getTreesAsync({ page: page, rowsPerPage: this.props.rowsPerPage })
  }

  onChangeRowsPerPage = event => {
    this.props.getTreesAsync({ page: this.props.page, rowsPerPage: event.target.value })
  }

  isSelected = (id) => {
    this.props.selected.indexOf(id) !== -1
  }

  render() {
    const { numSelected, classes, rowsPerPage, selected, order, orderBy, treesArray, getLocationName, treeCount, byId } = this.props
    return (
      <div >
        <Table className={classes.tableBody}>
          {/*
           State handling betweenn treetable and EnhancedTableHead are a non-reduxy right now
           We should probably fix that, but it's not a huge problem. Consistency though.
           */ }
          <EnhancedTableHead
            numSelected={numSelected}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
            rowCount={rowsPerPage}
          />
          <TableBody className={classes.tableBody}>
            {this.props.treesArray.map(tree => {
              const isSelected = this.isSelected(tree.id)
              const location = true //byId[tree.id] ? byId[tree.id].location : false
              // this probably belongs elsewhere…
              const city = ( location && location.city !== undefined )? `${location.city},` : ''
              const country = ( location && location.country !== undefined )? `${location.country}` : ''

              if(!location) getLocationName(tree.id, tree.lat, tree.lon)
              return (
                <TableRow
                  key={tree.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell>{tree.id}</TableCell>
                  <TableCell>{dateFormat(tree.timeCreated, 'mmm dd, yyyy h:MM TT')}</TableCell>
                  <TableCell className={classes.locationCol}>{dateFormat(tree.timeUpdated, 'mmm dd, yyyy h:MM TT')}</TableCell>
                  {location ? (
                    /* @Todo: I'd love to instead send a get request to the API, but we need auth stuff first... */
                    <Tooltip title={`${tree.lat} ${tree.lon}`}>
                        <TableCell>{city === '' ?`${tree.lat} ${tree.lon}`: `${city} ${country}`}</TableCell>
                    </Tooltip>
                  ) : (
                    <TableCell>{`${Number(tree.lat).toPrecision(4)}, ${Number(tree.lon).toPrecision(4)}`}</TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <TablePagination
          className={classes.pagination}
          component="div"
          count={treeCount/rowsPerPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25, 50, 75, 100, 250, 500]}
          page={this.props.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.onPageChange}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
      </div>
    )
  }
}

const mapState = state => {
  const keys = Object.keys(state.trees.data)
  return {
    treesArray: keys.map(id => ({
      ...state.trees.data[id]
    })),
    page: state.trees.page,
    rowsPerPage: state.trees.rowsPerPage,
    selected: state.trees.selected,
    order: state.trees.order,
    orderBy: state.trees.orderBy,
    numSelected: state.trees.selected.length,
    byId: state.trees.byId

  }
}

const mapDispatch = (dispatch) => ({
  getTreesAsync: ({ page, rowsPerPage, order, orderBy }) => dispatch.trees.getTreesAsync({ page: page, rowsPerPage: rowsPerPage, order: order, orderBy: orderBy }),
  getLocationName: (id, lat, lon) => dispatch.trees.getLocationName({ id: id, latitude: lat, longitude: lon })
})

export default compose(
  withStyles(styles, { withTheme: true, name: 'TreeTable' }),
  connect(mapState, mapDispatch)
)(TreeTable)
