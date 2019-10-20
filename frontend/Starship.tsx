import React from "react";

export interface IStarshipProps {
  angle: number;
  thrusting: boolean;
}

export default class Starship extends React.Component<IStarshipProps, any> {
  private spriteWidth = 157 * 0.5;
  private spriteHeight = 309 * 0.5;

  render() {
    return (
      <div
        className="starship"
        style={{
          left: `${250 - this.spriteWidth * 0.5}px`,
          top: `${250 - this.spriteHeight * 0.5}px`,
          width: `${this.spriteWidth}px`,
          height: `${this.spriteHeight}px`,
          transform: `rotate(${this.props.angle}rad)`
        }}
      >
        {this.props.thrusting && <div className="thrust"></div>}
      </div>
    );
  }
}
