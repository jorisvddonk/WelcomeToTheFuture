import { ObjectType, Field } from "type-graphql";
import { GQLPlanet } from "./GQLPlanet";
import { Vector } from "../starship/Vector";

@ObjectType()
export class GQLMoon {
  @Field()
  name!: string;

  @Field(type => GQLPlanet)
  planet!: GQLPlanet;

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
