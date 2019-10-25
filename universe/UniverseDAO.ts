import { readFileSync, statSync } from "fs";
import { GQLStar } from "./GQLStar";
import { IStar } from "./IStar";
import { IBody } from "./IBody";
import { GQLStarship } from "../starship/GQLStarship";
import { Vector } from "../starship/Vector";
import glob from "glob";

export class UniverseDAO {
  private stars: IStar[] = [];
  public starship: GQLStarship;

  constructor() {
    this.reloadStars();
    this.starship = new GQLStarship();

    const sol = this.stars.find(star => star.name === "Sol");
    if (sol !== undefined) {
      const earth = this.stars[0].bodies.find(body => body.name === "Earth");
      if (earth !== undefined) {
        this.starship.position = new Vector(earth.position.x, earth.position.y);
      }
    }
  }

  reloadStars() {
    const stars = [];
    const loadStar = (path: string) => {
      const starData: IStar = JSON.parse(
        readFileSync(path).toString()
      );
      stars.push(starData);
    };

    glob.sync(__dirname + "/data/*.json").forEach(path => {
      loadStar(path);
    })

    this.stars = stars;
  }

  getStars() {
    return this.stars;
  }

  findStar(name: string): GQLStar | undefined {
    const foundStar = this.stars.find(star => star.name === name);
    if (foundStar === undefined) {
      return undefined;
    }
    return {
      name: foundStar.name,
      mass: foundStar.mass,
      position: foundStar.position
    };
  }

  private get bodies() {
    return this.stars.reduce(
      (memo, star) => {
        return memo.concat(star.bodies);
      },
      [] as IBody[]
    );
  }

  getPlanetMoons(planetname: string) {
    return this.bodies.filter(body => body.parent === planetname);
  }

  getStarPlanets(starname) {
    const foundStar = this.stars.find(s => s.name === starname);
    if (foundStar === undefined) {
      throw new Error("star not found");
    }
    return foundStar.bodies
      .filter(body => body.parent === undefined)
      .map(body => {
        return {
          star: starname,
          ...body
        };
      });
  }
}

export const Universe = new UniverseDAO();
