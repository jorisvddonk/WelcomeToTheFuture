import { Star } from "./Star";
import { Vector } from "../starship/Vector";

export function getRangeBetweenStars(a: Star, b: Star) {
  return getRangeBetweenPositions(a.position, b.position);
}

export function getRangeBetweenPositions(p1: Vector, p2: Vector) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}