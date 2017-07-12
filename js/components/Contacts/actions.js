import * as api from 'actions/api';
import {normalize, schema} from 'normalizr';
import {contactConstant} from './constants';

const contactSchema = new schema.Entity('contacts', {}, {idAttribute: 'email'});

export function fetchContact(email) {
  return dispatch => {
    dispatch({type: contactConstant.REQEST, email});
    return api.get(`${window.TABULAE_API_BASE}/database-contacts/${email}`)
    .then(response => {
      const res = normalize(response.data, contactSchema);
      return dispatch({type: contactConstant.RECEIVE, email, contact: res.entities.contacts});
    })
    .catch(err => console.log(err));
  };
}
