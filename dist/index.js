"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const express = require("express");
const apollo_server_express_1 = require("apollo-server-express");
const node_fetch_1 = require("node-fetch");
const port = process.env.PORT || 8080;
const typeDefs = graphql_tag_1.default `
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
const resolvers = {
    Person: {
        homeworld: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield node_fetch_1.default(parent.homeworld);
            return response.json();
        }),
    },
    Query: {
        getPerson: (_, { name }) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield node_fetch_1.default(`https://swapi.dev/api/people/?search=${name}`);
            return response.json();
        }),
        getNextPage: (_, { page }) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield node_fetch_1.default(`https://swapi.dev/api/people/?page=${page}`);
            return response.json();
        }),
    },
};
const app = express();
const schema = apollo_server_express_1.makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new apollo_server_express_1.ApolloServer({ schema });
apolloServer.applyMiddleware({ app });
app.listen({ port }, () => {
    console.log(`🚀Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
});
//# sourceMappingURL=index.js.map