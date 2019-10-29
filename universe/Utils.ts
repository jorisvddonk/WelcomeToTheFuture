import { Star } from "./Star";

export function getRangeBetweenStars(a: Star, b: Star) {
  const p1 = a.position;
  const p2 = b.position;
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}