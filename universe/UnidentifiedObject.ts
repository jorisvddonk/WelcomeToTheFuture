import { ObjectType, Field } from "type-graphql";
import { IObject } from "./IObject";
import { Vector } from "../starship/Vector";

@ObjectType()
export class UnidentifiedObject implements IObject {
  @Field(type => Vector)
  position: Vector

  @Field()
  scannerData: string

  @Field()
  angle: number
}