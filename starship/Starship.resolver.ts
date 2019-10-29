import {
  Query,
  Resolver,
  Root,
  Subscription,
  Mutation,
  Arg,
  FieldResolver
} from "type-graphql";
import { Starship } from "./Starship";
import { Universe } from "../universe/UniverseDAO";
import { ManualControl } from "./ManualControl";
import { Star } from "../universe/Star";
import { createTask, TaskType } from "./targets";
import Sylvester from "./sylvester-withmods";
import { PositionControl } from "./PositionControl";
import { Achievements } from "../Achievements/AchievementsDAO";
import { MutationResult, Status } from "./MutationResult";

@Resolver(Starship)
export class StarshipResolver {
  constructor() { }

  @Subscription({
    topics: ["starshipUpdate"]
  })
  starshipUpdate(
    @Root() payload: Starship
  ): Starship {
    return payload;
  }

  @FieldResolver()
  name(
    @Root() starship: Starship): string {
    return starship.name;
  }

}
