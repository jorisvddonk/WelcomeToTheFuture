import { ObjectType, Field, registerEnumType } from "type-graphql"

export enum Status {
  OK = "OK",
  ERROR = "ERROR"
}

registerEnumType(Status, {
  name: "Status"
})

@ObjectType()
export class MutationResult {
  constructor(status: Status) {
    this.status = status;
    this.timestamp = new Date().getTime()
  }

  @Field(type => Status)
  status: Status

  @Field()
  timestamp: number
}