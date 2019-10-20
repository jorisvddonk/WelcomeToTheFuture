import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { GQLStarshipResolver } from "./starship/GQLStarship.resolver";
import { GQLStarResolver } from "./universe/GQLStar.resolver";
import { GQLPlanetResolver } from "./universe/GQLPlanet.resolver";

async function boot() {
  const schema = await buildSchema({
    resolvers: [GQLStarshipResolver, GQLStarResolver, GQLPlanetResolver]
  });

  const server = new ApolloServer({ schema });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}

boot();
