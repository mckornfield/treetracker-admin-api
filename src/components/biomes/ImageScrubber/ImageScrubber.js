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
    this._onScroll = this._onScroll.bind(this)
    this._renderedPics = [];
  }

  _cache = new CellMeasurerCache({
    minHeight: 150,
    fixedWidth: true
  })
  _columnCount = 0

  _cellCount = 30

  componentDidMount() {
    console.log("Getting photos")
    this.props.getPicturesAsync({count:1000})
  }
  _cellRenderer({ index, isScrolling, key, parent, style }) {
    const picture = this.props.picturesArray[index]
    // console.log("rendering " + JSON.stringify(picture));
    // .find(
    //   function (data) {
    //     return data.id === index;
    //   }
    // );
    // console.log(`Contained value = ${this._renderedPics.includes(index)}`)

    // this._renderedPics.push(index)
      return (
        <CellMeasurer
          cache={this._cache}
          parent={parent}
        key={key}>
        <img src={picture == null ? '' : picture.imageUrl}
              style={{ width: 200, margin: 10 }}
        />
        </CellMeasurer>
      )
    }

  _cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: this._cache,
    columnCount: this._columnCount,
    columnWidth: 200,
    spacer: 10
  })

  _onResize({ width }) {
    this._width = width;
    console.log("ON Resize");
    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  }

  _onScroll({ clientHeight, scrollHeight, scrollTop }) {
    console.log(clientHeight)
    console.log(scrollHeight)
    console.log(scrollTop)
    // console.log(this._cellPositioner);

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // console.log(this._cellCount)
      // this._cellCount += 30;
      // console.log(this._cellCount);
    }
  }

  _calculateColumnCount() {
    // const { columnWidth, gutterSize } = this.state;
    console.log("Calculating column");
    const { columnWidth, gutterSize } = { columnWidth: 200, gutterSize: 10 }

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  }

  _resetCellPositioner() {
    console.log("Resetting position");
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
            cellCount={this.props.picturesArray.length}
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
  console.log("keys are " + keys);
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
