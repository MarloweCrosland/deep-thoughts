import { gql } from '@apollo/client';
//this is the same as the test query we wrote using apollo studio explorer.
//we wrap the entire code in backticks and assign it to a variable so it
//can be reused anywhere we need in front end.
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;