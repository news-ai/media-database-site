import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import Publications from 'components/Publications/Publications';
import SearchPage from 'components/Search/SearchPage';

const Home = (props) => {
  return (
  <div>
  {/*
      <Link to='/contacts' >CONTACTS</Link>
  */}
    <div className='horizontal-center' style={{margin: '20px 0'}} >
      <h4>Search Database</h4>
    </div>
    <div className='horizontal-center' >
      <SearchPage />
    </div>
  {/*
    <Publications />
  */}
  </div>
  );
};


export default Home;
