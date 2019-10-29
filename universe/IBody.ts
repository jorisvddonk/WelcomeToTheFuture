import { Vector } from "../starship/Vector";

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
}

export interface IBody extends IBodyJSON {
  star: string;
}