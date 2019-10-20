import { Query, Arg, Resolver, FieldResolver, Root } from "type-graphql";
import { GQLStarship } from "./GQLStarship";
import { Universe } from "../universe/UniverseDAO";

@Resolver(GQLStarship)
export class GQLStarshipResolver {
  constructor() {}

  @Query(returns => GQLStarship)
  async starship() {
    return Universe.starship;
  }
}
