import { ObjectType, Field } from "type-graphql";
import { Planet } from "./Planet";
import { Vector } from "../starship/Vector";
import { Body } from "./Body";
import { Locatable } from "./Locatable";

@ObjectType({ implements: [Body, Locatable] })
export class Moon implements Body {
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

  get __cls() {
    return Moon.__cls;
  }

  static get __cls() {
    return "MOON";
  }
}
