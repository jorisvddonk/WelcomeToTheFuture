import React from "react";

export enum ESurfaceType {
  GRASS = "grass",
  DESERT = "desert"
}

export interface ISurfaceProps {
  surfaceType: ESurfaceType;
}

export default class Surface extends React.Component<ISurfaceProps, any> {
  private lastTimestamp: number;

  constructor(props) {
    super(props);
    this.state = {};

    window.requestAnimationFrame(this.step);
  }

  step = timestamp => {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }
    let stepTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    window.requestAnimationFrame(this.step);
  };

  render() {
    return (
      <div
        className="surfaceCanvas"
      >
        <div
          className="surface"
        >
          <div className="sky"></div>
          <div className="sun"></div>
          <div className="clouds-background"></div>
          <div className="clouds"></div>
          <div className={["ground", `ground-${this.props.surfaceType}`].join(' ')}></div>
        </div>
      </div>
    );
  }
}
