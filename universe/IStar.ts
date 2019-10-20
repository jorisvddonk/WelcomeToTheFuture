import { IBody } from "./IBody";
import { Vector } from "../starship/Vector";

export interface IStar {
  name: string;
  mass: number;
  bodies: IBody[];
  position: Vector;
}
