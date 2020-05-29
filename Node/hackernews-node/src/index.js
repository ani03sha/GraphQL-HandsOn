const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// These represent the actual implementation of the GraphQL Schema
const resolvers = {
    Query,
    Mutation,
    User,
    Link
}

// TypeDefs and Resolvers are bundled into the server to define what API operations are accpeted and 
// how they should be resolved
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
        }
    },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));