import React, { useCallback, useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

import * as client from '../../../../client';

const initialForm = { formUsername: '', formPassword: '', formError: '' };

const LoginForm = ({ username, setUsername }) => {
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
      const { sub } = jwtDecode(accessToken);
      setUsername(sub);
    },
    [setUsername],
  );

  useEffect(
    () => { ping(); },
    [ping],
  );

  useEffect(
    () => {
      client.authenticate()
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
    const { formUsername, formPassword } = form;
    clearState();
    try {
      const response = await client.login({
        username: formUsername,
        password: formPassword,
      });
      if (response.status === 201) handleAuthenticationSuccess(response);
    } catch (error) {
      setForm((prevForm) => ({ ...prevForm, formError: 'Login failed' }));
    }
  };

  const isLoggedIn = () => username !== undefined;

  const renderLoggedIn = () => {
    const loggedInMessage = `Welcome ${username}`;
    return (<div>{loggedInMessage}</div>);
  };

  const renderLoggedOut = () => {
    const { formUsername, formPassword, formError } = form;
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
            name="formUsername"
            value={formUsername}
            onChange={handleChange}
          />
          <Form.Input
            icon="lock"
            iconPosition="left"
            label="Password"
            type="password"
            name="formPassword"
            value={formPassword}
            onChange={handleChange}
          />
          <Button content="Login" primary onClick={handleClick} />
        </Form>
        <div>{formError}</div>
      </div>
    );
  };

  if (loading) return <div>Loading</div>;

  return isLoggedIn() ? renderLoggedIn() : renderLoggedOut();
};

LoginForm.propTypes = {
  setUsername: PropTypes.func.isRequired,
  username: PropTypes.func,
};

LoginForm.defaultProps = {
  username: undefined,
};

export default LoginForm;
