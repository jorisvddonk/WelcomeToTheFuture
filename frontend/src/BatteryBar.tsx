import React from "react";
import { client } from "./graphqlClient";
import gql from "graphql-tag";

interface IBatteryBar {
  current: number,
  max: number
}

export default class BatteryBar extends React.Component<any, IBatteryBar> {
  constructor(props) {
    super(props);

    this.state = {
      current: 1,
      max: 1
    };

    const powerQuery = `
    queryBattery {
      current
      max
    }`;

    client
      .query({
        query: gql`
          query {
            starship {
              ${powerQuery}
            }
          }
        `
      })
      .then(result => {
        this.setState({ current: result.data.starship.queryBattery.current, max: result.data.starship.queryBattery.max });
      });

    client
      .subscribe({
        query: gql`
          subscription {
            starshipUpdate {
              ${powerQuery}
            }
          }
        `
      })
      .forEach(result => {
        this.setState({ current: result.data.starshipUpdate.queryBattery.current, max: result.data.starshipUpdate.queryBattery.max });
      });
  }

  render() {
    let perc = (this.state.current * 100) / this.state.max;
    return (
      <div className="batteryBar">
        <div className="batteryBarCurrent" style={{ width: `${perc}%` }}></div>
      </div>
    );
  }
}
