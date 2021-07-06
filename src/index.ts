import gql from "graphql-tag";
import * as express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import fetch, { RequestInfo } from "node-fetch";
const port = process.env.PORT || 8080;

// Define APIs using GraphQL SDL
const typeDefs = gql`
  type Query {
    getPerson(name : String!) : People
    getNextPage(page : Int!) : People
  }

  type Planet {
    name: String
    rotation_period: String
    orbital_period: String
    diameter: String
    climate: String
    gravity: String
    terrain: String
    surface_water: String
    population: String
  }

  type Person {
    name: String
    height: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    homeworld: Planet
  }

  type People {
    count: Int
    next: String
    previous: String
    results: [Person]
  }
`;
// Define resolvers map for API definitions in SDL
const resolvers = {
  Person: {
    homeworld: async (parent: { homeworld: RequestInfo; }) => {
      const response = await fetch(parent.homeworld);
      return response.json();
    },
  },
 
  Query: {
    getPerson: async (_: any, { name }: any ) => {
      const response = await fetch(`https://swapi.dev/api/people/?search=${name}`);
      return response.json();
    },
    getNextPage: async (_: any, { page }: any ) => {
      const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
      return response.json();
    },
  },
};


// Configure express
const app = express();

// Build GraphQL schema based on SDL definitions and resolvers maps
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Build Apollo server

const apolloServer = new ApolloServer({ schema });
apolloServer.applyMiddleware({ app });

// Run server
app.listen({ port }, () => {
  console.log(
    `🚀Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
});
