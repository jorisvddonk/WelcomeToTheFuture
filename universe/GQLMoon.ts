import { ObjectType, Field } from "type-graphql";
import { IBody } from "./IBody";
import { GQLPlanet } from "./GQLPlanet";

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
}
