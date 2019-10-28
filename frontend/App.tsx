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
import { Vector } from "../starship/Vector";
import Messages from "./Messages";
import Noty from "noty";

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
      stars: [],
      zoom: 1
    };

    const starPropsQuery = `
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
    }`;

    client
      .query({
        query: gql`
          query {
            currentStar {
              ${starPropsQuery}
            }
          }
        `
      })
      .then(result => {
        const star = result.data.currentStar;
        this.setStarData(star);
      });

    client
      .subscribe({
        query: gql`
          subscription {
            starUpdate {
              ${starPropsQuery}
            }
          }
        `
      })
      .forEach(x => {
        const star = x.data.starUpdate;
        this.setStarData(star);
      });

    client
      .subscribe({
        query: gql`
          subscription {
            starshipUpdate {
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
              x: x.data.starshipUpdate.position.x,
              y: x.data.starshipUpdate.position.y
            },
            velocity: {
              x: x.data.starshipUpdate.velocity.x,
              y: x.data.starshipUpdate.velocity.y
            },
            angle: x.data.starshipUpdate.angle,
            thrusting: x.data.starshipUpdate.thrusting
          }
        });
      });

    client
      .subscribe({
        query: gql`
          subscription {
            onAchievementUnlocked {
              title
              body
            }
          }
        `
      })
      .forEach(x => {
        new Noty({
          type: "success",
          layout: "topRight",
          theme: "metroui",
          text: `<b>Achievement unlocked!</b><br/><i>${x.data.onAchievementUnlocked.title}</i><br/><span>${x.data.onAchievementUnlocked.body}</span>`
        }).show();
      });

    window.requestAnimationFrame(this.step);
  }

  setStarData = star => {
    const stars = [star].map(star => {
      return {
        name: star.name,
        position: {
          x: 0,
          y: 0
        } // stars are always at [0,0]
      };
    });
    const planets = star.planets.map(planet => {
      return {
        name: planet.name,
        position: planet.position,
        diameter: planet.diameter / 12756 // earth: 1 diameter
      };
    });
    const moons = flatten(
      star.planets.map(planet => {
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
  };

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

  private get zoomFactor() {
    const z = this.state.zoom;
    return 1 / (Math.pow(z * 0.2, 2) + 0.8);
  }

  render() {
    return (
      <div className="main">
        <div className="spaceCanvasParent">
          <div
            className="spaceCanvas"
            style={{
              backgroundPositionX:
                -this.state.spaceship.position.x * this.zoomFactor,
              backgroundPositionY:
                -this.state.spaceship.position.y * this.zoomFactor,
              backgroundSize: `${this.zoomFactor * 100}% ${this.zoomFactor *
                100}%`
            }}
          >
            <div
              className="spaceUniverse"
              style={{
                transform: `scale(${this.zoomFactor})`
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
              <Starship
                angle={this.state.spaceship.angle}
                thrusting={this.state.spaceship.thrusting}
              />
            </div>
          </div>
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
        </div>
      </div>
    );
  }
}
