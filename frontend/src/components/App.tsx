import React from "react";
import GQLPlayground from "./GQLPlayground";
import Messages from "./Messages";
import BatteryBar from "./BatteryBar";
import Space from "./Space";
import Surface from "./Surface";
import { EScreenType } from "../types/EScreenType";
import { ESurfaceType } from "../types/ESurfaceType";
import { client } from "../lib/graphqlClient";
import gql from "graphql-tag";

interface IAppState {
  zoom: number,
  screen: EScreenType
}

export default class App extends React.Component<any, IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
      screen: EScreenType.SPACE
    };

    const uiUpdateQuery = `
      screen
    `;

    client
      .subscribe({
        query: gql`
          subscription {
            uiStateUpdate {
              ${uiUpdateQuery}
            }
          }
        `
      })
      .forEach(x => {
        this.setState({ screen: x.data.uiStateUpdate.screen });
      });
  }

  render() {
    return (
      <div className="main">
        <div className="screenCanvas">
          {this.state.screen === EScreenType.SPACE &&
            <Space zoomfactor={this.state.zoom} />
          }
          {this.state.screen === EScreenType.SURFACE &&
            <Surface surfaceType={ESurfaceType.GRASS} showShipLanding={true} />
          }
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
