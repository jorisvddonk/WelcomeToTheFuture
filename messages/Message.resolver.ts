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
import { filter as _filter } from 'lodash'

@Resolver(of => Message)
export class MessageResolver /* implements ResolverInterface<Message>*/ {
    constructor() { }

    @Subscription({
        topics: ["inbox"]
    })
    inboxSub(
        @Root() payload: Message
    ): Message {
        return payload;
    }

}