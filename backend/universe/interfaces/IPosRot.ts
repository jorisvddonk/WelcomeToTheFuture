import { Vector } from "../../starship/Vector";

export interface IPos {
  position: Vector;
}

export interface IRot {
  angle: number;
}

export interface IPosRot extends IPos, IRot { }
