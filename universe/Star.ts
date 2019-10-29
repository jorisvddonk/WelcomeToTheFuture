import { ObjectType, Field } from "type-graphql";
import { IStar } from "./IStar";
import { Planet } from "./Planet";
import { Vector } from "../starship/Vector";

@ObjectType()
export class Star {
  @Field()
  name!: string;

  @Field()
  mass!: number;

  @Field(type => Vector)
  position!: Vector;
}
