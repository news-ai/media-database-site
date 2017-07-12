import React, {Component} from 'react';
import {connect} from 'react-redux';
import intercomSetup from '../chat';

import {actions as loginActions} from 'components/Login';

import Login from './Login';
import {blue600} from 'material-ui/styles/colors';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      didScroll: false,
    };
  }

  componentWillMount() {
    this.props.getAuth();
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLogin && !this.state.isLogin && nextProps.person) {
      const appId = window.isDev ? 'eh8247hf' : 'ur8dbk9e';
      intercomSetup({
        app_id: appId,
        email: nextProps.person.email,
        name: `${nextProps.person.firstname} ${nextProps.person.lastname}`,
        custom_launcher_selector: '#custom_intercom_launcher',
        user_id: nextProps.person.id
      });

      this.setState({isLogin: true});
    }
  }

  render() {
    const props = this.props;
    const state = this.state;
    let renderNode = <Login />;
    if (props.isLogin) {
      renderNode = <div>You don't have access to NewsAI Media Database solution. Get access here.</div>;
      if (props.person.mediadatabaseaccess) {
        renderNode = <div>HOME</div>;
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
    getAuth: _ => dispatch(loginActions.fetchPerson()),
    logoutClick: _ => dispatch(loginActions.logout()),
  };
};

export default connect( mapStateToProps, mapDispatchToProps)(App);
