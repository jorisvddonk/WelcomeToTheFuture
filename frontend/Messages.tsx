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

    client
      .query({
        query: gql`
          query {
            inbox {
              title
              body
              id
              isRead
            }
          }
        `
      })
      .then(result => {
        this.setState({ messages: result.data.inbox });
      });
  }

  render() {
    return (
      <div>
        {this.state.messages.map(message => (
          <Message message={message} />
        ))}
      </div>
    );
  }
}
