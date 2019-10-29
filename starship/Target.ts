import { ObjectType, Field } from "type-graphql"
import { TargetType } from "./targets"
import objectRegistry, { ObjectID } from "./objectRegistry"
import Sylvester from "./sylvester-withmods"

@ObjectType()
export class Target {

  @Field(type => TargetType)
  public type: TargetType

  public tgt: ObjectID | Sylvester.Vector | TargetType.LOST

  constructor(
    type: TargetType,
    target: ObjectID | Sylvester.Vector | TargetType.LOST
  ) {
    this.tgt = target
    this.type = type
  }

  public getGameObject() {
    if (this.type === TargetType.GAMEOBJECT || this.type === TargetType.SHIP) {
      // ObjectID
      return objectRegistry.get(this.tgt) || TargetType.LOST
    } else {
      return new Error('Not a gameobject target!')
    }
  }

  public getTargetPosition() {
    if (this.type === TargetType.GAMEOBJECT || this.type === TargetType.SHIP) {
      // ObjectID
      const obj = this.getGameObject()
      if (obj !== TargetType.LOST) {
        return this.getGameObject().positionVec
      } else {
        return obj
      }
    } else if (this.tgt instanceof Sylvester.Vector) {
      return this.tgt
    } else if (this.type === TargetType.LOST) {
      return this.type
    } else {
      throw new Error('???')
    }
  }
}