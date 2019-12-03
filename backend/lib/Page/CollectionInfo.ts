import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class CollectionInfo {
  @Field()
  count: number;
}
