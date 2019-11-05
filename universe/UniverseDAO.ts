import { readFileSync } from "fs";
import { Star } from "./Star";
import { IStar, IStarJSON } from "./IStar";
import { IBody, IBodyJSON } from "./IBody";
import { Starship } from "../starship/Starship";
import { flatten } from "lodash";
import glob from "glob";
import Sylvester from "../starship/sylvester-withmods";
import { Planet } from "./Planet";
import { Moon } from "./Moon";
import { UnidentifiedObject } from "./UnidentifiedObject";
import { plainToClass } from "class-transformer";


export class UniverseDAO {
  private stars: Star[] = [];
  public starship: Starship;
  private currentStarname: string;
  private starUpdateListeners = [];

  constructor() {
    this.reloadStars();
    this.starship = new Starship();
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
    });

    const convertedStars: Star[] = [];
    stars.forEach(s => {
      const star = plainToClass(Star, s);
      star.unidentifiedObjects = plainToClass(UnidentifiedObject, s.objects);
      const planets: Planet[] = [] as Planet[];
      const moons: Moon[] = [] as Moon[];
      s.bodies.forEach((body: IBodyJSON) => {
        if (body.parent !== undefined) {
          const moon = plainToClass(Moon, body);
          moons.push(moon);
        } else {
          const planet = plainToClass(Planet, body);
          planets.push(planet);
        }
      });
      moons.forEach(moon => {
        const body = s.bodies.find(body => body.name === moon.name);
        const planet = planets.find(planet => planet.name === body.parent);
        moon.planet = planet;
      });
      star.bodies = [].concat(planets).concat(moons);

      convertedStars.push(star);
    });

    this.stars = convertedStars;
  }

  getStars(): Star[] {
    return this.stars;
  }

  getBodies() {
    return flatten(this.stars.map(x => x.bodies));
  }

  getPlanets() {
    return this.getBodies().filter(x => x.__cls === Planet.__cls);
  }

  getMoons() {
    return this.getBodies().filter(x => x.__cls === Moon.__cls);
  }

  findStar(name: string): Star | undefined {
    return this.getStars().find(star => star.name === name);
  }

  getCurrentStar() {
    return this.findStar(this.currentStarname);
  }

  private get planets() {
    return this.getBodies().filter(x => x.__cls === Planet.__cls);
  }

  private get moons() {
    return this.getBodies().filter(x => x.__cls === Moon.__cls);
  }

  getPlanet(planetname: string, starname: string) {
    return this.planets.find(body => body.name === planetname && body.star === starname);
  }

  getPlanetMoons(planet: Planet) {
    return this.moons.filter(body => body.planet === planet);
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
