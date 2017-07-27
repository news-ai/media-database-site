import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';

const Home = (props) => {
  return (
  <div>
    <div>
      <Link to='/contacts' >CONTACTS</Link>
      HOME
    </div>
  </div>
  );
};


export default Home;
