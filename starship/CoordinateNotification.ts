import { Field, ObjectType } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";
import { Vector } from "./Vector";

@ObjectType()
export class CoordinateNotification implements IPosRot {
  constructor(
    position: Vector,
    angle: number,
    velocity: Vector,
    thrusting: boolean
  ) {
    this.position = position;
    this.angle = angle;
    this.velocity = velocity;
    this.thrusting = thrusting;
  }

  @Field(type => Vector)
  position: Vector;

  @Field(type => Vector)
  velocity: Vector;

  @Field()
  angle: number;

  @Field()
  thrusting: boolean;
}
