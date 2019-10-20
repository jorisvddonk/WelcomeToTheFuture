import { readFileSync, statSync } from "fs";
import { GQLStar } from "./GQLStar";
import { IStar } from "./IStar";
import { IBody } from "./IBody";

export class UniverseDAO {
  private stars: IStar[] = [];

  constructor() {
    const solData: IStar = JSON.parse(
      readFileSync(__dirname + "/data/sol.json").toString()
    );
    this.stars.push(solData);
  }

  getStars() {}

  findStar(name: string): GQLStar | undefined {
    const foundStar = this.stars.find(star => star.name === name);
    if (foundStar === undefined) {
      return undefined;
    }
    return {
      name: foundStar.name,
      mass: foundStar.mass
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
