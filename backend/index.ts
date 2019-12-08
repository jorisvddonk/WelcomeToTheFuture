import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import {
  simpleEstimator, getComplexity, fieldConfigEstimator
} from 'graphql-query-complexity';

import { StarshipResolver } from "./starship/Starship.resolver";
import { StarResolver } from "./universe/Star.resolver";
import { PlanetResolver } from "./universe/Planet.resolver";
import { PubSub } from "graphql-subscriptions";
import { Universe } from "./universe/UniverseDAO";
import { MessageResolver } from "./messages/Message.resolver";
import { RootResolver } from "./universe/Root.resolver";
import { AchievementResolver } from "./Achievements/Achievement.resolver";
import { Achievements } from "./Achievements/AchievementsDAO";
import { Achievement } from "./Achievements/Achievement";
import { MutationResolver } from "./universe/Mutation.resolver";
import { Message } from "./messages/Message";
import { Messages } from "./messages/MessagesDAO";
import { separateOperations } from "graphql";
import { isFunction } from "util";
import { UIStateResolver } from "./universe/UIState.resolver";
import { UIStateUpdate } from "./ui/UIStateUpdate";

const UPDATE_INTERVAL = (1000 / 60) * 3; // 3 frames @ 60fps

async function boot() {
  const pubsub = new PubSub();
  const schema = await buildSchema({
    resolvers: [RootResolver, MutationResolver, StarshipResolver, StarResolver, PlanetResolver, MessageResolver, AchievementResolver, UIStateResolver],
    emitSchemaFile: true,
    pubSub: pubsub
  });

  const server = new ApolloServer({
    schema,
    debug: false,
    subscriptions: {
      path: "/graphql"
    },
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              query: request.operationName
                ? separateOperations(document)[request.operationName]
                : document,
              variables: request.variables,
              estimators: [
                (args) => {
                  if (args.field.complexity !== undefined) {
                    if (isFunction(args.field.complexity)) {
                      return args.field.complexity(args);
                    } else {
                      return args.field.complexity;
                    }
                  }
                },
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            if (Universe.starship.queryBattery.canActivate(complexity)) {
              Universe.starship.queryBattery.activate(complexity);
            } else {
              throw new Error(
                `Too complicated query! ${complexity} > the current maximum (${Universe.starship.queryBattery.maxPower})! Please submit a simpler query or wait a few seconds...`,
              );
            }
          },
        }),
      },
    ]
  });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });

  setInterval(() => {
    const starship = Universe.starship;
    starship.tick(UPDATE_INTERVAL);
    pubsub.publish(
      "starshipUpdate",
      starship
    );
  }, UPDATE_INTERVAL);

  Universe.addStarUpdateListener(() => {
    pubsub.publish(
      "currentStar",
      Universe.getCurrentStar()
    );
    if (Universe.getCurrentStar().name === "Beta Giclas") {
      Messages.addMessage(new Message("?", { orig: "ᐊᑎᖅᐳᖅ ᓇᐃᑦᑐᖅ !!!", en: "Leave, intruder!" }, { orig: "ᐊᑎᖅᐳᖅ ᐊᖏᔪᖅ ᑭᑉᐸᓕᕗᖅ ᑲᔪᖅ ᐆᒪᔪᖅ. ᐃᓅᔪᖅ ᓱᑦᖃᐃᐳᖅ ᓇᐹᖅᑐᖃᕐᓂᖅ. ᓇᐃᑦᑐᖅ ᐸᒥᐅᓕᒑᕐᔪᒃ ᐊᓂᑦᑖ ᓇᑯᓪᓚᖅᐳᖅ ᐳᔭᓂᖅ ᓱᕐᖁᐃᑐᖅᐹ. ᐊᑎᖅᐳᖅ ᐱᔪᖕᓇᖅᑐᖅ ᓱᑦᖃᐃᐳᖅ ᓇᒧᑐᐃᓐᓇᖅ ᐃᓗᐊᓂ ᓯᓚ. ᐊᑎᖅᐳᖅ ᓂᕿᑐᐃᓐᓇᖅ ᒪᒫᖅ ᐱᓯᕚ. ᐹᖅᑎᓯᔪᖅ ᐊᓂᑦᑖ ᐊᐅᑦᓯᑐᖅᐳᖅ ᐊᐅᑦᓯᓇᖅᑐᖅ.", en: "HALT! You have intruded upon the territory of the Burvix! Our worlds may not be approached for ANY reason! LEAVE THIS SYSTEM IMMEDIATELY! Disobedience will be punished." }));
      setTimeout(() => {
        Messages.addMessage(new Message("Science Officer", { orig: "Alien contact established!" }, { orig: "We have established contact with an alien race, but their messages need to be translated to English! Use GraphQL field arguments to translate the message!" }));
      }, 10000)
    }
  });

  Universe.addLandedListener(() => {
    pubsub.publish(
      "uiStateUpdate",
      new UIStateUpdate("SURFACE")
    );
    setTimeout(() => {
      Achievements.unlock("land");
    }, 15000);
  });

  Messages.addMessageUpdateListener(() => {
    pubsub.publish(
      "inboxSub",
      Messages.getMessages()
    );
  });

  Achievements.addAchievementUnlockedListener((achievement: Achievement) => {
    if (achievement.silent === false) {
      pubsub.publish("achievementUnlocked", achievement);
    }
    if (!Achievements.isUnlocked('control_mastery') && Achievements.isUnlockedAll(['thrust', 'turn', 'autopilot', 'halt'])) {
      Achievements.unlock('control_mastery');
      Messages.addMessage(new Message('UFN High Command', { orig: 'Your next objective' }, { orig: 'Now that you know how to move the starship, you can jump to a nearby star using the `hyperspaceJump` GraphQL Mutation!' }))
    }
    if (achievement.id === 'get_name') {
      setTimeout(() => {
        Messages.addMessage(new Message("United Federation of Nations High Command", { orig: "How to pilot the starship" }, { orig: "Use the `setThrust`, `setDesiredAngle`, `halt` and `moveTo` GraphQL Mutations to pilot the ship! Use `markAllAsRead` to mark this message as read." }));
      }, 5000);
    }
  })
}

boot();
