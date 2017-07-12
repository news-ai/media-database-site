import React from 'react';
import {Route} from 'react-router-dom';
import Contact from './Contact';

const Contacts = ({match}) => (
  <div>
    <Route path={`${match.url}/:email`} component={Contact} />
    <Route exact path={match.url} render={() => <div>Contacts</div>} />
  </div>
  );

export default Contacts;
