import {
  Resolver,
  FieldResolver,
  Root,
  Subscription,
  Arg,
  Args,
} from "type-graphql";
import { Star } from "./Star";
import { Universe } from "./UniverseDAO";
import { Planet } from "./Planet";
import { getRangeBetweenStars } from "./Utils";
import { filter as _filter } from 'lodash';
import { ObjectUnion } from "./UnionTypes";
import { PageFilter, GeneratePage } from "../lib/Page";
import { StarsPage } from "./pages/StarsPage";

@Resolver(of => Star)
export class StarResolver /* implements ResolverInterface<Star>*/ {
  constructor() { }

  @FieldResolver(of => [Planet])
  planets(@Root() star: Star, @Arg('type', { nullable: true }) type: string) {
    return star.planets.filter(x => {
      if (type !== undefined) {
        return x.type === type;
      }
      return true;
    });
  }

  @FieldResolver(of => [ObjectUnion])
  objects(@Root() star: Star) {
    return [].concat(star.bodies).concat(star.unidentifiedObjects);
  }

  @FieldResolver({ description: "Range between this star and the star our starship is currently in." })
  hyperspaceRange(@Root() star: Star): number {
    return getRangeBetweenStars(Universe.getCurrentStar(), star);
  }

  @FieldResolver(returns => StarsPage, {
    complexity: (v) => {
      if (v.args.take === undefined) {
        return 100 * v.childComplexity * 0.1; // estimate 100 stars
      }
      return v.args.take * v.childComplexity * 0.1;
    }
  })
  async nearbyStars(@Root() star: Star, @Args() filter: PageFilter, @Arg("maxRange", { nullable: true, description: "Range to search for other stars" }) maxRange: number): Promise<StarsPage> {
    const items = Universe.getStars().filter((x: Star) => {
      return x.name !== star.name
    }).filter((x: Star) => {
      if (maxRange !== undefined) {
        return getRangeBetweenStars(star, x) < maxRange;
      }
      return true;
    });
    const retval = await GeneratePage<Star>(items, filter, star => `${star.name}`);
    return retval;
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(@Root() payload: Star): Star {
    return payload;
  }
}
