import {
  Query,
  Resolver,
  Root,
  Subscription,
  Mutation,
  Arg,
  FieldResolver
} from "type-graphql";
import { Starship } from "./GQLStarship";
import { Universe } from "../universe/UniverseDAO";
import { ManualControl } from "./ManualControl";
import { Star } from "../universe/GQLStar";
import { createTask, TaskType } from "./targets";
import Sylvester from "./sylvester-withmods";
import { PositionControl } from "./PositionControl";
import { Achievements } from "../Achievements/AchievementsDAO";
import { MutationResult, Status } from "./MutationResult";

@Resolver(Starship)
export class GQLStarshipResolver {
  constructor() { }

  @Subscription({
    topics: ["starshipUpdate"]
  })
  starshipUpdate(
    @Root() payload: Starship
  ): Starship {
    return payload;
  }

  @Mutation()
  manualControl(@Arg("data") controlDirective: ManualControl): MutationResult {
    Universe.starship.setTask(createTask(TaskType.MANUAL, null, {
      desiredAngle: controlDirective.desiredAngle,
      thrusting: controlDirective.thrusting
    }))
    return new MutationResult(Status.OK);
  }

  @Mutation()
  moveTo(@Arg("x", { nullable: true }) x: number, @Arg("y", { nullable: true }) y: number, @Arg("planet", { nullable: true }) planet: string): MutationResult {
    if (x !== undefined && y !== undefined) {
      Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([x, y])));
    } else if (planet !== undefined) {
      const foundPlanet = Universe.getPlanet(planet, Universe.getCurrentStar().name);
      if (foundPlanet) {
        Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([foundPlanet.position.x, foundPlanet.position.y])));
      } else {
        throw new Error("Planet not found in current solar system");
      }
    }
    return new MutationResult(Status.OK);
  }

  @Mutation()
  halt(): MutationResult {
    Universe.starship.setTask(createTask(TaskType.HALT, null));
    return new MutationResult(Status.OK);
  }

  @FieldResolver()
  name(
    @Root() starship: Starship): string {
    Achievements.unlock('name');
    return starship.name;
  }
}
