import {
    Query,
    Arg,
    Resolver,
    FieldResolver,
    Root,
    ResolverInterface
} from "type-graphql";

import { filter as _filter } from 'lodash'

import { GQLMoon } from "./GQLMoon";
import { Universe } from "./UniverseDAO";
import { GQLPlanet } from "./GQLPlanet";
import { GQLStar } from "./GQLStar";
import { Message } from "../messages/Message";
import { Messages } from "../messages/MessagesDAO";
import { InboxFilter } from "../messages/InboxFilter";
import { GQLStarship } from "../starship/GQLStarship";

export class RootResolver {
    @Query(of => [GQLMoon])
    moons() {
        return Universe.getMoons();
    }

    @Query(of => [GQLPlanet])
    planets() {
        return Universe.getPlanets();
    }

    @Query(returns => GQLStar, { nullable: true })
    async currentStar(): Promise<GQLStar | undefined> {
        return Universe.getCurrentStar();
    }

    @Query(returns => [GQLStar], { nullable: true })
    async stars(): Promise<GQLStar[] | undefined> {
        return Universe.getStars();
    }

    @Query(returns => GQLStarship)
    async starship() {
        return Universe.starship;
    }

    @Query(returns => GQLStar, { nullable: true })
    async star(@Arg("name") name: string): Promise<GQLStar | undefined> {
        return Universe.findStar(name);
    }

    @Query(returns => [Message], { nullable: true })
    async inbox(@Arg("filter", { nullable: true }) filter?: InboxFilter): Promise<Message[] | undefined> {
        if (filter === undefined) {
            return Messages.messages;
        }
        else {
            return _filter(Messages.messages, filter);
        }
    }
}