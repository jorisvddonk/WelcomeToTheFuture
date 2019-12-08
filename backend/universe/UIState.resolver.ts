import {
  Resolver,
  Root,
  Subscription
} from "type-graphql";
import { filter as _filter } from 'lodash';
import { UIStateUpdate } from "../ui/UIStateUpdate";

@Resolver()
export class UIStateResolver {
  constructor() { }

  @Subscription({
    topics: ["uiStateUpdate"]
  })
  uiStateUpdate(@Root() payload: UIStateUpdate): UIStateUpdate {
    return payload;
  }
}
