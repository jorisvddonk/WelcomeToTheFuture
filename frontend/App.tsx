import React from "react";
import Starship from "./Starship";
import Planet from "./Planet";
import { client } from "./graphqlClient";
import gql from "graphql-tag";
import { CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX } from "./consts";
import Moon from "./Moon";
import { flatten } from "lodash";
import Star from "./Star";
import GQLPlayground from "./GQLPlayground";

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
      moons: [],
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
                  diameter
                }
              }
            }
          }
        `
      })
      .then(result => {
        const stars = [result.data.star].map(star => {
          return {
            name: star.name,
            position: star.position
          };
        });
        const planets = result.data.star.planets.map(planet => {
          return {
            name: planet.name,
            position: planet.position,
            diameter: planet.diameter / 12756 // earth: 1 diameter
          };
        });
        const moons = flatten(
          result.data.star.planets.map(planet => {
            return planet.moons;
          })
        ).map(moon => {
          return {
            name: moon.name,
            position: moon.position,
            diameter: moon.diameter / 12756 // earth: 1 diameter
          };
        });
        this.setState({
          planets,
          moons,
          stars
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
      <div className="main">
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
              {this.state.moons.map((moon, i) => {
                return (
                  <Moon
                    key={`moon_${i}`}
                    name={moon.name}
                    x={moon.position.x}
                    y={moon.position.y}
                    diameter={moon.diameter}
                  ></Moon>
                );
              })}
              {this.state.stars.map((star, i) => {
                return (
                  <Star
                    key={`star${i}`}
                    name={star.name}
                    x={star.position.x}
                    y={star.position.y}
                  ></Star>
                );
              })}
            </div>
          </div>
          <Starship
            angle={this.state.spaceship.angle}
            thrusting={this.state.spaceship.thrusting}
          />
        </div>
        <GQLPlayground />
        <div className="info">
          <p>Info goes here</p>
        </div>
      </div>
    );
  }
}
