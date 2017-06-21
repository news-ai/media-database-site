import * as api from 'actions/api';
import {normalize, Schema, arrayOf} from 'normalizr';

const tweetSchema = new Schema('tweets', {idAttribute: 'tweetid'});

export function fetchContactTweets(email) {
  return dispatch => {
    dispatch({type: 'CONTACT_TWEETS_REQUEST', email});
    return api.get(`${window.TABULAE_API_BASE}/database-contacts/${email}/tweets`)
    .then(response => {
      const res = normalize(response, {data: arrayOf(tweetSchema)});
      return dispatch({type: 'CONTACT_TWEETS_RECEIVE', ids: res.result.data, tweets: res.entities.tweets});
    })
    .catch(err => console.log(err));
  };
}
