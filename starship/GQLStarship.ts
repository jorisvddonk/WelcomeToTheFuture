import { ObjectType, Field } from "type-graphql";
import { IPosRot } from "../universe/IPosRot";
import { Vector } from "./Vector";
import { Autopilot } from "./autopilot";
import objectRegistry, { ObjectID } from "./objectRegistry";
import { EventEmitter } from "events";
import { Task, createTask, TaskType } from "./targets";
import Sylvester from "./sylvester-withmods";
import Mymath from "./mymath";

@ObjectType()
export class GQLStarship implements IPosRot {
  private autopilot: Autopilot;
  public _objid: ObjectID;
  public rotationVec: Sylvester.Vector;
  public positionVec: Sylvester.Vector;
  public movementVec: Sylvester.Vector;
  private lastTickActions: {
    thrusting: boolean;
  } = {
      thrusting: false
    };
  eventEmitter: EventEmitter;

  constructor(name?: string) {
    this.autopilot = new Autopilot(this, {});
    this.positionVec = new Sylvester.Vector([0, 0]);
    this.task = createTask(TaskType.MOVE, new Sylvester.Vector([1000, 1000]));
    this.rotationVec = new Sylvester.Vector([0, 1]);
    this.movementVec = new Sylvester.Vector([0, 0]);
    this.hyperjumping = false;
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on("autopilot_Complete", () => {
      this.setTask(createTask(TaskType.IDLE, null));
    });

    if (name !== undefined) {
      this.name = name;
    } else {
      this.name = "Starship McStarshipface";
    }

    objectRegistry.add(this);
  }

  @Field()
  name!: string;

  @Field()
  hyperjumping: boolean;

  @Field(type => Task)
  task: Task;

  getTask() {
    return this.task;
  }

  setTask(task: Task) {
    this.task = task;
  }

  getTarget() {
    return this.task.target;
  }

  maybeFire() {
    // todo
  }

  public thrust(multiply: number) {
    if (multiply > 0) {
      this.lastTickActions.thrusting = true;
    }
    multiply = Mymath.clamp(multiply, -1, 1);
    this.movementVec = this.movementVec.add(
      ThrustVector.rotate(
        ThrustVector.angleTo(this.rotationVec),
        new Sylvester.Vector([0, 0])
      ).multiply(multiply)
    );
  }

  public rotate(amount: number | Sylvester.Vector) {
    // amount is a local-vector pointing towards an angle to rate to
    // or a rotation to point to specified in radians
    if (amount instanceof Sylvester.Vector) {
      amount = this.rotationVec.angleTo(amount);
    }
    this.rotationVec = this.rotationVec
      .rotate(Mymath.clampRot(amount), new Sylvester.Vector([0, 0]))
      .toUnitVector();
  }

  tick(msec: number) {
    this.lastTickActions.thrusting = false;
    this.autopilot.tick();
    this.positionVec = this.positionVec.add(
      this.movementVec.multiply(1000 / msec)
    );
    this.capMovement();
  }

  private capMovement() {
    if (this.movementVec.modulus() > MaxSpeedVector.modulus()) {
      this.movementVec = this.movementVec
        .toUnitVector()
        .multiply(MaxSpeedVector.modulus());
    }
  }

  @Field()
  get position(): Vector {
    return {
      x: this.positionVec.e(1),
      y: this.positionVec.e(2)
    };
  }

  @Field()
  get velocity(): Vector {
    return {
      x: this.movementVec.e(1),
      y: this.movementVec.e(2)
    };
  }

  @Field()
  get angle(): number {
    return (
      new Sylvester.Vector([1, 0]).angleTo(this.rotationVec) * 57.2957795 + 90
    );
  }

  @Field()
  get thrusting(): boolean {
    return this.lastTickActions.thrusting;
  }
}

export const ThrustVector = new Sylvester.Vector([0.004, 0]);
export const MaxSpeedVector = new Sylvester.Vector([0.5, 0]);
