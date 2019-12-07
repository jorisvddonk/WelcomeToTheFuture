import React from "react";
import { CANVAS_HEIGHT_PX, CANVAS_WIDTH_PX } from "./consts";

export interface IStarshipProps {
  angle: number;
  thrusting: boolean;
  hyperjumping: boolean;
}

export default class Starship extends React.Component<IStarshipProps, any> {
  private spriteWidth = 157 * 0.5;
  private spriteHeight = 309 * 0.5;

  render() {
    return (
      <div
        className="starship"
        style={{
          left: `${CANVAS_WIDTH_PX * 0.5 - this.spriteWidth * 0.5}px`,
          top: `${CANVAS_HEIGHT_PX * 0.5 - this.spriteHeight * 0.5}px`,
          width: `${this.spriteWidth}px`,
          height: `${this.spriteHeight}px`,
          transform: `rotate(${this.props.angle}deg)`,
          filter: this.props.hyperjumping
            ? "drop-shadow(0px 0px 12px cyan)"
            : ""
        }}
      >
        {(this.props.thrusting || this.props.hyperjumping) && (
          <div className="thrust"></div>
        )}
      </div>
    );
  }
}
