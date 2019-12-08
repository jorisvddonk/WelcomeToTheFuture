import { ObjectType, Field } from "type-graphql";
import { Planet } from "./Planet";
import { Vector } from "../starship/Vector";
import { UnidentifiedObject } from "./UnidentifiedObject";
import { Moon } from "./Moon";

@ObjectType()
export class Star {
  @Field()
  name!: string;

  @Field()
  mass!: number;

  @Field(type => Vector)
  position!: Vector;

  @Field(type => [UnidentifiedObject])
  unidentifiedObjects: UnidentifiedObject[];

  bodies: (Planet | Moon)[]

  get planets(): Planet[] {
    return this.bodies.filter(x => x.__cls === Planet.__cls) as Planet[];
  }

  get moons(): Moon[] {
    return this.bodies.filter(x => x.__cls === Moon.__cls) as Moon[];
  }
}
