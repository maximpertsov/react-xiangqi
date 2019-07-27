import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { authenticate } from '../client';

const initialForm = { username: '', password: '', error: '' };

const LoginForm = ({ setUsername }) => {
  const [sub, setSub] = useState(null);
  const [form, setForm] = useState(initialForm);

  const handleAuthenticationSuccess = (response) => {
    const { data: { access_token: accessToken } } = response;
    const { sub: _sub } = jwtDecode(accessToken);
    setSub(_sub);
    setUsername(_sub);
  };

  useEffect(() => {
    // TODO: username and password unnecessary for cookie auth
    const { username, password } = form;
    authenticate({ username, password })
      .then((response) => {
        if (response.status === 201) handleAuthenticationSuccess(response);
      })
      .catch(() => {});
  });

  const clearState = () => {
    setForm((prevForm) => ({ ...prevForm, initialForm }));
  };

  const handleChange = (event) => {
    const { target: { name, value } } = event;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleClick = () => {
    const { username, password } = form;
    clearState();
    authenticate({ username, password })
      .then((response) => {
        if (response.status === 201) handleAuthenticationSuccess(response);
      })
      .catch(() => {
        setForm((prevForm) => ({ ...prevForm, error: 'Login failed' }));
      });
  };

  const isLoggedIn = () => sub !== null;

  const renderLoggedIn = () => {
    const loggedInMessage = `Welcome ${sub}`;
    return (<div>{loggedInMessage}</div>);
  };

  const renderLoggedOut = () => {
    const { username, password, error } = form;
    return (
      <div className="LoginForm">
        <div className="form">
          <form className="login-form">
            <input
              name="username"
              value={username}
              onChange={handleChange}
              type="text"
              placeholder="Username"
            />
            <input
              name="password"
              value={password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
            />
            <button type="button" onClick={handleClick}>login</button>
          </form>
          <div>{error}</div>
        </div>
      </div>
    );
  };

  return isLoggedIn() ? renderLoggedIn() : renderLoggedOut();
};

LoginForm.propTypes = {
  setUsername: PropTypes.func.isRequired,
};

export default LoginForm;
