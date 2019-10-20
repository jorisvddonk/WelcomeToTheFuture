import {
  Query,
  Arg,
  Resolver,
  FieldResolver,
  Root,
  Subscription
} from "type-graphql";
import { GQLStarship } from "./GQLStarship";
import { Universe } from "../universe/UniverseDAO";
import { CoordinateNotification } from "./CoordinateNotification";

@Resolver(GQLStarship)
export class GQLStarshipResolver {
  constructor() {}

  @Query(returns => GQLStarship)
  async starship() {
    return Universe.starship;
  }

  @Subscription({
    topics: ["spaceshipCoordinateUpdate"]
  })
  newNotification(
    @Root() payload: CoordinateNotification
  ): CoordinateNotification {
    return payload;
  }
}
