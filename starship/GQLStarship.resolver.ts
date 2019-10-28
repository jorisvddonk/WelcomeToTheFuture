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
import { ManualControl } from "./ManualControl";
import { GQLStar } from "../universe/GQLStar";
import { createTask, TaskType } from "./targets";
import Sylvester from "./sylvester-withmods";
import { PositionControl } from "./PositionControl";

@Resolver(GQLStarship)
export class GQLStarshipResolver {
  constructor() { }

  @Subscription({
    topics: ["starshipUpdate"]
  })
  starshipUpdate(
    @Root() payload: GQLStarship
  ): GQLStarship {
    return payload;
  }

  @Mutation()
  manualControl(@Arg("data") controlDirective: ManualControl): GQLStarship {
    Universe.starship.setTask(createTask(TaskType.MANUAL, null, {
      desiredAngle: controlDirective.desiredAngle,
      thrusting: controlDirective.thrusting
    }))
    return Universe.starship;
  }

  @Mutation()
  moveTo(@Arg("x", { nullable: true }) x: number, @Arg("y", { nullable: true }) y: number, @Arg("planet", { nullable: true }) planet: string): GQLStarship {
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
    return Universe.starship;
  }

  @Mutation()
  halt(): GQLStarship {
    Universe.starship.setTask(createTask(TaskType.HALT, null));
    return Universe.starship;
  }
}
