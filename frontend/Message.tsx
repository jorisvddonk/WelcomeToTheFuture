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
        <div className="title">{this.props.message.title}</div>
        <div className="body">{this.props.message.body}</div>
      </div>
    );
  }
}
