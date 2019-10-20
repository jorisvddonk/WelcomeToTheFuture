import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Velocity {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  @Field()
  x: number;

  @Field()
  y: number;
}
