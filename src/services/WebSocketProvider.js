import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';

import actions from 'actions';

export const WebSocketContext = createContext(null);

/* eslint-disable react/prop-types */
const WebSocketProvider = ({ children }) => {
  let socket;
  let io;

  const dispatch = useDispatch();

  const send = payload => {
    socket.send(JSON.stringify(payload));
  };

  if (!socket) {
    socket = new WebSocket(process.env.REACT_APP_WS_CHAT_URL);

    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      dispatch(actions.messages.append(message));
    };

    io = { socket, send };
  }

  return (
    <WebSocketContext.Provider value={io}>{children}</WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
