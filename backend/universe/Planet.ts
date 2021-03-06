import { ObjectType, Field } from "type-graphql";
import { Moon } from "./Moon";
import { Vector } from "../starship/Vector";
import { Hazard } from "./Hazard";
import { Body } from "./interfaces/Body";
import { Locatable } from "./interfaces/Locatable";

@ObjectType({ implements: [Body, Locatable] })
export class Planet implements Body, Locatable {
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

  private isHazardSafe(hazard: Hazard) {
    return hazard === Hazard.NONE || hazard === Hazard.MINIMUM || hazard === Hazard.LOW || hazard === Hazard.MODERATE;
  }

  isSafe() {
    return this.isHazardSafe(this.bioHazard) && this.isHazardSafe(this.tectonicsHazard) && this.isHazardSafe(this.weatherHazard) && this.isHazardSafe(this.thermalHazard);
  }
}
