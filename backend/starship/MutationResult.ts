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
  constructor(status: Status, message?: string) {
    this.status = status;
    this.message = message;
    this.timestamp = new Date().getTime()
  }

  @Field(type => Status)
  status: Status

  @Field(type => String, { nullable: true })
  message?: string

  @Field()
  timestamp: number
}