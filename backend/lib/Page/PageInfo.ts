import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class PageInfo {
  @Field()
  startCursor: string;
  @Field()
  endCursor: string;
  @Field()
  hasMore: boolean;
  @Field()
  count: number;
}
