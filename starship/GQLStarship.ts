import { ObjectType, Field } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";

@ObjectType()
export class GQLStarship implements IPosRot {
  constructor(name?: string) {
    this.x = 0;
    this.y = 0;
    this.angle = 0;

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

  @Field()
  angle: number;
}
