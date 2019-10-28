import { readFileSync } from "fs";
import { GQLStar } from "./GQLStar";
import { IStar, IStarJSON } from "./IStar";
import { IBody } from "./IBody";
import { GQLStarship } from "../starship/GQLStarship";
import { Vector } from "../starship/Vector";
import glob from "glob";
import Sylvester from "../starship/sylvester-withmods";

export class UniverseDAO {
  private stars: IStar[] = [];
  public starship: GQLStarship;
  private currentStarname: string;
  private starUpdateListeners = [];

  constructor() {
    this.reloadStars();
    this.starship = new GQLStarship();
    this.currentStarname = this.stars[0].name;

    const sol = this.stars.find(star => star.name === "Sol");
    if (sol !== undefined) {
      this.currentStarname = sol.name;
      const earth = sol.bodies.find(body => body.name === "Earth");
      if (earth !== undefined) {
        this.starship.positionVec = new Sylvester.Vector([earth.position.x, earth.position.y]);
      }
    }
  }

  reloadStars() {
    const stars: IStar[] = [];
    const loadStar = (path: string) => {
      const starData: IStarJSON = JSON.parse(
        readFileSync(path).toString()
      );
      stars.push({ ...starData, bodies: starData.bodies.map(body => { return { ...body, star: starData.name } }) });
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

  getCurrentStar() {
    return this.findStar(this.currentStarname);
  }

  private get bodies() {
    return this.stars.reduce(
      (memo, star) => {
        return memo.concat(star.bodies);
      },
      [] as IBody[]
    );
  }

  getPlanet(planetname: string, starname: string) {
    return this.bodies.find(body => body.name === planetname && body.star === starname);
  }

  getPlanetMoons(planetname: string, starname: string) {
    return this.bodies.filter(body => body.parent === planetname && body.star === starname);
  }

  getStarPlanets(starname) {
    const foundStar = this.stars.find(s => s.name === starname);
    if (foundStar === undefined) {
      throw new Error("star not found");
    }
    return foundStar.bodies
      .filter(body => body.parent === undefined && body.star === starname)
      .map(body => {
        return {
          star: starname,
          ...body
        };
      });
  }

  hyperspaceJump(starname) {
    const foundStar = this.stars.find(s => s.name === starname);
    if (foundStar === undefined) {
      throw new Error("star not found");
    }
    this.currentStarname = starname;
    this.starUpdateListeners.forEach(x => x());
  }

  addStarUpdateListener(listener) {
    this.starUpdateListeners.push(listener);
  }
}

export const Universe = new UniverseDAO();
