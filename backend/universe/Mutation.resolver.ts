import { Mutation, Arg } from "type-graphql";
import { MutationResult, Status } from "../starship/MutationResult";
import { Universe } from "./UniverseDAO";
import Sylvester from "../starship/sylvester-withmods";
import { createTask, TaskType } from "../starship/targets";
import { Messages } from "../messages/MessagesDAO";
import { Achievements } from "../Achievements/AchievementsDAO";
import { Message } from "../messages/Message";

export class MutationResolver {

  @Mutation()
  hyperspaceJump(@Arg("star") starname: string): MutationResult {
    if (Universe.findStar(starname) === undefined) {
      return new MutationResult(Status.ERROR, "Star not found");
    }
    Universe.starship.hyperjumping = true;
    let i = 0;
    const interv = setInterval(() => {
      Universe.starship.movementVec = new Sylvester.Vector([
        Universe.starship.rotationVec.e(1) * i,
        Universe.starship.rotationVec.e(2) * i
      ]);
      i += 33;
      if (i > 2000) {
        let firstHyperspace = Achievements.unlock("hyperspace");
        if (firstHyperspace) {
          Messages.addMessage(new Message("United Federation of Nations High Command", { orig: "Your next mission objective" }, { orig: "Congratulations on your successful hyperspace jump! You must now find a potentially habitable world around you, and go there! Our scientists say that there might be a suitable world around Beta Giclas." }));
        }

        if (starname !== "Beta Giclas" && Universe.getCurrentStar().name === "Beta Giclas") {
          Achievements.unlock("narrow_escape");
        }

        clearInterval(interv);
        Universe.hyperspaceJump(starname);
        Universe.starship.movementVec = new Sylvester.Vector([0, 0]);
        Universe.starship.positionVec = new Sylvester.Vector([200, 0]).rotate(Math.PI * 2 * Math.random(), new Sylvester.Vector([0, 0]));
        Universe.starship.hyperjumping = false;
      }
    }, 100);
    Universe.starship.setTask(createTask(TaskType.IDLE, null));
    return new MutationResult(Status.OK, `Jumping to ${starname}`);
  }

  @Mutation()
  markAsRead(@Arg("id") id: string): Message {
    Achievements.unlock("read_inbox");
    Messages.markAsRead(id);
    return Messages.get(id);
  }

  @Mutation(type => Status)
  markAllAsRead(): Status {
    Messages.markAllAsRead();
    return Status.OK;
  }

  @Mutation()
  rename(@Arg("name") name: string): MutationResult {
    Universe.starship.name = name;
    Achievements.unlock('rename');
    return new MutationResult(Status.OK, `Ship renamed to '${name}'`);
  }

  @Mutation()
  setThrust(@Arg("thrust") thrust: number): MutationResult {
    Universe.starship.setTask(createTask(TaskType.MANUAL, null, {
      desiredAngle: Universe.starship.task.type === TaskType.MANUAL ? Universe.starship.task.arg.desiredAngle : undefined,
      thrust: thrust
    }));
    Achievements.unlock('thrust');
    return new MutationResult(Status.OK, `Thrust set to ${thrust.toFixed(2)}`);
  }

  @Mutation()
  setDesiredAngle(@Arg("angle") angle: number): MutationResult {
    Universe.starship.setTask(createTask(TaskType.MANUAL, null, {
      desiredAngle: angle,
      thrust: Universe.starship.task.type === TaskType.MANUAL ? Universe.starship.task.arg.thrust : undefined
    }));
    Achievements.unlock('turn');
    return new MutationResult(Status.OK, `Angle set to ${angle.toFixed(2)}`);
  }

  @Mutation()
  moveTo(@Arg("x", { nullable: true }) x: number, @Arg("y", { nullable: true }) y: number, @Arg("planet", { nullable: true }) planet: string): MutationResult {
    let msg = undefined;
    if (x !== undefined && y !== undefined) {
      Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([x, y])));
      msg = `Moving to x=${x}, y=${y}`;
    } else if (planet !== undefined) {
      const foundPlanet = Universe.getPlanet(planet, Universe.getCurrentStar().name);
      if (foundPlanet) {
        Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([foundPlanet.position.x, foundPlanet.position.y])));
        msg = `Moving to x=${foundPlanet.position.x.toFixed(2)}, y=${foundPlanet.position.y.toFixed(2)}`;
      } else {
        throw new Error("Planet not found in current solar system");
      }
    }
    Achievements.unlock('autopilot');
    return new MutationResult(Status.OK, msg);
  }

  @Mutation()
  halt(): MutationResult {
    Universe.starship.setTask(createTask(TaskType.HALT, null));
    Achievements.unlock('halt');
    return new MutationResult(Status.OK, 'Halting...');
  }

  @Mutation()
  land(): MutationResult {
    if (Universe.canLand) {
      Universe.land();
      return new MutationResult(Status.OK, 'Landing...');
    } else {
      return new MutationResult(Status.ERROR, "Not nearby a planet you can land on!");
    }
  }
}