import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class MutationResult {
  constructor(status) {
    this.status = status;
    this.timestamp = new Date().getTime()
  }

  @Field()
  status: string

  @Field()
  timestamp: number
}