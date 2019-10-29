import {
  Resolver,
  Root,
  Subscription,
  FieldResolver
} from "type-graphql";
import { Starship } from "./Starship";

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
