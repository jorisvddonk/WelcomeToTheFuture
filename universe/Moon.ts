import { ObjectType, Field } from "type-graphql";
import { Planet } from "./GQLPlanet";
import { Vector } from "../starship/Vector";

@ObjectType()
export class Moon {
  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field(type => Planet)
  planet!: Planet;

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
