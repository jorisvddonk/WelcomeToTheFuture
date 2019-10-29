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
import { getRangeBetweenStars } from "./Utils";
import { filter as _filter } from 'lodash';

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

  @FieldResolver({ description: "Range between this star and the star our starship is currently in." })
  hyperspaceRange(@Root() star: Star): number {
    return getRangeBetweenStars(Universe.getCurrentStar(), star);
  }

  @FieldResolver(returns => [Star])
  nearbyStars(@Arg("maxRange", { nullable: true, description: "Range to search for other stars" }) maxRange: number): Star[] {
    return Universe.getStars().filter((x: Star) => {
      if (maxRange !== undefined) {
        return getRangeBetweenStars(Universe.getCurrentStar(), x) < maxRange;
      }
      return true;
    });
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(@Root() payload: Star): Star {
    return payload;
  }
}
