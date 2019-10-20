import { Query, Arg, Resolver, FieldResolver, Root } from "type-graphql";
import { GQLStarship } from "./GQLStarship";

@Resolver(GQLStarship)
export class GQLStarshipResolver {
  constructor() {}

  @Query(returns => GQLStarship)
  async starship() {
    return null; // todo
  }
}
