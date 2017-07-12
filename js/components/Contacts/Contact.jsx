import React from 'react';

const Contact = ({match}) => (
  <div>{match.params.email} </div>
  );

export default Contact;
