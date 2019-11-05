import { createUnionType } from "type-graphql";
import { Planet } from "./Planet";
import { Moon } from "./Moon";
import { UnidentifiedObject } from "./UnidentifiedObject";

export const ObjectUnion = createUnionType({
  name: "Object",
  types: () => [Planet, Moon, UnidentifiedObject],
  resolveType: value => {
    if (value.__cls === Moon.__cls) {
      return Moon;
    }
    if (value.__cls === Planet.__cls) {
      return Planet;
    }
    if (value.__cls === UnidentifiedObject.__cls) {
      return UnidentifiedObject;
    }
    return undefined;
  },
});