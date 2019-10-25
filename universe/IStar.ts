import { IBody, IBodyJSON } from "./IBody";
import { Vector } from "../starship/Vector";

export interface IStarJSON {
  name: string;
  mass: number;
  bodies: IBodyJSON[];
  position: Vector;
}

export interface IStar extends IStarJSON {
  bodies: IBody[];
}
