import * as api from 'actions/api';
import {normalize, Schema} from 'normalizr';

const contactSchema = new Schema('contacts', {idAttribute: 'email'});

export function fetchContact(email) {
  return dispatch => {
    dispatch({type: 'CONTACT_REQUEST', email});
    return api.get(`${window.TABULAE_API_BASE}/database-contacts/${email}`)
    .then(response => {
      const res = normalize(response, {data: contactSchema});
      return dispatch({type: 'CONTACT_RECEIVE', id: email, contactt: res.entities.contacts});
    })
    .catch(err => console.log(err));
  };
}
