import React, { Component } from 'react';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    this.setState({ [target.name]: target.value });
  }

  handleClick(event) {
    const { target } = event;
    console.log('Submitted');
  }

  render() {
    const { username, password } = this.state;
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
        </div>
      </div>
    );
  }
}

export default LoginForm;
