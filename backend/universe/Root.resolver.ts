import {
    Query,
    Arg,
    Args,
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
import { StarsPage } from "./pages/StarsPage";
import { PlanetsPage } from "./pages/PlanetsPage";
import { PageFilter, GeneratePage } from "../lib/Page";

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

    @Query(returns => StarsPage, {
        complexity: (v) => {
            let estimatedResults = 100;
            if (v.args.take !== undefined) {
                estimatedResults = v.args.take;
            }
            if (v.args.nameSearch !== undefined) {
                estimatedResults = 4;
            }
            if (v.args.name !== undefined) {
                estimatedResults = 1;
            }
            return estimatedResults * v.childComplexity * 0.1;
        }
    })
    async stars(@Arg("name", { nullable: true }) name: string, @Arg("nameSearch", { nullable: true }) nameSearch: string, @Args() filter: PageFilter): Promise<StarsPage> {
        const searchFilter: any = {};
        if (name !== undefined) {
            searchFilter.name = name;
        }
        const items = _filter(Universe.getStars(), searchFilter).filter((star: Star) => {
            if (nameSearch !== undefined) {
                return star.name.toLowerCase().indexOf(nameSearch.toLowerCase()) > -1;
            }
            return true;
        });
        const retval = await GeneratePage<Star>(items, filter, star => `${star.name}`);
        return retval;
    }

    @Query(returns => PlanetsPage)
    async pagedPlanets(@Args() filter: PageFilter): Promise<PlanetsPage> {
        const items = Universe.getPlanets();
        const retval = await GeneratePage<Planet>(items, filter, planet => `${planet.star}_${planet.name}`);
        return retval;
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

    @Query(returns => String)
    hello(): String {
        return 'world';
    }
}