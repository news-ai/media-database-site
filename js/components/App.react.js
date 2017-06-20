import React, {Component} from 'react';
import withRouter from 'react-router/lib/withRouter';
import {connect} from 'react-redux';
import intercomSetup from '../chat';

import {actions as loginActions} from 'components/Login';

import Login from './Login';
import FloatingActionButton from 'material-ui/FloatingActionButton';
// import NotificationPanel from 'components/Notifications/NotificationPanel.react';
import {blue600} from 'material-ui/styles/colors';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      firstTimeUser: false,
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
      // if (!window.isDev) {
      //   Raven.config('https://c6c781f538ef4b6a952dc0ad3335cf61@sentry.io/100317').install();
      //   Raven.setUserContext({email: nextProps.person.email, id: nextProps.person.id});
      // }

      this.setState({isLogin: true});
    }
  }

  render() {
    const props = this.props;
    const state = this.state;

    return (
      <div style={styles.container}>
        {
          props.isLogin ?
            <div>
              {props.children}
              <FloatingActionButton
              id='custom_intercom_launcher'
              backgroundColor={blue600}
              style={styles.intercomBtn}
              iconClassName='fa fa-comment-o'
              />
            </div> : <Login/>
        }
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
    firstTimeUser: props.location.query.firstTimeUser || state.personReducer.firstTimeUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAuth: _ => dispatch(loginActions.fetchPerson()),
    logoutClick: _ => dispatch(loginActions.logout()),
    setFirstTimeUser: _ => dispatch(loginActions.setFirstTimeUser()),
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(withRouter(App));
