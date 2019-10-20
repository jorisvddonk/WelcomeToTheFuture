import {
  Query,
  Resolver,
  Root,
  Subscription,
  Mutation,
  Arg
} from "type-graphql";
import { GQLStarship } from "./GQLStarship";
import { Universe } from "../universe/UniverseDAO";
import { CoordinateNotification } from "./CoordinateNotification";
import { ManualControl } from "./ManualControl";

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

  @Mutation()
  manualControl(@Arg("data") controlDirective: ManualControl): GQLStarship {
    if (controlDirective.thrusting !== undefined) {
      Universe.starship.thrusting = controlDirective.thrusting;
    }
    if (controlDirective.desiredAngle !== undefined) {
      Universe.starship.desiredAngle = controlDirective.desiredAngle;
    }
    return Universe.starship;
  }
}
