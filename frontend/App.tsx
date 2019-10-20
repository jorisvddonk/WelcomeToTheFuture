import React from "react";
import Starship from "./Starship";
import Planet from "./Planet";
import { client } from "./graphqlClient";
import gql from "graphql-tag";

export default class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      spaceship: {
        position: {
          x: 0,
          y: 0
        },
        velocity: {
          x: 0.1,
          y: 0.01
        },
        angle: -1
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
            angle: x.data.newNotification.angle
          }
        });
      });

    setInterval(() => {
      this.setState({
        spaceship: {
          ...this.state.spaceship,
          position: {
            x:
              this.state.spaceship.position.x + this.state.spaceship.velocity.x,
            y: this.state.spaceship.position.y + this.state.spaceship.velocity.y
          }
        }
      });
    }, 0);
  }

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
