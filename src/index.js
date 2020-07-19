import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose,createStore } from 'redux';
import thunk from 'redux-thunk';

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

ReactDOM.render(
  <Provider store={store}>
    <WebSocketProvider>
      <DndProvider backend={Backend}>
        <App />
      </DndProvider>
    </WebSocketProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
