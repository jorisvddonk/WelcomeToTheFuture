import {
  Resolver,
  Root,
  Subscription,
  FieldResolver
} from "type-graphql";
import { Starship } from "./Starship";
import { Achievements } from "../Achievements/AchievementsDAO";

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
    Achievements.unlock('get_name');
    return starship.name;
  }

}
