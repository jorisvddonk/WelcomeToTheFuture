import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class GQLStarship {
  @Field()
  name!: string;
}
