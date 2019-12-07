import React from "react";
import Message, { IMessage } from "./Message";
import { client } from "./graphqlClient";
import gql from "graphql-tag";

interface IMessagesState {
  messages: IMessage[];
}

export default class Messages extends React.Component<any, IMessagesState> {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    const inboxQuery = `
  title
  body
  id
  isRead`;

    client
      .query({
        query: gql`
          query {
            inbox {
              ${inboxQuery}
            }
          }
        `
      })
      .then(result => {
        this.setState({ messages: result.data.inbox });
      });

    client
      .subscribe({
        query: gql`
          subscription {
            inboxSub {
              ${inboxQuery}
            }
          }
        `
      })
      .forEach(x => {
        this.setState({ messages: x.data.inboxSub });
      });
  }

  private get numUnreadMessages() {
    return this.state.messages.filter(message => message.isRead === false).length;
  }

  render() {
    return (
      <div>
        {this.numUnreadMessages > 0 && <>
          <span>{this.numUnreadMessages}</span>{}<span>unread message(s):</span>
          {this.state.messages.filter(message => message.isRead === false).map(message => (
            <Message message={message} showBody={false} />
          ))}
          <span>(use GraphQL to read the message body!)</span>
        </>}
      </div>
    );
  }
}
