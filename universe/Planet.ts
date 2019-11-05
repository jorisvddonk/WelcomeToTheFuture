import { ObjectType, Field } from "type-graphql";
import { Moon } from "./Moon";
import { Vector } from "../starship/Vector";
import { Hazard } from "./Hazard";

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

  bioHazard: Hazard;
  tectonicsHazard: Hazard;
  weatherHazard: Hazard;
  thermalHazard: Hazard;

  get __cls() {
    return Planet.__cls;
  }

  static get __cls() {
    return "PLANET";
  }
}
