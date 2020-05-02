import React, { useCallback, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import actions, { setForm } from 'actions';
import * as client from 'services/client';

const LoginForm = () => {
  const dispatch = useDispatch();
  const username = useSelector(state => state.username);
  const formUsername = useSelector(state => state.loginForm.username);
  const formPassword = useSelector(state => state.loginForm.password);
  const formError = useSelector(state => state.loginForm.error);
  const loading = useSelector(state => state.loginForm.loading);

  const ping = useCallback(async () => {
    const { status } = await client.ping();
    if (status === 200) dispatch({ type: 'set_login_loading', loading: false });
  }, [dispatch]);

  const handleAuthenticationSuccess = useCallback(
    response => {
      const { data } = response;
      const { sub } = jwtDecode(data.accessToken);
      dispatch(actions.home.username.set(sub));
    },
    [dispatch],
  );

  const clearState = useCallback(() => {
    dispatch(setForm({ username: '', password: '', error: '' }));
  }, [dispatch]);

  useEffect(() => {
    ping();
  }, [ping]);

  useEffect(
    () => {
      client
        .authenticate()
        .then(response => {
          if (response.status === 201) handleAuthenticationSuccess(response);
        })
        .catch(() => {})
        .finally(() => {
          clearState();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearState],
  );

  const handleChange = event => {
    const {
      target: { name, value },
    } = event;
    dispatch(setForm({ [name]: value }));
  };

  const handleClick = async () => {
    try {
      const response = await client.login({
        username: formUsername,
        password: formPassword,
      });
      if (response.status === 201) handleAuthenticationSuccess(response);
    } catch (error) {
      dispatch(setForm({ error: 'Login failed' }));
    } finally {
      clearState();
    }
  };

  const isLoggedIn = () => username !== null;

  const renderLoggedIn = () => {
    const loggedInMessage = `Welcome ${username}`;
    return <div>{loggedInMessage}</div>;
  };

  const renderLoggedOut = () => {
    return (
      <div className="LoginForm">
        <Form>
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Username"
            placeholder="Username"
            name="username"
            value={formUsername}
            onChange={handleChange}
          />
          <Form.Input
            icon="lock"
            iconPosition="left"
            label="Password"
            type="password"
            name="password"
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

export default LoginForm;
