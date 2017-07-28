import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import Publications from 'components/Publications/Publications';

const Home = (props) => {
  return (
  <div>
    <div>
      <Link to='/contacts' >CONTACTS</Link>
      <Publications />
    </div>
  </div>
  );
};


export default Home;
