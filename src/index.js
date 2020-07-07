import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import styled from '@emotion/styled';
import WebSocketProvider from 'services/WebSocketProvider';

import App from './App';
import rootReducer from './reducers';
import * as serviceWorker from './serviceWorker';

const getReduxDevExtOptions = () => {
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return f => f;
  if (process.env.NODE_ENV !== 'development') return f => f;

  return window.__REDUX_DEVTOOLS_EXTENSION__();
};

const store = compose(
  applyMiddleware(thunk),
  getReduxDevExtOptions(),
)(createStore)(rootReducer);

const Wrapper = styled.div`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <WebSocketProvider>
      <Wrapper>
        <App />
      </Wrapper>
    </WebSocketProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
