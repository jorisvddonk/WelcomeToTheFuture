import React from "react";
import Starship from "./Starship";
import Planet from "./Planet";
import { client } from "./graphqlClient";
import gql from "graphql-tag";

export default class App extends React.Component<any, any> {
  private lastTimestamp: number;

  constructor(props) {
    super(props);
    this.state = {
      spaceship: {
        position: {
          x: 0,
          y: 0
        },
        velocity: {
          x: 0.0,
          y: 0.0
        },
        angle: 0
      },
      planets: [
        {
          x: 0,
          y: 0
        }
      ]
    };

    client
      .subscribe({
        query: gql`
          subscription {
            newNotification {
              x
              y
              angle
              velocity {
                x
                y
              }
            }
          }
        `
      })
      .forEach(x => {
        this.setState({
          spaceship: {
            ...this.state.spaceship,
            position: {
              x: x.data.newNotification.x,
              y: x.data.newNotification.y
            },
            velocity: {
              x: x.data.newNotification.velocity.x,
              y: x.data.newNotification.velocity.y
            },
            angle: x.data.newNotification.angle
          }
        });
      });

    window.requestAnimationFrame(this.step);
  }

  step = timestamp => {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }
    let stepTime = timestamp - this.lastTimestamp;
    this.setState({
      spaceship: {
        ...this.state.spaceship,
        position: {
          x:
            this.state.spaceship.position.x +
            this.state.spaceship.velocity.x * (stepTime / 1000),
          y:
            this.state.spaceship.position.y +
            this.state.spaceship.velocity.y * (stepTime / 1000)
        }
      }
    });
    this.lastTimestamp = timestamp;
    window.requestAnimationFrame(this.step);
  };

  render() {
    return (
      <div className="spaceCanvasParent">
        <div
          className="spaceCanvas"
          style={{
            backgroundPositionX: -this.state.spaceship.position.x,
            backgroundPositionY: -this.state.spaceship.position.y
          }}
        >
          <div
            className="spaceObjects"
            style={{
              left: `${250 - this.state.spaceship.position.x}px`,
              top: `${250 - this.state.spaceship.position.y}px`
            }}
          >
            {this.state.planets.map((planet, i) => {
              return (
                <Planet key={`planet_${i}`} x={planet.x} y={planet.y}></Planet>
              );
            })}
          </div>
        </div>
        <Starship angle={this.state.spaceship.angle} />
      </div>
    );
  }
}
