//to run this development we need to have two servers running
const express = require('express');
//import apollo server
const { ApolloServer } = require('apollo-server-express');
//importing custom auth middleware to verify tokens
const { authMiddleware } = require('./utils/auth');
const path = require('path');
//import typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
//importing connection to database
const db = require('./config/connection');
const { ServerResponse } = require('http')

const PORT = process.env.PORT || 3001;
//create a new apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //context: This ensures that every request performs an authentication check, 
  //and the updated request object will be passed to the resolvers as the context.
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo server with the exptess application as middleware
  server.applyMiddleware({ app });
  
// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//listens for the connection to be made, then starts the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log where we can go to test our gql api
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
  // Call the async function to start the server
  startApolloServer(typeDefs, resolvers);
