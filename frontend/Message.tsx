import React from "react";

export interface IMessage {
  title: string;
  body: string;
  id: string;
  isRead: boolean;
}

interface IMessageProps {
  message: IMessage;
}

export default class Message extends React.Component<IMessageProps, any> {
  render() {
    return (
      <div
        className={`message${
          this.props.message.isRead === false
            ? " message-unread"
            : " message-read"
        }`}
      >
        <h3>{this.props.message.title}</h3>
        <pre>{this.props.message.body}</pre>
      </div>
    );
  }
}
