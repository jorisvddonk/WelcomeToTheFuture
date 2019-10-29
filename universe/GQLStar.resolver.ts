import {
  Query,
  Arg,
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface,
  Subscription,
  Mutation
} from "type-graphql";
import { GQLStar } from "./GQLStar";
import { Universe } from "./UniverseDAO";
import { GQLPlanet } from "./GQLPlanet";
import { createTask, TaskType } from "../starship/targets";
import Sylvester from "../starship/sylvester-withmods";

@Resolver(of => GQLStar)
export class GQLStarResolver /* implements ResolverInterface<GQLStar>*/ {
  constructor() {}

  @FieldResolver(of => [GQLPlanet])
  planets(@Root() star: GQLStar) {
    return Universe.getStarPlanets(star.name);
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(@Root() payload: GQLStar): GQLStar {
    return payload;
  }

  @Mutation()
  hyperspaceJump(@Arg("star") starname: string): GQLStar {
    Universe.starship.hyperjumping = true;
    let i = 0;
    const interv = setInterval(() => {
      Universe.starship.movementVec = new Sylvester.Vector([
        Universe.starship.rotationVec.e(1) * i,
        Universe.starship.rotationVec.e(2) * i
      ]);
      i += 0.25;
      if (i > 10) {
        clearInterval(interv);
        Universe.hyperspaceJump(starname);
        Universe.starship.movementVec = new Sylvester.Vector([0, 0]);
        Universe.starship.positionVec = new Sylvester.Vector([0, 0]);
        Universe.starship.hyperjumping = false;
      }
    }, 100);
    Universe.starship.setTask(createTask(TaskType.IDLE, null));
    return Universe.getCurrentStar();
  }
}
