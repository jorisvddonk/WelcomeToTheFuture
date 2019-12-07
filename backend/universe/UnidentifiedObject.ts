import { ObjectType, Field } from "type-graphql";
import { IObject } from "./interfaces/IObject";
import { Vector } from "../starship/Vector";
import { Locatable } from "./interfaces/Locatable";

@ObjectType({ implements: [Locatable] })
export class UnidentifiedObject implements IObject, Locatable {
  @Field(type => Vector)
  position: Vector

  @Field()
  scannerData: string

  @Field()
  angle: number

  get __cls() {
    return UnidentifiedObject.__cls;
  }

  static get __cls() {
    return "UNIDENTIFIEDOBJECT";
  }
}