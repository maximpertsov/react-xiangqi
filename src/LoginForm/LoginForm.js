import React, { Component } from 'react';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    // this.setState({ [target.name]: target.value });
  }

  render() {
    return (
      <div className="LoginForm">
        <div className="form">
          <form className="login-form">
            <input
              name="username"
              onChange={this.handleChange}
              type="text"
              placeholder="Username"
            />
            <input
              name="password"
              onChange={this.handleChange}
              type="password"
              placeholder="Password"
            />
            <button type="button">login</button>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
