import Sylvester from './sylvester-withmods'
import objectRegistry, { ObjectID } from './objectRegistry'
import { Starship } from './GQLStarship';
import { Planet } from '../universe/GQLPlanet';
import { ObjectType, Field, registerEnumType } from 'type-graphql';
import { Target } from './Target';

export enum TaskType {
  FOLLOW = 'FOLLOW',
  ATTACK = 'ATTACK',
  MOVE = 'MOVE',
  IDLE = 'IDLE',
  HALT = 'HALT',
  MANUAL = 'MANUAL'
}

registerEnumType(TaskType, {
  name: "TaskType"
})

@ObjectType()
export class Task {
  @Field(type => Target, { nullable: true })
  target: Target

  @Field(type => TaskType)
  type: TaskType | null

  public arg: any

  constructor(type: TaskType, target: Target | null, arg?: any) {
    if (!(target instanceof Target) && target !== null) {
      target = createTarget(target)
    }
    this.type = type
    this.target = target
    this.arg = arg;
  }
}

export enum TargetType {
  SHIP = 'SHIP',
  GAMEOBJECT = 'GAMEOBJECT',
  POSITION = 'POSITION',
  LOST = 'LOST', // special
}

registerEnumType(TargetType, {
  name: "TargetType"
})

export function createTask(taskType: TaskType, target?: Target, arg?: any) {
  switch (taskType) {
    case TaskType.HALT:
      return new Task(taskType, null)
    case TaskType.IDLE:
      return new Task(taskType, null)
    case TaskType.MOVE:
      // TODO: check target for supportedness.
      return new Task(taskType, target)
    case TaskType.FOLLOW:
      // TODO: check target for supportedness.
      return new Task(taskType, target)
    case TaskType.MANUAL:
      return new Task(taskType, null, arg)
    case TaskType.ATTACK:
      if (
        target instanceof Target &&
        !(target.getGameObject() instanceof Starship)
      ) {
        throw new Error(
          'Unsupported target gameobject type for TaskType ATTACK!'
        )
      }
      return new Task(TaskType.ATTACK, target)
    default:
      throw new Error('Unsupported task type!')
  }
}

export function createTarget(
  target: ObjectID | Sylvester.Vector | TargetType.LOST | Starship | Planet
): Target | null {
  if (target instanceof Starship) {
    return new Target(TargetType.SHIP, target.name)
  } else if (target instanceof Planet) {
    return new Target(TargetType.GAMEOBJECT, target.name)
  } else if (target instanceof Sylvester.Vector) {
    return new Target(TargetType.POSITION, target)
  } else if (target === TargetType.LOST) {
    return new Target(TargetType.LOST, TargetType.LOST)
  } else {
    throw new Error(`Unsupported target type; ${target}`)
  }
}
