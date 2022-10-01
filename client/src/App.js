import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

//establish a new link to graphql server at its endpoint with createHttpLink
const httpLink = createHttpLink({
  uri: '/graphql',
});

//use apollo client constructor to instantiate the apollo client instance
//and create the connection to the API endpoint.
const client = new ApolloClient({
  link: httpLink,
  //instantiate a new cache object
  cache: new InMemoryCache(),
});


function App() {
  return (
    // wrap the entire jsx code with <ApolloProvider> and pass in client variable.
    //now everything inside has access to the servers API data through the client we set up.
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
