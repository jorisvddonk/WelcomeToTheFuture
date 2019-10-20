import { ObjectType, Field } from "type-graphql";
import { IStar } from "./IStar";
import { GQLPlanet } from "./GQLPlanet";
import { Vector } from "../starship/Vector";

@ObjectType()
export class GQLStar {
  @Field()
  name!: string;

  @Field()
  mass!: number;

  @Field(type => Vector)
  position!: Vector;
}
