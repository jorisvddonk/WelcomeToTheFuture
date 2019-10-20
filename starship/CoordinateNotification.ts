import { Field, ObjectType } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";

@ObjectType()
export class CoordinateNotification implements IPosRot {
  constructor(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  @Field()
  x: number;

  @Field()
  y: number;

  @Field()
  angle: number;
}
