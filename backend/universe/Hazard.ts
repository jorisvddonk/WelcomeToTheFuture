import { registerEnumType } from "type-graphql";

export enum Hazard {
  NONE = "NONE",
  MINIMUM = "MINIMUM",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  SEVERE = "SEVERE",
  EXTREME = "EXTREME",
  INSTANT_DEATH = "INSTANT_DEATH"
}

registerEnumType(Hazard, {
  name: "Hazard"
})
