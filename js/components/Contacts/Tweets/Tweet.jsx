import React from 'react';
import {grey600, grey800} from 'material-ui/styles/colors';
import isURL from 'validator/lib/isURL';

const defaultStyle = {
  paddingTop: 5,
  paddingBottom: 5,
  border: `dotted 1px ${grey400}`,
  borderRadius: '0.4em',
  margin: 5,
  minHeight: 100,
  width: '100%',
};

const styles = {
  label: {color: grey600},
  urlSpan: {color: grey800},
  timestring: {marginLeft: 8}
};

const Tweet = ({style, text, username, createdat, tweetidstr}) => {
  const date = new Date(createdat);
  const containerStyle = style ? Object.assign({}, defaultStyle, style) : Object.assign({}, defaultStyle);
  return (
    <div className='row' style={containerStyle}>
      <div className='large-12 medium-12 small-12 columns'>
        <span className='smalltext' style={styles.label}>from Twitter</span>
        <span className='right'>
        {tweetidstr ?
          <a target='_blank' href={`https://twitter.com/${username}`}>{username}</a> : username}
        </span>
      </div>
      <div className='large-12 medium-12 small-12 columns'>
        {text !== null && text
        .split(' ')
        .map((block, i) => <a key={`${tweetidstr}-${i}`} style={styles.urlSpan} target='_blank' href={isURL(block) ? block : `https://twitter.com/statuses/${tweetidstr}`}>{block} </a>)}
      </div>
      <div className='large-12 medium-12 small-12 columns smalltext'>
        <span>{date.toDateString()}</span><span style={styles.timestring}>{date.toTimeString()}</span>
      </div>
    </div>);
};

export default Tweet;
