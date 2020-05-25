const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')

// These represent the actual implementation of the GraphQL Schema
const resolvers = {
    Query: {
        info: () => `This is the API of a HackerNews clone`,
        feed: () => (root, args, context,info) => {
            return context.prisma.links()
        },
    },

    Mutation: {
        post: (root, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description,
            })
        },
    },
}

// TypeDefs and Resolvers are bundled into the server to define what API operations are accpeted and 
// how they should be resolved
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));