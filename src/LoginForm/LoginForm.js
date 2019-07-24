import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { authenticate } from '../client';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sub: null,
      username: '',
      password: '',
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { username, password } = this.state;
    // TODO: username and password unnecessary for cookie auth
    authenticate({ username, password })
      .then((response) => {
        if (response.status === 201) this.handleAuthenticationSuccess(response);
      })
      .catch(() => {});
  }

  updateUsername(username) {
    const { handleUsernameUpdate } = this.props;
    console.log(`Setting username to: ${username}`);
    handleUsernameUpdate(username);
  }

  clearState() {
    this.setState({ username: '', password: '', error: '' });
  }

  handleAuthenticationSuccess(response) {
    const { data: { access_token: accessToken } } = response;
    const { sub } = jwtDecode(accessToken);
    this.setState({ sub });
    this.updateUsername(sub);
  }

  handleChange(event) {
    const { target: { name, value } } = event;
    this.setState({ [name]: value });
  }

  handleClick() {
    const { username, password } = this.state;
    this.clearState();
    authenticate({ username, password })
      .then((response) => {
        if (response.status === 201) this.handleAuthenticationSuccess(response);
      })
      .catch(() => {
        this.setState({ error: 'Login failed' });
      });
  }

  isLoggedIn() {
    const { sub } = this.state;
    return sub !== null;
  }

  renderLoggedIn() {
    const { sub } = this.state;
    const loggedInMessage = `Welcome ${sub}`;
    return (<div>{loggedInMessage}</div>);
  }

  renderLoggedOut() {
    const { username, password, error } = this.state;
    return (
      <div className="LoginForm">
        <div className="form">
          <form className="login-form">
            <input
              name="username"
              value={username}
              onChange={this.handleChange}
              type="text"
              placeholder="Username"
            />
            <input
              name="password"
              value={password}
              onChange={this.handleChange}
              type="password"
              placeholder="Password"
            />
            <button type="button" onClick={this.handleClick}>login</button>
          </form>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  render() {
    return this.isLoggedIn() ? this.renderLoggedIn() : this.renderLoggedOut();
  }
}

LoginForm.propTypes = {
  handleUsernameUpdate: PropTypes.func.isRequired,
};

export default LoginForm;
