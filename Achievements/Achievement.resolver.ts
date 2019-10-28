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
import { Achievement } from "./Achievement";
import { filter as _filter } from 'lodash'

@Resolver(of => Achievement)
export class AchievementResolver /* implements ResolverInterface<Achievement>*/ {
    constructor() { }

    @Subscription({
        topics: ["achievementUnlocked"]
    })
    onAchievementUnlocked(
        @Root() payload: Achievement
    ): Achievement {
        return payload;
    }

}