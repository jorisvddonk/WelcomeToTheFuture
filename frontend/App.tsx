import React from "react";
import Starship from "./Starship";
import Planet from "./Planet";
import { client } from "./graphqlClient";
import gql from "graphql-tag";
import { CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX } from "./consts";

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
        angle: 0,
        thrusting: false
      },
      planets: [],
      stars: []
    };

    client
      .query({
        query: gql`
          query {
            star(name: "Sol") {
              name
              position {
                x
                y
              }
              planets {
                name
                position {
                  x
                  y
                }
                diameter
                moons {
                  name
                  position {
                    x
                    y
                  }
                }
              }
            }
          }
        `
      })
      .then(result => {
        const planets = result.data.star.planets.map(planet => {
          return {
            name: planet.name,
            position: planet.position,
            diameter: planet.diameter / 12756 // earth: 1 diameter
          };
        });
        this.setState({
          planets
        });
      });

    client
      .subscribe({
        query: gql`
          subscription {
            newNotification {
              position {
                x
                y
              }
              angle
              thrusting
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
              x: x.data.newNotification.position.x,
              y: x.data.newNotification.position.y
            },
            velocity: {
              x: x.data.newNotification.velocity.x,
              y: x.data.newNotification.velocity.y
            },
            angle: x.data.newNotification.angle,
            thrusting: x.data.newNotification.thrusting
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
            backgroundPositionY: -this.state.spaceship.position.y,
            width: `${CANVAS_WIDTH_PX}px`,
            height: `${CANVAS_HEIGHT_PX}px`
          }}
        >
          <div
            className="spaceObjects"
            style={{
              left: `${CANVAS_WIDTH_PX * 0.5 -
                this.state.spaceship.position.x}px`,
              top: `${CANVAS_HEIGHT_PX * 0.5 -
                this.state.spaceship.position.y}px`
            }}
          >
            {this.state.planets.map((planet, i) => {
              return (
                <Planet
                  key={`planet_${i}`}
                  name={planet.name}
                  x={planet.position.x}
                  y={planet.position.y}
                  diameter={planet.diameter}
                ></Planet>
              );
            })}
          </div>
        </div>
        <Starship
          angle={this.state.spaceship.angle}
          thrusting={this.state.spaceship.thrusting}
        />
      </div>
    );
  }
}
