import { InputType, Field } from "type-graphql";

@InputType()
export class InboxFilter {
    @Field({ nullable: true })
    isRead: boolean;
}