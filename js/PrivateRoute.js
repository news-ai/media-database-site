
import React, {Component} from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import {connect} from 'react-redux';

const Placeholder = () => <div>PLACEHOLDER</div>;

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {isReceiving: true};
  }

  componentWillMount() {
    if (!this.props.person) this.props.fetchPerson();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isReceiving !== this.state.isReceiving) {
      this.setState({isReceiving: nextProps.isReceiving});
    }
  }

  render() {
    const {component, ...rest} = this.props;
    const Component = component;
    console.log(rest.person);
    console.log(rest.isReceiving);
    return (
      <Route {...rest} render={props => (
          rest.person ? (
          <Component {...props}/>
        ) : this.state.isReceiving ? (
          <Placeholder />
        ) :
          (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }}/>
        )
      )}/>
    )
  }
}

export default connect(
  ({personReducer}) => ({person: personReducer.person, isReceiving: personReducer.isReceiving}),
  dispatch => ({fetchPerson: _ => dispatch({type: 'LOGIN_REQUEST'})})
  )(PrivateRoute);
