import { IStar } from "./IStar";
import { Vector } from "../starship/Vector";

export interface IBody {
  name: string;
  parent?: string;
  mass: number;
  diameter: number;
  gravity: number;
  length_of_day: number;
  orbital_period: number;
  position: Vector;
  distance_from_parent: number;
}
