//import the gql tagged template function
const { gql } = require('apollo-server-express');

//create our typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        # here is where we define the queries
        # these queries are resolved in resolvers.js
        users: [User]
        user(username: String!): User
        # exclamation mark means its required
        thoughts(username: String):[Thought]
        thought(_id: ID!): Thought
    }
`;

//export the typeDefs
module.exports = typeDefs;