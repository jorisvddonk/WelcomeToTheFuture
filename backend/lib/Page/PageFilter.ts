import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class PageFilter {
  @Field(type => String, { nullable: true })
  cursor?: string;

  @Field(type => Int, { nullable: true })
  take?: number;
}