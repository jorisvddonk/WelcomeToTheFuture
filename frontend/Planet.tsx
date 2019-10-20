import React from "react";

export interface IPosition {
  x: number;
  y: number;
}

export default class Planet extends React.Component<IPosition, any> {
  private spriteWidth = 200 * 0.5;
  private spriteHeight = 200 * 0.5;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="planet"
        style={{
          left: `${this.props.x - this.spriteWidth * 0.5}px`,
          top: `${this.props.y - this.spriteHeight * 0.5}px`,
          width: `${this.spriteWidth}px`,
          height: `${this.spriteHeight}px`
        }}
      ></div>
    );
  }
}
