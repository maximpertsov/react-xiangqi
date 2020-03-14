import { combineReducers } from 'redux';
import username from './username';
import password from './password';
import error from './error';
import loading from './loading';

const loginForm = combineReducers({ username, password, error, loading });

export default loginForm;
