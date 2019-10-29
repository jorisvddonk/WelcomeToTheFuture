import { Hazard } from "./Hazard";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Hazards {
  @Field(type => Hazard)
  bio: Hazard

  @Field(type => Hazard)
  thermal: Hazard

  @Field(type => Hazard)
  weather: Hazard

  @Field(type => Hazard)
  tectonics: Hazard
}