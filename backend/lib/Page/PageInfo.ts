import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class PageInfo {
  @Field({ nullable: true })
  startCursor: string;
  @Field({ nullable: true })
  endCursor: string;
  @Field()
  hasMore: boolean;
  @Field()
  count: number;
}
