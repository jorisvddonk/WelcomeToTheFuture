import { ObjectType, Field } from "type-graphql";
import { IBody } from "./IBody";
import { GQLMoon } from "./GQLMoon";
import { GQLStar } from "./GQLStar";

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
}
