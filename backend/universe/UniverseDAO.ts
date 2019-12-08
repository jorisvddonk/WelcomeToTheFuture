import { readFileSync } from "fs";
import { Star } from "./Star";
import { IStar, IStarJSON } from "./interfaces/IStar";
import { IBody, IBodyJSON } from "./interfaces/IBody";
import { Starship } from "../starship/Starship";
import { flatten } from "lodash";
import glob from "glob";
import Sylvester from "../starship/sylvester-withmods";
import { Planet } from "./Planet";
import { Moon } from "./Moon";
import { UnidentifiedObject } from "./UnidentifiedObject";
import { plainToClass } from "class-transformer";
import { getRangeBetweenPositions } from "./Utils";
import { Achievements } from "../Achievements/AchievementsDAO";


export class UniverseDAO {
  private stars: Star[] = [];
  public starship: Starship;
  private currentStarname: string;
  private starUpdateListeners = []; // todo: refactor to eventEmitter
  private landedListeners = []; // todo: refactor to eventEmitter
  public canLand: boolean = false;

  constructor() {
    this.reloadStars();
    this.starship = new Starship();
    this.currentStarname = this.stars[0].name;

    const sol = this.stars.find(star => star.name === "Sol");
    if (sol !== undefined) {
      this.currentStarname = sol.name;
      const spacestation = sol.unidentifiedObjects.find(obj => Buffer.from(obj.scannerData, 'base64').toString('ascii') === "spaceStation");
      if (spacestation !== undefined) {
        this.starship.positionVec = new Sylvester.Vector([spacestation.position.x + 20, spacestation.position.y]);
      }
    }

    this.starship.eventEmitter.on("autopilot_Complete", () => {
      // check if nearby a water planet
      let landablePlanet = this.getCurrentStar().planets.find(planet => {
        if (getRangeBetweenPositions(this.starship.position, planet.position) < 100) {
          return planet.type === "Water" && planet.isSafe();
        }
        return false;
      });
      if (landablePlanet !== undefined) {
        Achievements.unlock("can_land");
        this.canLand = true;
      }
    });
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

  getBodies(): (Planet | Moon)[] {
    return flatten(this.stars.map(x => x.bodies));
  }

  getPlanets(): Planet[] {
    return this.getBodies().filter(x => x.__cls === Planet.__cls) as Planet[];
  }

  getMoons(): Moon[] {
    return this.getBodies().filter(x => x.__cls === Moon.__cls) as Moon[];
  }

  findStar(name: string): Star | undefined {
    return this.getStars().find(star => star.name === name);
  }

  getCurrentStar() {
    return this.findStar(this.currentStarname);
  }

  getPlanet(planetname: string, starname: string) {
    return this.getPlanets().find(body => body.name === planetname && body.star === starname);
  }

  getPlanetMoons(planet: Planet) {
    return this.getMoons().filter(body => body.planet === planet);
  }

  hyperspaceJump(starname) {
    const foundStar = this.stars.find(s => s.name === starname);
    if (foundStar === undefined) {
      throw new Error("star not found");
    }
    this.currentStarname = starname;
    this.starUpdateListeners.forEach(x => x());
  }

  land() {
    if (this.canLand) {
      this.landedListeners.forEach(x => x());
    } else {
      throw new Error("Cannot land here!");
    }
  }

  addStarUpdateListener(listener) {
    this.starUpdateListeners.push(listener);
  }

  addLandedListener(listener) {
    this.landedListeners.push(listener);
  }
}

export const Universe = new UniverseDAO();
