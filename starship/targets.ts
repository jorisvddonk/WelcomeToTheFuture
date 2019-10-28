import Sylvester from './sylvester-withmods'
import objectRegistry, { ObjectID } from './objectRegistry'
import { GQLStarship } from './GQLStarship';
import { GQLPlanet } from '../universe/GQLPlanet';

export enum TaskType {
  FOLLOW = 'FOLLOW',
  ATTACK = 'ATTACK',
  MOVE = 'MOVE',
  IDLE = 'IDLE',
  HALT = 'HALT',
  MANUAL = 'MANUAL'
}

export class Task {
  public target: Target
  public type: TaskType | null
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

// tslint:disable-next-line: max-classes-per-file
export class Target {
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
        !(target.getGameObject() instanceof GQLStarship)
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
  target: ObjectID | Sylvester.Vector | TargetType.LOST | GQLStarship | GQLPlanet
): Target | null {
  if (target instanceof GQLStarship) {
    return new Target(TargetType.SHIP, target.name)
  } else if (target instanceof GQLPlanet) {
    return new Target(TargetType.GAMEOBJECT, target.name)
  } else if (target instanceof Sylvester.Vector) {
    return new Target(TargetType.POSITION, target)
  } else if (target === TargetType.LOST) {
    return new Target(TargetType.LOST, TargetType.LOST)
  } else {
    throw new Error(`Unsupported target type; ${target}`)
  }
}
