import { registerEnumType } from "type-graphql";

export enum Translation {
  ENGLISH = "ENGLISH",
  DO_NOT_TRANSLATE = "DO_NOT_TRANSLATE"
}

registerEnumType(Translation, {
  name: "Translation"
})
