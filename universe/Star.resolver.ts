import {
  Resolver,
  FieldResolver,
  Root,
  Subscription,
  Arg,
} from "type-graphql";
import { Star } from "./Star";
import { Universe } from "./UniverseDAO";
import { Planet } from "./Planet";

@Resolver(of => Star)
export class StarResolver /* implements ResolverInterface<Star>*/ {
  constructor() { }

  @FieldResolver(of => [Planet])
  planets(@Root() star: Star, @Arg('type', { nullable: true }) type: string) {
    return Universe.getStarPlanets(star.name).filter(x => {
      if (type !== undefined) {
        return x.type === type;
      }
      return true;
    });
  }

  @FieldResolver()
  range(@Root() star: Star): number {
    const p1 = Universe.getCurrentStar().position;
    const p2 = star.position;
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(@Root() payload: Star): Star {
    return payload;
  }
}
