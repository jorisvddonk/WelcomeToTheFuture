import { Mutation, Arg } from "type-graphql";
import { MutationResult, Status } from "../starship/MutationResult";
import { Universe } from "./UniverseDAO";
import Sylvester from "../starship/sylvester-withmods";
import { createTask, TaskType } from "../starship/targets";
import { Messages } from "../messages/MessagesDAO";
import { Achievements } from "../Achievements/AchievementsDAO";
import { ManualControl } from "../starship/ManualControl";
import { Message } from "../messages/Message";

export class MutationResolver {

  @Mutation()
  hyperspaceJump(@Arg("star") starname: string): MutationResult {
    Universe.starship.hyperjumping = true;
    let i = 0;
    const interv = setInterval(() => {
      Universe.starship.movementVec = new Sylvester.Vector([
        Universe.starship.rotationVec.e(1) * i,
        Universe.starship.rotationVec.e(2) * i
      ]);
      i += 0.25;
      if (i > 10) {
        Achievements.unlock("hyperspace");

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
    return new MutationResult(Status.OK);
  }

  @Mutation()
  markAsRead(@Arg("id") id: string): Message {
    Achievements.unlock("read_inbox");
    Messages.markAsRead(id);
    return Messages.get(id);
  }

  @Mutation()
  rename(@Arg("name") name: string): MutationResult {
    Universe.starship.name = name;
    Achievements.unlock('rename');
    return new MutationResult(Status.OK);
  }

  @Mutation()
  manualControl(@Arg("data") controlDirective: ManualControl): MutationResult {
    Universe.starship.setTask(createTask(TaskType.MANUAL, null, {
      desiredAngle: controlDirective.desiredAngle,
      thrusting: controlDirective.thrusting
    }))
    return new MutationResult(Status.OK);
  }

  @Mutation()
  moveTo(@Arg("x", { nullable: true }) x: number, @Arg("y", { nullable: true }) y: number, @Arg("planet", { nullable: true }) planet: string): MutationResult {
    if (x !== undefined && y !== undefined) {
      Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([x, y])));
    } else if (planet !== undefined) {
      const foundPlanet = Universe.getPlanet(planet, Universe.getCurrentStar().name);
      if (foundPlanet) {
        Universe.starship.setTask(createTask(TaskType.MOVE, new Sylvester.Vector([foundPlanet.position.x, foundPlanet.position.y])));
      } else {
        throw new Error("Planet not found in current solar system");
      }
    }
    return new MutationResult(Status.OK);
  }

  @Mutation()
  halt(): MutationResult {
    Universe.starship.setTask(createTask(TaskType.HALT, null));
    return new MutationResult(Status.OK);
  }
}