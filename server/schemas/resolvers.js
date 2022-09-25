const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
      // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');
    },
    // get user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    // get thoughts by a user
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // get though by id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    }
  },
  Mutation: {
      //create new user 
      addUser: async (parent, args) => {
        const user = await User.create(args);

        return user;
      },

      //login mutations
      login: async () => {
        const user = await User.findOne({ email });

        if(!user) {
            throw new AuthenticationError('Incorrect credentials');
        }

        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }

        return user
      }
  }
};

module.exports = resolvers;
