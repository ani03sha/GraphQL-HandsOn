const { GraphQLServer } = require('graphql-yoga');

// This defines the GraphQL Schema
const typeDefs = `
    type Query {
        info: String!
    }
`;

// These represent the actual implementation of the GraphQL Schema
const resolvers = {
    Query: {
        info: () => `This is the API of a HackerNews clone`
    }
}

// TypeDefs and Resolvers are bundled into the server to define what API operations are accpeted and 
// how they should be resolved
const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));