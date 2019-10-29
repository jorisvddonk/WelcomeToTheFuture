import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
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
    }
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
      Messages.addMessage(new Message("ᐊᑎᖅᐳᖅ", "ᐊᑎᖅᐳᖅ ᐊᖏᔪᖅ ᑭᑉᐸᓕᕗᖅ ᑲᔪᖅ ᐆᒪᔪᖅ. ᐃᓅᔪᖅ ᓱᑦᖃᐃᐳᖅ ᓇᐹᖅᑐᖃᕐᓂᖅ. ᓇᐃᑦᑐᖅ ᐸᒥᐅᓕᒑᕐᔪᒃ ᐊᓂᑦᑖ ᓇᑯᓪᓚᖅᐳᖅ ᐳᔭᓂᖅ ᓱᕐᖁᐃᑐᖅᐹ. ᐊᑎᖅᐳᖅ ᐱᔪᖕᓇᖅᑐᖅ ᓱᑦᖃᐃᐳᖅ ᓇᒧᑐᐃᓐᓇᖅ ᐃᓗᐊᓂ ᓯᓚ. ᐊᑎᖅᐳᖅ ᓂᕿᑐᐃᓐᓇᖅ ᒪᒫᖅ ᐱᓯᕚ. ᐹᖅᑎᓯᔪᖅ ᐊᓂᑦᑖ ᐊᐅᑦᓯᑐᖅᐳᖅ ᐊᐅᑦᓯᓇᖅᑐᖅ.", "Test message"));
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
