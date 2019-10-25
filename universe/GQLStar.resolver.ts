import {
  Query,
  Arg,
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface
} from "type-graphql";
import { GQLStar } from "./GQLStar";
import { Universe } from "./UniverseDAO";
import { GQLPlanet } from "./GQLPlanet";

@Resolver(of => GQLStar)
export class GQLStarResolver /* implements ResolverInterface<GQLStar>*/ {
  constructor() { }

  @Query(returns => GQLStar, { nullable: true })
  async star(@Arg("name") name: string): Promise<GQLStar | undefined> {
    return Universe.findStar(name);
  }

  @Query(returns => [GQLStar], { nullable: true })
  async stars(): Promise<GQLStar[] | undefined> {
    return Universe.getStars();
  }

  @FieldResolver(of => [GQLPlanet])
  planets(@Root() star: GQLStar) {
    return Universe.getStarPlanets(star.name);
  }
}
