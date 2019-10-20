import { ObjectType, Field } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";
import { Vector } from "./Vector";

@ObjectType()
export class GQLStarship implements IPosRot {
  constructor(name?: string) {
    this.position = new Vector(0, 0);
    this.angle = 0;
    this.velocity = new Vector(0, 0);
    this.thrusting = false;
    this.desiredAngle = this.angle;

    if (name !== undefined) {
      this.name = name;
    } else {
      this.name = "Starship McStarshipface";
    }
  }

  @Field()
  name!: string;

  @Field(type => Vector)
  position: Vector;

  @Field(type => Vector)
  velocity: Vector;

  @Field()
  angle: number;

  @Field()
  thrusting: boolean;

  @Field()
  desiredAngle: number;
}
