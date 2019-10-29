import {
    Query,
    Arg,
} from "type-graphql";

import { filter as _filter } from 'lodash'

import { Moon } from "./Moon";
import { Universe } from "./UniverseDAO";
import { Planet } from "./Planet";
import { Star } from "./Star";
import { Message } from "../messages/Message";
import { Messages } from "../messages/MessagesDAO";
import { InboxFilter } from "../messages/InboxFilter";
import { Starship } from "../starship/Starship";
import { IStar } from "./IStar";

export class RootResolver {
    @Query(of => [Moon])
    moons() {
        return Universe.getMoons();
    }

    @Query(of => [Planet])
    planets() {
        return Universe.getPlanets();
    }

    @Query(returns => Star, { nullable: true })
    async currentStar(): Promise<Star | undefined> {
        return Universe.getCurrentStar();
    }

    @Query(returns => [Star], { nullable: true })
    async stars(@Arg("name", { nullable: true }) name: string, @Arg("maxRange", { nullable: true }) maxRange: number): Promise<Star[] | undefined> {
        const filter: any = {};
        if (name !== undefined) {
            filter.name = name;
        }
        return _filter(Universe.getStars(), filter).filter((x: IStar) => {
            if (maxRange !== undefined) {
                // TODO: use Star instead of IStar, and then use a getter function on Star?
                const p1 = Universe.getCurrentStar().position;
                const p2 = x.position;
                return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) < maxRange;
            }
            return true;
        });
    }

    @Query(returns => Starship)
    async starship() {
        return Universe.starship;
    }

    @Query(returns => Star, { nullable: true })
    async star(@Arg("name") name: string): Promise<Star | undefined> {
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