import { Field, InterfaceType } from "type-graphql";
import { Vector } from "../starship/Vector";

@InterfaceType()
export abstract class Locatable {
  @Field(type => Vector)
  position!: Vector;
}
