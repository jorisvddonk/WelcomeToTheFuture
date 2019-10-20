import { Field, ObjectType } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";
import { Velocity } from "./Velocity";

@ObjectType()
export class CoordinateNotification implements IPosRot {
  constructor(x: number, y: number, angle: number, velocity: Velocity) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.velocity = velocity;
  }

  @Field()
  x: number;

  @Field()
  y: number;

  @Field(type => Velocity)
  velocity: Velocity;

  @Field()
  angle: number;
}
