import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UIStateUpdate {
  constructor(
    screen: string
  ) {
    this.screen = screen;
  }

  @Field()
  screen: string;
}
