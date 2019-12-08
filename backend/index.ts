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

const UPDATE_INTERVAL = (1000 / 60) * 3; // 3 frames @ 60fps

async function boot() {
  const pubsub = new PubSub();
  const schema = await buildSchema({
    resolvers: [RootResolver, MutationResolver, StarshipResolver, StarResolver, PlanetResolver, MessageResolver, AchievementResolver],
    emitSchemaFile: true,
    pubSub: pubsub
  });

  const server = new ApolloServer({
    schema,
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
                    return args.field.complexity;
                  }
                },
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            if (Universe.starship.queryBattery.canActivate(complexity)) {
              Universe.starship.queryBattery.activate(complexity);
            } else {
              throw new Error(
                `Too complicated query! ${complexity} > the current maximum (${Universe.starship.queryBattery.maxPower})!`,
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
      "starUpdate",
      Universe.getCurrentStar()
    );
    if (Universe.getCurrentStar().name === "Beta Giclas") {
      Messages.addMessage(new Message("?", { orig: "ᐊᑎᖅᐳᖅ ᓇᐃᑦᑐᖅ !!!", en: "Leave, intruder!" }, { orig: "ᐊᑎᖅᐳᖅ ᐊᖏᔪᖅ ᑭᑉᐸᓕᕗᖅ ᑲᔪᖅ ᐆᒪᔪᖅ. ᐃᓅᔪᖅ ᓱᑦᖃᐃᐳᖅ ᓇᐹᖅᑐᖃᕐᓂᖅ. ᓇᐃᑦᑐᖅ ᐸᒥᐅᓕᒑᕐᔪᒃ ᐊᓂᑦᑖ ᓇᑯᓪᓚᖅᐳᖅ ᐳᔭᓂᖅ ᓱᕐᖁᐃᑐᖅᐹ. ᐊᑎᖅᐳᖅ ᐱᔪᖕᓇᖅᑐᖅ ᓱᑦᖃᐃᐳᖅ ᓇᒧᑐᐃᓐᓇᖅ ᐃᓗᐊᓂ ᓯᓚ. ᐊᑎᖅᐳᖅ ᓂᕿᑐᐃᓐᓇᖅ ᒪᒫᖅ ᐱᓯᕚ. ᐹᖅᑎᓯᔪᖅ ᐊᓂᑦᑖ ᐊᐅᑦᓯᑐᖅᐳᖅ ᐊᐅᑦᓯᓇᖅᑐᖅ.", en: "HALT! You have intruded upon the territory of the Burvix! Our worlds may not be approached for ANY reason! LEAVE THIS SYSTEM IMMEDIATELY! Disobedience will be punished." }));
      setTimeout(() => {
        Messages.addMessage(new Message("Science Officer", { orig: "Alien contact established!" }, { orig: "We have established contact with an alien race! Our scientists have been able to create a translator for their language. Use GraphQL field arguments to translate the message!" }));
      }, 10000)
    }
  });

  Messages.addMessageUpdateListener(() => {
    pubsub.publish(
      "inboxSub",
      Messages.getMessages()
    );
  });

  Achievements.addAchievementUnlockedListener((achievement: Achievement) => {
    pubsub.publish("achievementUnlocked", achievement);
  })
}

boot();
