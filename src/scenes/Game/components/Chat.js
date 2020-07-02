import React, { useEffect, useState } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react';
import update from 'immutability-helper';

const socket = new window.WebSocket('ws://127.0.0.1:8000/ws/chat/lobby/');

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      avatar: '/images/avatar/small/matt.jpg',
      content: {
        author: 'Matt',
        text: 'How artistic!',
        metadata: ['Today at 5:42PM'],
      },
    },
  ]);

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
        Comments
      </Header>

      {renderMessages()}

      <Form reply>
        <Form.TextArea />
        <Button
          onClick={() => {
            socket.send(
              JSON.stringify({
                message: {
                  avatar: '/images/avatar/small/matt.jpg',
                  content: {
                    author: 'Matt',
                    text: 'How artistic!',
                    metadata: ['Today at 5:42PM'],
                  },
                },
              }),
            );
          }}
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          primary
        />
      </Form>
    </Comment.Group>
  );
};

export default Chat;

/*
    <Comment.Group>
      <Header as="h3" dividing>
        Comments
      </Header>

      <Comment>
        <Comment.Avatar src="/images/avatar/small/matt.jpg" />
        <Comment.Content>
          <Comment.Author as="a">Matt</Comment.Author>
          <Comment.Metadata>
            <div>Today at 5:42PM</div>
          </Comment.Metadata>
          <Comment.Text>How artistic!</Comment.Text>
          <Comment.Actions>
            <Comment.Action>Reply</Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>

      <Comment>
        <Comment.Avatar src="/images/avatar/small/elliot.jpg" />
        <Comment.Content>
          <Comment.Author as="a">Elliot Fu</Comment.Author>
          <Comment.Metadata>
            <div>Yesterday at 12:30AM</div>
          </Comment.Metadata>
          <Comment.Text>
            <p>This has been very useful for my research. Thanks as well!</p>
          </Comment.Text>
          <Comment.Actions>
            <Comment.Action>Reply</Comment.Action>
          </Comment.Actions>
        </Comment.Content>
        <Comment.Group>
          <Comment>
            <Comment.Avatar src="/images/avatar/small/jenny.jpg" />
            <Comment.Content>
              <Comment.Author as="a">Jenny Hess</Comment.Author>
              <Comment.Metadata>
                <div>Just now</div>
              </Comment.Metadata>
              <Comment.Text>Elliot you are always so right :)</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        </Comment.Group>
      </Comment>

      <Comment>
        <Comment.Avatar src="/images/avatar/small/joe.jpg" />
        <Comment.Content>
          <Comment.Author as="a">Joe Henderson</Comment.Author>
          <Comment.Metadata>
            <div>5 days ago</div>
          </Comment.Metadata>
          <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
          <Comment.Actions>
            <Comment.Action>Reply</Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>

      <Form reply>
        <Form.TextArea />
        <Button
          onClick={() => {
            socket.send(
              JSON.stringify({ message: 'HelloHelloIsThereAnyoneThere' }),
            );
          }}
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          primary
        />
      </Form>
    </Comment.Group>
*/
