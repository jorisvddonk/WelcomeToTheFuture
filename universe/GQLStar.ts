import { ObjectType, Field } from "type-graphql";
import { IStar } from "./IStar";
import { GQLPlanet } from "./GQLPlanet";

@ObjectType()
export class GQLStar {
  @Field()
  name!: string;

  @Field()
  mass!: number;
}
