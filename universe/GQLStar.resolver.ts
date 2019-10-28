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
import { GQLStar } from "./GQLStar";
import { Universe } from "./UniverseDAO";
import { GQLPlanet } from "./GQLPlanet";

@Resolver(of => GQLStar)
export class GQLStarResolver /* implements ResolverInterface<GQLStar>*/ {
  constructor() { }

  @FieldResolver(of => [GQLPlanet])
  planets(@Root() star: GQLStar) {
    return Universe.getStarPlanets(star.name);
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(
    @Root() payload: GQLStar
  ): GQLStar {
    return payload;
  }

  @Mutation()
  hyperspaceJump(@Arg("star") starname: string): GQLStar {
    Universe.hyperspaceJump(starname);
    return Universe.getCurrentStar();
  }
}
