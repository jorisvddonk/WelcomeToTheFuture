import { TargetType, TaskType } from './targets'
import Sylvester from './sylvester-withmods'
import { GQLStarship, ThrustVector } from './GQLStarship';
import PIDController from './pidcontroller';
import Mymath from './mymath';

const OFFSET_ALLOWED = 0.0872664626 // 5 degrees
const OFFSET_ALLOWED_BACKWARDS = 0.436332313 // 25 degrees
export class Autopilot {
  public controllers: any
  public state: any
  private ship: GQLStarship;
  constructor(ship, options) {
    this.ship = ship;
    this.state = {};
    this.controllers = {};
    this.controllers.posXPID = new PIDController(
      -0.45,
      -0.0,
      -80,
      -10,
      10,
      -10,
      10
    )
    this.controllers.posYPID = new PIDController(
      -0.45,
      -0.0,
      -80,
      -10,
      10,
      -10,
      10
    )
  }


  public getTarget() {
    return this.ship.getTarget();
  }

  public getTask() {
    return this.ship.getTask();
  }

  public tick() {
    const task = this.getTask()
    const target = this.getTarget()

    const dispatchCompleteEvent = () => {
      this.ship.eventEmitter.emit('autopilot_Complete', { task })
    }

    if (
      task.type === TaskType.IDLE ||
      (target && target.type === TargetType.LOST)
    ) {
      return
    }

    if (task.type === TaskType.HALT) {
      // brake!
      this.brake(dispatchCompleteEvent)
      return
    }

    if (task.type === TaskType.MANUAL) {
      if (task.arg.desiredAngle !== undefined) {
        const d = task.arg.desiredAngle * 0.0174533;
        this.ship.rotate(this.ship.rotationVec.angleTo(new Sylvester.Vector([Math.sin(d), -Math.cos(d)])));
      }
      if (task.arg.thrusting === true) {
        this.ship.thrust(1);
      }
      return;
    }

    const targetpos = target.getTargetPosition()
    if (targetpos === TargetType.LOST) {
      return // target lost!
    }

    if (
      task.type === TaskType.ATTACK ||
      task.type === TaskType.MOVE ||
      task.type === TaskType.FOLLOW
    ) {
      this.moveTo(targetpos)
      // Check if we can fire
      if (task.type === TaskType.ATTACK) {
        this.ship.maybeFire()
      }

      // Check if we need to call callback
      if (
        task.type === TaskType.MOVE &&
        targetpos.subtract(this.ship.positionVec).modulus() < 50 &&
        this.ship.movementVec.modulus() < ThrustVector.modulus()) {
        this.ship.movementVec = new Sylvester.Vector([0, 0]);
        dispatchCompleteEvent()
      }
    }
  }

  private moveTo(targetpos: Sylvester.Vector) {
    // Update PID controllers; posXPID and posYPID
    const pos_vec_error = targetpos.subtract(this.ship.positionVec)
    const x_error = pos_vec_error.e(1)
    const y_error = pos_vec_error.e(2)
    this.controllers.posXPID.error = x_error
    this.controllers.posYPID.error = y_error
    const x_thrust = -this.controllers.posXPID.step()
    const y_thrust = -this.controllers.posYPID.step()

    // THRUSTING AND ROTATING
    /* THRUSTING CONTROLS */
    const thrust_vec = new Sylvester.Vector([x_thrust, y_thrust])
    let sign = 1
    let thrust_angle = this.ship.rotationVec.angleTo(thrust_vec)

    // If we have a large thrust vector (large error):
    if (thrust_vec.modulus() > 0) {
      // Turn towards x_thrust/y_thrust
      if (!isNaN(thrust_angle)) {
        if (
          thrust_angle < Math.PI - OFFSET_ALLOWED_BACKWARDS &&
          thrust_angle > -Math.PI + OFFSET_ALLOWED_BACKWARDS
        ) {
          this.ship.rotate(thrust_angle)
        } else {
          sign = -1
          if (thrust_angle > 0) {
            thrust_angle = -(Math.PI - thrust_angle)
          } else if (thrust_angle < 0) {
            thrust_angle = -(-Math.PI + thrust_angle)
          }
          this.ship.rotate(thrust_angle)
        }
      }

      // Thrust if we're aligned correctly;
      if (thrust_angle < OFFSET_ALLOWED && thrust_angle > -OFFSET_ALLOWED) {
        const actual_thrust = Mymath.clampThrust(
          thrust_vec.modulus() * sign * 500
        )
        this.state.lthrust = actual_thrust
        this.ship.thrust(actual_thrust) // todo lower/max thrust?
      }
    } else {
      // If we have a small thrust vector, let's just point towards the enemy ship..
      // this.ship.rotate(rot); // ?? todo re-add?
    }

    // store state/data for gfx stuff
    this.state.x_thrust = x_thrust
    this.state.y_thrust = y_thrust
  }

  private brake(onComplete) {
    // rotate towards movement vector's opposite
    const thrust_vec = this.ship.movementVec.rotate(
      Math.PI,
      new Sylvester.Vector([0, 0])
    )
    this.ship.rotate(thrust_vec)

    // thrust!
    const thrust_angle = this.ship.rotationVec.angleTo(thrust_vec)
    if (thrust_angle < OFFSET_ALLOWED && thrust_angle > -OFFSET_ALLOWED) {
      const act_thrust = Mymath.clampThrust(thrust_vec.modulus() * 500)
      this.state.lthrust = act_thrust
      this.ship.thrust(act_thrust)
    }

    // Check if we need to call callback
    if (this.ship.movementVec.modulus() < ThrustVector.modulus()) {
      this.ship.movementVec = new Sylvester.Vector([0, 0]);
      onComplete()
    }
  }
}
