import React, { useCallback, useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

import * as client from '../client';

const initialForm = { username: '', password: '', error: '' };

const LoginForm = ({ setUsername }) => {
  const [sub, setSub] = useState(undefined);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const ping = useCallback(
    async() => {
      const { status } = await client.ping();
      if (status === 200) setLoading(false);
    },
    [setLoading],
  );

  const handleAuthenticationSuccess = useCallback(
    (response) => {
      const { data: { access_token: accessToken } } = response;
      const { sub: _sub } = jwtDecode(accessToken);
      setSub(_sub);
      setUsername(_sub);
    },
    [setUsername],
  );

  useEffect(
    () => { ping(); },
    [ping],
  );

  // TODO: remove this and re-authenticate with cookie
  useEffect(
    () => {
      // TODO: username and password unnecessary for cookie auth
      const { username, password } = form;
      client.authenticate({ username, password })
        .then((response) => {
          if (response.status === 201) handleAuthenticationSuccess(response);
        })
        .catch(() => {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const clearState = () => {
    setForm((prevForm) => ({ ...prevForm, initialForm }));
  };

  const handleChange = (event) => {
    const { target: { name, value } } = event;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleClick = async() => {
    const { username, password } = form;
    clearState();
    try {
      const response = await client.login({ username, password });
      if (response.status === 201) handleAuthenticationSuccess(response);
    } catch (error) {
      setForm((prevForm) => ({ ...prevForm, error: 'Login failed' }));
    }
  };

  const isLoggedIn = () => sub !== undefined;

  const renderLoggedIn = () => {
    const loggedInMessage = `Welcome ${sub}`;
    return (<div>{loggedInMessage}</div>);
  };

  const renderLoggedOut = () => {
    const { username, password, error } = form;
    return (
      <div
        className="LoginForm"
      >
        <Form>
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Username"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleChange}
          />
          <Form.Input
            icon="lock"
            iconPosition="left"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          <Button content="Login" primary onClick={handleClick} />
        </Form>
        <div>{error}</div>
      </div>
    );
  };

  if (loading) return <div>Loading</div>;

  return isLoggedIn() ? renderLoggedIn() : renderLoggedOut();
};

LoginForm.propTypes = {
  setUsername: PropTypes.func.isRequired,
};

export default LoginForm;
