import { readFileSync } from "fs";
import { Star } from "./Star";
import { IStar, IStarJSON } from "./IStar";
import { IBody, IBodyJSON } from "./IBody";
import { Starship } from "../starship/Starship";
import { flatten } from "lodash";
import glob from "glob";
import Sylvester from "../starship/sylvester-withmods";
import { Vector } from "../starship/Vector";
import { Planet } from "./Planet";
import { Moon } from "./Moon";
import { UnidentifiedObject } from "./UnidentifiedObject";

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
      const star = new Star();
      star.mass = s.mass;
      star.name = s.name;
      star.position = s.position;
      star.unidentifiedObjects = s.objects.map(obj => {
        const unidentifiedObject = new UnidentifiedObject();
        unidentifiedObject.angle = obj.angle;
        unidentifiedObject.position = obj.position;
        unidentifiedObject.scannerData = obj.scannerData;
        return unidentifiedObject;
      });
      const planets: Planet[] = [] as Planet[];
      const moons: Moon[] = [] as Moon[];
      s.bodies.forEach((body: IBodyJSON) => {
        // TODO: use class-transformer?
        if (body.parent !== undefined) {
          const moon = new Moon();
          moon.diameter = body.diameter;
          moon.gravity = body.gravity;
          moon.length_of_day = body.length_of_day
          moon.mass = body.mass;
          moon.name = body.name;
          moon.orbital_period = body.orbital_period;
          moon.position = body.position;
          moon.type = body.type;
          moons.push(moon);
        } else {
          const planet = new Planet();
          planet.diameter = body.diameter;
          planet.gravity = body.gravity;
          planet.length_of_day = body.length_of_day
          planet.mass = body.mass;
          planet.name = body.name;
          planet.orbital_period = body.orbital_period;
          planet.position = body.position;
          planet.type = body.type;
          planet.bioHazard = body.bioHazard;
          planet.thermalHazard = body.thermalHazard;
          planet.weatherHazard = body.weatherHazard;
          planet.tectonicsHazard = body.tectonicsHazard;
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
    return this.getBodies().filter(x => x.parent === undefined);
  }

  getMoons() {
    return this.getBodies().filter(x => x.parent !== undefined);
  }

  findStar(name: string): Star | undefined {
    return this.getStars().find(star => star.name === name);
  }

  getCurrentStar() {
    return this.findStar(this.currentStarname);
  }

  private get planets() {
    return this.stars.reduce(
      (memo, star) => {
        return memo.concat(star.bodies.filter(x => x.__cls === Planet.__cls) as Planet[]);
      },
      [] as Planet[]
    );
  }

  private get moons() {
    return this.stars.reduce(
      (memo, star) => {
        return memo.concat(star.bodies.filter(x => x.__cls === Moon.__cls) as Moon[]);
      },
      [] as Moon[]
    );
  }

  getPlanet(planetname: string, starname: string) {
    return this.planets.find(body => body.name === planetname && body.star === starname);
  }

  getPlanetMoons(planetname: string, starname: string) {
    return this.moons.filter(body => body.planet.name === planetname && body.planet.star === starname);
  }

  getStarPlanets(starname) {
    return this.getStarBodies(starname)
      .filter(body => body.__cls === Planet.__cls)
  }

  getStarMoons(starname) {
    return this.getStarBodies(starname)
      .filter(body => body.__cls !== Moon.__cls)
  }

  getStarBodies(starname) {
    const foundStar = this.stars.find(s => s.name === starname);
    if (foundStar === undefined) {
      throw new Error("star not found");
    }
    return foundStar.bodies;
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
