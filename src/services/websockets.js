import React, { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'actions';

export const WebSocketContext = createContext(null);

const createMessage = (type, payload) => ({
  createdAt: new Date(),
  type,
  payload,
});

/* eslint-disable react/prop-types */
export const WebSocketProvider = ({ children }) => {
  let socket;
  let io;

  const dispatch = useDispatch();
  const gameSlug = useSelector(state => state.gameSlug);

  const send = (type, payload) => {
    const message = createMessage(type, payload);
    socket.send(JSON.stringify(message));
  };

  if (!socket && gameSlug) {
    socket = new WebSocket(`${process.env.REACT_APP_WS_CHAT_URL}/${gameSlug}`);

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

export default {};
