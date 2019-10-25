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
import { InboxFilter } from "./InboxFilter";
import { filter as _filter } from 'lodash'

@Resolver(of => Message)
export class MessageResolver /* implements ResolverInterface<Message>*/ {
    constructor() { }

    @Query(returns => [Message], { nullable: true })
    async inbox(@Arg("filter", { nullable: true }) filter?: InboxFilter): Promise<Message[] | undefined> {
        if (filter === undefined) {
            return Messages.messages;
        }
        else {
            return _filter(Messages.messages, filter);
        }
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