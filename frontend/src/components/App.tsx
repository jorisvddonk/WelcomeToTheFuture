import React from "react";
import GQLPlayground from "./GQLPlayground";
import Messages from "./Messages";
import BatteryBar from "./BatteryBar";
import Space from "./Space";

export default class App extends React.Component<any, any> {
  private lastTimestamp: number;

  constructor(props) {
    super(props);
    this.state = {
      zoom: 1
    };
  }

  render() {
    return (
      <div className="main">
        <div className="spaceCanvasParent">
          <Space zoomfactor={this.state.zoom} />
        </div>
        <GQLPlayground />
        <div className="info">
          <button
            onClick={() => {
              this.setState({ zoom: this.state.zoom + 1 });
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              if (this.state.zoom > 1) {
                this.setState({ zoom: this.state.zoom - 1 });
              }
            }}
          >
            +
          </button>
          <Messages />
          <BatteryBar />
        </div>
      </div>
    );
  }
}
