import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { GQLStarshipResolver } from "./starship/GQLStarship.resolver";
import { GQLStarResolver } from "./universe/GQLStar.resolver";
import { GQLPlanetResolver } from "./universe/GQLPlanet.resolver";
import { PubSub } from "graphql-subscriptions";
import { CoordinateNotification } from "./starship/CoordinateNotification";
import { Universe } from "./universe/UniverseDAO";

const UPDATE_INTERVAL = 1000;

async function boot() {
  const pubsub = new PubSub();
  const schema = await buildSchema({
    resolvers: [GQLStarshipResolver, GQLStarResolver, GQLPlanetResolver],
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
    Universe.starship.x =
      Universe.starship.x +
      Universe.starship.velocity.x * (UPDATE_INTERVAL / 1000);
    Universe.starship.y =
      Universe.starship.y +
      Universe.starship.velocity.y * (UPDATE_INTERVAL / 1000);
    pubsub.publish(
      "spaceshipCoordinateUpdate",
      new CoordinateNotification(
        Universe.starship.x,
        Universe.starship.y,
        Universe.starship.angle,
        Universe.starship.velocity
      )
    );
  }, UPDATE_INTERVAL);
}

boot();
