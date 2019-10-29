import { Vector } from "../starship/Vector";
import { Hazard } from "./Hazard";

export interface IBodyJSON {
  name: string;
  parent?: string;
  mass: number;
  diameter: number;
  type: string;
  gravity: number;
  length_of_day: number;
  orbital_period: number;
  position: Vector;
  distance_from_parent: number;
  bioHazard: Hazard;
  weatherHazard: Hazard;
  tectonicsHazard: Hazard;
  thermalHazard: Hazard;
}

export interface IBody extends IBodyJSON {
  star: string;
}