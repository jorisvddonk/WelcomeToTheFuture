import React from "react";

export interface IPlanetProps {
  x: number;
  y: number;
  name: string;
}

export default class Planet extends React.Component<IPlanetProps, any> {
  private spriteWidth = 200 * 0.5;
  private spriteHeight = 200 * 0.5;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={["planet", `planet-${this.props.name}`].join(" ")}
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
