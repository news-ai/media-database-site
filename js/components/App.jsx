import React, {Component} from 'react';
import {connect} from 'react-redux';

import {actions as loginActions} from 'components/Login';
import {loginConstant} from 'components/Login/constants';

import Login from './Login';
import Home from './Home/Home.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didScroll: false,
    };
  }

  componentWillMount() {
    this.props.getAuth();
  }

  render() {
    const props = this.props;
    const state = this.state;
    let renderNode = <Login />;
    if (props.isLogin) {
      renderNode = <div>You don't have access to NewsAI Media Database solution. Get access here.</div>;
      if (props.person.mediadatabaseaccess) {
        renderNode = this.props.children;
      }
    }

    return (
      <div style={styles.container}>
      {renderNode}
      </div>
      );
  }
}

const styles = {
  btn: {margin: 10},
  dialogContainer: {margin: '10px 0'},
  intercomBtn: {
    position: 'fixed',
    bottom: 20,
    right: 20
  },
  container: {width: '100%', height: '100%'},
  btnLabel: {textTransform: 'none'},
};

const mapStateToProps = (state, props) => {
  return {
    isLogin: state.personReducer.person ? true : false,
    loginDidInvalidate: state.personReducer.didInvalidate,
    person: state.personReducer.person,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAuth: _ => dispatch({type: loginConstant.REQUEST}),
    logoutClick: _ => dispatch(loginActions.logout()),
  };
};

export default connect( mapStateToProps, mapDispatchToProps)(App);
