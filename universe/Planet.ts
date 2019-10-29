import { ObjectType, Field } from "type-graphql";
import { Moon } from "./Moon";
import { Vector } from "../starship/Vector";

@ObjectType()
export class Planet {
  @Field()
  name!: string;

  @Field()
  type!: string;

  star!: string;

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
