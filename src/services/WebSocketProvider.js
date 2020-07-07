import React, { createContext, useState } from 'react';
import update from 'immutability-helper';

/* eslint-disable react/prop-types */
const WebSocketProvider = ({ children }) => {
  let socket;
  let provider;

  const [messages, setMessages] = useState([]);

  const send = (gameSlug, message) => {
    const payload = {
      game: gameSlug,
      data: message,
    };
    socket.send(JSON.stringify(payload));
  };

  if (!socket) {
    socket = new WebSocket(process.env.REACT_APP_WS_CHAT_URL);

    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      setMessages(update(messages, { $push: [message] }));
    };

    provider = { socket, send };
  }

  return (
    <WebSocketContext.Provider value={provider}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;

export const WebSocketContext = createContext(null);
