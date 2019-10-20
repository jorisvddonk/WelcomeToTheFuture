export interface IPos {
  x: number;
  y: number;
}

export interface IRot {
  angle: number;
}

export interface IPosRot extends IPos, IRot {}
