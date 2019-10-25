import { ObjectType, Field } from "type-graphql";
import { GQLMoon } from "./GQLMoon";
import { Vector } from "../starship/Vector";

@ObjectType()
export class GQLPlanet {
  @Field()
  name!: string;

  star!: string;

  @Field(type => [GQLMoon])
  satellites!: GQLMoon[];

  @Field()
  mass!: number;

  @Field()
  diameter!: number;

  @Field()
  gravity!: number;

  @Field()
  length_of_day!: number;

  @Field()
  orbital_period!: number;

  @Field(type => Vector)
  position!: Vector;
}
