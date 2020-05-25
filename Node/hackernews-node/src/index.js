const { GraphQLServer } = require('graphql-yoga');

// This defines the GraphQL Schema
const typeDefs = `
    type Query {
        info: String!
        feed: [Link!]!
    }

    type Link {
        id: ID!
        description: String!
        url: String!
    }
`;

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}];

// These represent the actual implementation of the GraphQL Schema
const resolvers = {
    Query: {
        info: () => `This is the API of a HackerNews clone`,
        feed: () => links,
    },

    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url
    }
}

// TypeDefs and Resolvers are bundled into the server to define what API operations are accpeted and 
// how they should be resolved
const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));