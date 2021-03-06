import { IBody, IBodyJSON } from "./IBody";
import { Vector } from "../../starship/Vector";
import { IObject } from "./IObject";

export interface IStarJSON {
  name: string;
  mass: number;
  bodies: IBodyJSON[];
  objects: IObject[];
  position: Vector;
}

export interface IStar extends IStarJSON {
  bodies: IBody[];
}
