/*
PictureScrubber

A handy tool for quickly flagging bad images

*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  AutoSizer,
  WindowScroller
} from 'react-virtualized';


class ImageScrubber extends Component {

  constructor() {
    super()

    this._cellRenderer = this._cellRenderer.bind(this)
    this._onResize = this._onResize.bind(this)
    this._setMasonryRef = this._setMasonryRef.bind(this)
  }

  _cache = new CellMeasurerCache({
    minHeight: 150,
    fixedWidth: true
  })
  _columnCount = 0

  componentDidMount() {
    console.log("Getting photos")
    this.props.getPicturesAsync({ count: 1000 })
  }

  _cellRenderer({ index, key, parent, style }) {
    const picture = this.props.picturesArray.find(
      function (data) {
        return data.id === index;
      }
    );
    if (!picture) {
      return null
    } else {
      return (
        <CellMeasurer
          cache={this._cache}
          parent={parent}
          index={index}
          key={key}
          fixedWidth={true}>
          {({ measure }) => (
            <img src={picture.imageUrl}
              style={{ width: 200, margin: 10 }}
              onLoad={measure} />
          )}
        </CellMeasurer>
      )
    }
  }

  _cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: this._cache,
    columnCount: this._columnCount,
    columnWidth: 200,
    spacer: 10
  })

  _onResize({ width }) {
    this._width = width;
    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  }

  _calculateColumnCount() {
    // const { columnWidth, gutterSize } = this.state;
    const { columnWidth, gutterSize } = { columnWidth: 200, gutterSize: 10 }

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  }

  _resetCellPositioner() {
    const { columnWidth, gutterSize } = { columnWidth: 200, gutterSize: 10 }

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize,
    });
  }

  _setMasonryRef(ref) {
    this._masonry = ref;
  }

  render() {
    return (
      <AutoSizer onResize={this._onResize}>
        {({ width, height }) =>
          <Masonry
            cellMeasurerCache={this._cache}
            width={width}
            height={height}
            cellPositioner={this._cellPositioner}
            cellCount={30}
            cellRenderer={this._cellRenderer}
            style={{ display: 'flex', flexWrap: 'wrap' }}
            ref={this._setMasonryRef}
          />
        }
      </AutoSizer>
    );
  }
}

const mapState = state => {
  const keys = Object.keys(state.pictures.data);
  return {
    picturesArray: keys.map(id => ({
      ...state.pictures.data[id]
    })),
    hasMoreItems: true,
    page: state.pictures.page,
    list: state.pictures.list
  }
}

const mapDispatch = (dispatch) => ({
  getPicturesAsync: ({ count }) => dispatch.pictures.getPicturesAsync({ count })
})

ImageScrubber.propTypes = {
}

export default connect(mapState, mapDispatch)(ImageScrubber)
