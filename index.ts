import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { GQLStarshipResolver } from "./starship/GQLStarship.resolver";
import { GQLStarResolver } from "./universe/GQLStar.resolver";
import { GQLPlanetResolver } from "./universe/GQLPlanet.resolver";
import { PubSub } from "graphql-subscriptions";
import { Universe } from "./universe/UniverseDAO";

const UPDATE_INTERVAL = (1000 / 60) * 3; // 3 frames @ 60fps
const STARSHIP_THRUST = 10;
const STARSHIP_ROTATION = Math.PI / 5;
const STARSHIP_MAX_SPEED_SQUARED = 3000;

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
    const starship = Universe.starship;
    if (starship.thrusting) {
      starship.velocity.x +=
        Math.sin(starship.angle) * STARSHIP_THRUST * (UPDATE_INTERVAL / 1000);
      starship.velocity.y -=
        Math.cos(starship.angle) * STARSHIP_THRUST * (UPDATE_INTERVAL / 1000);
      const length =
        starship.velocity.x * starship.velocity.x +
        starship.velocity.y * starship.velocity.y;
      if (length > STARSHIP_MAX_SPEED_SQUARED) {
        starship.velocity.x =
          (starship.velocity.x / length) * STARSHIP_MAX_SPEED_SQUARED;
        starship.velocity.y =
          (starship.velocity.y / length) * STARSHIP_MAX_SPEED_SQUARED;
      }
    }
    let desiredAngle = starship.desiredAngle;
    while (desiredAngle < 0) {
      desiredAngle += Math.PI * 2;
    }
    while (desiredAngle > Math.PI) {
      desiredAngle -= Math.PI * 2;
    }
    let angle = starship.angle;
    while (angle < 0) {
      angle += Math.PI * 2;
    }
    while (angle > Math.PI) {
      angle -= Math.PI * 2;
    }
    if (angle !== desiredAngle) {
      let diff = ((desiredAngle - angle + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (diff < -Math.PI) {
        diff += Math.PI * 2;
      }
      const rotation = diff < 0 ? -1 : 1;
      if (Math.abs(diff) < STARSHIP_ROTATION * (UPDATE_INTERVAL / 1000)) {
        starship.angle = desiredAngle;
      } else {
        starship.angle =
          angle + rotation * STARSHIP_ROTATION * (UPDATE_INTERVAL / 1000);
      }
    }
    starship.position.x =
      starship.position.x + starship.velocity.x * (UPDATE_INTERVAL / 1000);
    starship.position.y =
      starship.position.y + starship.velocity.y * (UPDATE_INTERVAL / 1000);
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
  })
}

boot();
