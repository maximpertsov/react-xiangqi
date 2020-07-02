import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Comment, Form, Header } from 'semantic-ui-react';
import update from 'immutability-helper';

const socket = new window.WebSocket(process.env.REACT_APP_WS_CHAT_URL);

const Chat = () => {
  const username = useSelector(state => state.username);

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const renderMessages = () => (
    <div>
      {messages.map(({ avatar, content }) => (
        <Comment>
          <Comment.Avatar src={avatar} />
          <Comment.Content>
            <Comment.Author as="a">{content.author}</Comment.Author>
            {content.metadata.map(line => (
              <Comment.Metadata>
                <div>{line}</div>
              </Comment.Metadata>
            ))}
            <Comment.Text>{content.text}</Comment.Text>
          </Comment.Content>
        </Comment>
      ))}
    </div>
  );

  useEffect(() => {
    socket.onmessage = event => {
      const { message } = JSON.parse(event.data);
      const newMessages = update(messages, { $push: [message] });
      setMessages(newMessages);
    };
  }, [messages]);

  return (
    <Comment.Group>
      <Header as="h3" dividing>
        Chat
      </Header>

      {renderMessages()}

      <Form reply>
        <Form.TextArea
          onChange={event => setNewMessage(event.target.value)}
          value={newMessage}
        />
        <Button
          onClick={() => {
            if (!newMessage) return;

            socket.send(
              JSON.stringify({
                message: {
                  avatar: '/images/avatar/small/matt.jpg',
                  content: {
                    author: username || 'anonymous',
                    text: newMessage,
                    metadata: ['Today at 5:42PM'],
                  },
                },
              }),
            );

            setNewMessage('');
          }}
          content="Reply"
          labelPosition="left"
          icon="edit"
          primary
        />
      </Form>
    </Comment.Group>
  );
};

export default Chat;
