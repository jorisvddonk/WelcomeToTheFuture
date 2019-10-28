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

  @Query(returns => GQLStarship)
  async starship() {
    return Universe.starship;
  }

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
  moveTo(@Arg("position") position: PositionControl): GQLStarship {
    Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([position.x, position.y])));
    return Universe.starship;
  }

  @Mutation()
  halt(): GQLStarship {
    Universe.starship.setTask(createTask(TaskType.HALT, null));
    return Universe.starship;
  }
}
