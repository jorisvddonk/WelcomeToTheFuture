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
import { Translation } from "./Translation";
import { Achievements } from "../Achievements/AchievementsDAO";

@Resolver(of => Message)
export class MessageResolver /* implements ResolverInterface<Message>*/ {
    constructor() { }

    @Subscription(type => [Message], {
        topics: ["inboxSub"],

    })
    inboxSub(
        @Root() payload: Message[]
    ): Message[] {
        return payload;
    }

    @FieldResolver()
    body(@Root() message: Message, @Arg("translate", type => Translation, { nullable: true }) translate: Translation): string {
        if (translate === Translation.ENGLISH) {
            Achievements.unlock("translate");
            return message._body_en;
        }
        return message._body;
    }

}