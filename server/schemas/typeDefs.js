const { gql } = require('apollo-server-express');

//type definitions define every piece of data the client can expect
//to work with through a query or mutation
//we are defining the exact data and parameters that are tied to
//the endpoint.


// gql is a string, because its a 'tagged template function'
// we just have an extension making it look nice
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    # friends returns User because "friends" should follow the same data pattern as User.
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

#the query type defines your different types of queries by naming them
#in gql the exclamation points mean required parameter for the query.
  type Query {
    #queries are our get requests
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

#the query type defines your different mutations, 
#along with the required params to make the mutation
  type Mutation {
    #mutations are like our post put or deletes
    login(email: String!, password: String!): Auth
    #mutations that return Auth are returning the users info along with their unique token
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    #addReaction will return the parent Thougt instead of the new Reaction.
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }

  type Auth {
      token: ID!
      user: User
  }
`;

module.exports = typeDefs;
