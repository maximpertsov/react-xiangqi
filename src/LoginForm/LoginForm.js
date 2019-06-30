import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { authenticate } from '../client';
import { getAccessToken, setAccessToken, getUsername } from '../token';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (getAccessToken() !== null) {
      const username = getUsername();
      this.setUsername(username);
    }
  }

  setUsername(username) {
    const { setUsername } = this.props;
    setUsername(username);
  }

  clearState() {
    this.setState({ username: '', password: '', error: '' });
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
        setAccessToken(response.data.access_token);
        this.setUsername(getUsername());
      })
      .catch(() => {
        this.setState({ error: 'Login failed' });
      });
  }

  render() {
    if (getAccessToken() !== null) {
      const loggedInMessage = `Welcome ${getUsername()}`;
      return (<div>{loggedInMessage}</div>);
    }

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
}

LoginForm.propTypes = {
  setUsername: PropTypes.func.isRequired,
};

export default LoginForm;
