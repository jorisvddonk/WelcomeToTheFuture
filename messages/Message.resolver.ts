import {
    Query,
    Arg,
    Resolver,
    FieldResolver,
    Root,
    ResolverInterface,
    Subscription,
    Mutation
} from "type-graphql";
import { Message } from "./Message";
import { Messages } from "./MessagesDAO";

@Resolver(of => Message)
export class MessageResolver /* implements ResolverInterface<Message>*/ {
    constructor() { }

    @Query(returns => [Message], { nullable: true })
    async inbox(): Promise<Message[] | undefined> {
        return Messages.messages;
    }


    @Subscription({
        topics: ["inbox"]
    })
    inboxSub(
        @Root() payload: Message
    ): Message {
        return payload;
    }

    @Mutation()
    markAsRead(@Arg("id") id: string): Message {
        Messages.markAsRead(id);
        return Messages.get(id);
    }
}
