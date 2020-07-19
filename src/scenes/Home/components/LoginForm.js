import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Form } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';

import authenticate from 'actions/authenticate';
import login from 'actions/login';
import updateLoginForm from 'actions/updateLoginForm';

const mapStateToProps = createSelector(
  state => state.loginForm,
  state => state.username,

  (loginForm, username) => ({
    isLoggedIn: username !== null,
    formUsername: loginForm.username,
    formPassword: loginForm.password,
    formError: loginForm.error,
    username,
  }),
);

const LoginForm = () => {
  const dispatch = useDispatch();
  const {
    isLoggedIn,
    formUsername,
    formPassword,
    formError,
    username,
  } = useSelector(state => mapStateToProps(state), isEqual);

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  const handleChange = event => {
    const {
      target: { name, value },
    } = event;
    dispatch(updateLoginForm({ [name]: value }));
  };

  const handleClick = () => {
    dispatch(
      login({
        username: formUsername,
        password: formPassword,
      }),
    );
  };

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

  return isLoggedIn ? renderLoggedIn() : renderLoggedOut();
};

export default LoginForm;
