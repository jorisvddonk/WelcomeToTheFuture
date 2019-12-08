import React from "react";
import Message, { IMessage } from "./Message";
import { client } from "../lib/graphqlClient";
import gql from "graphql-tag";

export enum MessageDisplay {
  COUNTER = "COUNTER",
  FROM = "FROM",
  TITLE = "TITLE"
}

interface IMessagesState {
  messages: IMessage[];
}

interface IMessagesProps {
  show: MessageDisplay;
}

export default class Messages extends React.Component<IMessagesProps, IMessagesState> {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    const inboxQuery = `
  title
  body
  id
  isRead
  from`;

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

  renderCounter() {
    return <><b>{this.numUnreadMessages}</b>{" "}<span>unread message(s).</span></>
  }

  renderTitle() {
    return <><b>{this.numUnreadMessages}</b>{" "}<span>unread message(s):</span>{this.state.messages.filter(message => message.isRead === false).map(message => (
      <Message message={message} showBody={false} />
    ))}</>
  }

  renderFrom() {
    return <><b>{this.numUnreadMessages}</b>{" "}<span>unread message(s) from </span>{this.state.messages.filter(message => message.isRead === false).map((message, index, array) => (
      <><em>{message.from}</em><span>{index === array.length - 1 ? '' : ', '}</span></>
    ))}</>
  }

  render() {
    return (
      <div>
        {this.numUnreadMessages > 0 && <>
          {this.props.show === MessageDisplay.COUNTER && this.renderCounter()}
          {this.props.show === MessageDisplay.FROM && this.renderFrom()}
          {this.props.show === MessageDisplay.TITLE && this.renderTitle()}
          <br />
          <span>(use GraphQL <em>inbox</em> query to read the message body!)</span>
        </>}
      </div>
    );
  }
}
