import React from "react";

export interface ISpriteProps {
  x: number;
  y: number;
  name?: string;
}

export default abstract class Sprite<T> extends React.Component<
  ISpriteProps & T,
  any
  > {
  constructor(props) {
    super(props);
  }

  abstract getClassName(): string;
  abstract getSpriteWidth(): number;
  abstract getSpriteHeight(): number;
  abstract getAngle(): number;

  render() {
    return (
      <div
        className={this.getClassName()}
        style={{
          left: `${this.props.x - this.getSpriteWidth() * 0.5}px`,
          top: `${this.props.y - this.getSpriteHeight() * 0.5}px`,
          width: `${this.getSpriteWidth()}px`,
          height: `${this.getSpriteHeight()}px`,
          transform: `rotate(${this.getAngle()}deg)`
        }}
      ></div>
    );
  }
}
