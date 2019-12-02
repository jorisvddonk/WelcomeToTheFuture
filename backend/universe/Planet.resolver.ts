import {
  Query,
  Arg,
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface
} from "type-graphql";
import { Universe } from "./UniverseDAO";
import { Planet } from "./Planet";
import { Star } from "./Star";
import { Moon } from "./Moon";
import { Hazard } from "./Hazard";
import { Hazards } from "./Hazards";

@Resolver(of => Planet)
export class PlanetResolver /* implements ResolverInterface<Planet>*/ {
  constructor() { }

  @FieldResolver(of => Star, { nullable: true })
  star(@Root() planet: Planet) {
    return Universe.findStar(planet.star);
  }

  @FieldResolver(of => [Moon], { nullable: true })
  moons(@Root() planet: Planet) {
    return Universe.getPlanetMoons(planet);
  }

  @FieldResolver(of => Hazards, { nullable: true })
  hazards(@Root() planet: Planet) {
    return {
      bio: planet.bioHazard,
      tectonics: planet.tectonicsHazard,
      weather: planet.weatherHazard,
      thermal: planet.thermalHazard
    }
  }
}
