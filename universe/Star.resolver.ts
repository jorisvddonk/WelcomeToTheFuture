import {
  Resolver,
  FieldResolver,
  Root,
  Subscription,
} from "type-graphql";
import { Star } from "./Star";
import { Universe } from "./UniverseDAO";
import { Planet } from "./Planet";

@Resolver(of => Star)
export class StarResolver /* implements ResolverInterface<Star>*/ {
  constructor() { }

  @FieldResolver(of => [Planet])
  planets(@Root() star: Star) {
    return Universe.getStarPlanets(star.name);
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(@Root() payload: Star): Star {
    return payload;
  }
}
