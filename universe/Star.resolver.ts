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
import { Star } from "./Star";
import { Universe } from "./UniverseDAO";
import { Planet } from "./Planet";
import { createTask, TaskType } from "../starship/targets";
import Sylvester from "../starship/sylvester-withmods";
import { MutationResult, Status } from "../starship/MutationResult";

@Resolver(of => Star)
export class StarResolver /* implements ResolverInterface<Star>*/ {
  constructor() { }

  @FieldResolver(of => [Planet])
  planets(@Root() star: Star) {
    return Universe.getStarPlanets(star.name);
  }

  @Subscription({
    topics: ["starUpdate"]
  })
  starUpdate(@Root() payload: Star): Star {
    return payload;
  }
}
