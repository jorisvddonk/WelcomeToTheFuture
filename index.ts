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

const UPDATE_INTERVAL = (1000 / 60) * 3; // 3 frames @ 60fps
const STARSHIP_THRUST = 10;
const STARSHIP_ROTATION = Math.PI / 5;
const STARSHIP_MAX_SPEED_SQUARED = 3000;

async function boot() {
  const pubsub = new PubSub();
  const schema = await buildSchema({
    resolvers: [RootResolver, StarshipResolver, StarResolver, PlanetResolver, MessageResolver, AchievementResolver],
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
  });

  Achievements.addAchievementUnlockedListener((achievement: Achievement) => {
    pubsub.publish("achievementUnlocked", achievement);
  })
}

boot();
