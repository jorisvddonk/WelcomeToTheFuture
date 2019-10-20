import { ObjectType, Field } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";
import { Velocity } from "./Velocity";

@ObjectType()
export class GQLStarship implements IPosRot {
  constructor(name?: string) {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.velocity = new Velocity(0, 10);

    if (name !== undefined) {
      this.name = name;
    } else {
      this.name = "Starship McStarshipface";
    }
  }

  @Field()
  name!: string;

  @Field()
  x: number;

  @Field()
  y: number;

  @Field(type => Velocity)
  velocity: Velocity;

  @Field()
  angle: number;
}
