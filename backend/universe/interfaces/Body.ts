import { Field, InterfaceType } from "type-graphql";
import { Vector } from "../starship/Vector";

@InterfaceType()
export abstract class Body {
  @Field()
  name!: string;

  @Field()
  type!: string;

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
