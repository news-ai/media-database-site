import React, { Component } from 'react';
import {connect} from 'react-redux';
import {List, CellMeasurer, CellMeasurerCache, AutoSizer} from 'react-virtualized';
import Headline from './Headline';
import 'react-virtualized/styles.css';

class HeadlineFeed extends Component {
  constructor(props) {
    super(props);
    this._cache = new CellMeasurerCache({
      minHeight: 100,
      fixedWidth: true
    });
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentWillMount() {
    // this.props.fetchHeadlines();
  }

  rowRenderer({key, index, parent, isScrolling, isVisible, style}) {
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div key={key} style={Object.assign({}, style, {padding: 5})} >
          <Headline {...this.props.headlines[index]} />
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const {headlines, fetchHeadlines, height} = this.props;
    return (
      <AutoSizer disableHeight>
      {({width}) => (
        <List
        ref={ref => this._HeadlineFeed = ref}
        deferredMeasurementCache={this._cache}
        width={width}
        height={height || 500}
        rowCount={headlines.length}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this.rowRenderer}
        onScroll={args => ((args.scrollHeight - args.scrollTop) / args.clientHeight) < 2 ? fetchHeadlines() : null}
        />
        )}
      </AutoSizer>
    );
  }
}

const mapStateToProps = (state, props) => {
  const contact = state.headlineReducer[props.email];
  return {
    headlines: contact && contact.received ? state.headlineReducer[props.email].received.map(id => state.headlineReducer[id]) : [],
    isReceiving: contact.isReceiving
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchHeadlines: _ => dispatch({type: 'FETCH_CONTACT_HEADLINES', email: props.email}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeadlineFeed);
