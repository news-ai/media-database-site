import React, { Component } from 'react';
import {connect} from 'react-redux';
import {List, CellMeasurer, CellMeasurerCache, AutoSizer} from 'react-virtualized';
import Tweet from './Tweet';
import * as actions from './actions';
import 'react-virtualized/styles.css';

class TweetFeed extends Component {
  constructor(props) {
    super(props);
    this._cache = new CellMeasurerCache({
      minHeight: 100,
      fixedWidth: true
    });
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentWillMount() {
    this.props.fetchTweets();
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
          <Tweet {...this.props.tweets[index]} />
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const {tweets, fetchTweets} = this.props;
    return (
      <AutoSizer disableHeight>
      {({width}) => (
        <List
        ref={ref => this._TweetFeed = ref}
        deferredMeasurementCache={this._cache}
        width={width}
        height={500}
        rowCount={tweets.length}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this.rowRenderer}
        onScroll={args => ((args.scrollHeight - args.scrollTop) / args.clientHeight) < 2 ? fetchTweets() : null}
        />
        )}
      </AutoSizer>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    tweets: state.tweetReducer[props.email] ? state.tweetReducer[props.email].received.map(id => state.tweetReducer[id]) : []
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchTweets: _ => dispatch(actions.fetchContactTweets(props.email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetFeed);
