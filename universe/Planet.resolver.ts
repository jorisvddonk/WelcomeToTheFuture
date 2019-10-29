import {
  Query,
  Arg,
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface
} from "type-graphql";
import { Universe } from "./UniverseDAO";
import { Planet } from "./GQLPlanet";
import { Star } from "./GQLStar";
import { Moon } from "./GQLMoon";

@Resolver(of => Planet)
export class GQLPlanetResolver /* implements ResolverInterface<GQLPlanet>*/ {
  constructor() { }

  @FieldResolver(of => Star, { nullable: true })
  star(@Root() planet: Planet) {
    return Universe.findStar(planet.star);
  }

  @FieldResolver(of => [Moon], { nullable: true })
  moons(@Root() planet: Planet) {
    return Universe.getPlanetMoons(planet.name, planet.star);
  }
}
