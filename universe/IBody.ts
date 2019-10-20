import { IStar } from "./IStar";

export interface IBody {
  name: string;
  parent?: string;
  mass: number;
  diameter: number;
  gravity: number;
  length_of_day: number;
  orbital_period: number;
}
