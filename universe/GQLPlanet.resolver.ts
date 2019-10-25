import {
  Query,
  Arg,
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface
} from "type-graphql";
import { Universe } from "./UniverseDAO";
import { GQLPlanet } from "./GQLPlanet";
import { GQLStar } from "./GQLStar";
import { GQLMoon } from "./GQLMoon";

@Resolver(of => GQLPlanet)
export class GQLPlanetResolver /* implements ResolverInterface<GQLPlanet>*/ {
  constructor() { }

  @FieldResolver(of => GQLStar, { nullable: true })
  star(@Root() planet: GQLPlanet) {
    return Universe.findStar(planet.star);
  }

  @FieldResolver(of => [GQLMoon], { nullable: true })
  moons(@Root() planet: GQLPlanet) {
    return Universe.getPlanetMoons(planet.name, planet.star);
  }
}
