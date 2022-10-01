import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  //use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];
  //if data exists, set it to thoughts. else, save an empty array to thoughts component
  console.log(thoughts);
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>

          {/* yernary operator to conditionally render the <ThoughtList> 
          component. If the query hasn't completed and loading is still defined, 
          we display a Loading... message, else display thought list.*/}

        {loading ? (
        <div>Loading...</div>
      ) : (
        <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
      )}
</div>
      </div>
    </main>
  );
};

export default Home;

//when we load the home component, we execute the query for the thought data.
//because this is asynchronouts, apolllo library provides a loading property.
//when its finished it gets stored in a big data object.

