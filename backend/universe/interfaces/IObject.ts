import { Vector } from "../../starship/Vector";

export interface IObject {
  scannerData: string;
  position: Vector;
  angle: number;
}