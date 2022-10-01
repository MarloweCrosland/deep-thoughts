const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

//resolvers are the functions we connect to each query or mutation
//a resolver can accept 4 args : parent, args, contect, info
//parent: if we used nexted resolvers to handle more actions, it would hold referecne to resolver
//args: this is an object of all the values passed into a query or mutation request
//context:if we were to need the same data to be accessible by alll resolvers (login)
//info: extra information about the operations current state.
const resolvers = {
// QUERIES--------------------------------
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        //omit the mongoose specific __v property, and password info.
          .select('-__v -password')
          //populate the friends and thoughts so we can get associated data 
          .populate('thoughts')
          .populate('friends');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    // look up thoughts by username, if no username, return all thoughts.
    thoughts: async (parent, { username }) => {
      // the parent parameter is a placeholder which wont be used
      //we use a ternary to check if username exists, if it does,
      //we set params to an object with a username key set to that value. if it doesnt, return empty object.
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    }
  },
// MUTATIONS ---------------------------------------
  Mutation: {
    // the mongoose user model creates a new user with whatever is passed in args
    // mutation request example: 
    //addUser(username: "tester", password: "test1234", email: "example@gmail.com") {
      // _id
      //username
      //email
    //}
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    // normally throwing an error would cause your server to crash, but graphql will
    //catch the error and send it to the client instead using AuthenticationError
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      //if the user can be verified, create new thought with args, add the thought to their thoughts, and return the thought.
      if (context.user) {
        const thought = await Thought.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }
      //if the user cant be verified, tell them they need to be logged in.
      throw new AuthenticationError('You need to be logged in!');
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      //if the user exists
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          //add reaction to the thought, which you find by ID.
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          // without the { new: true } flag in User.findByIdAndUpdate(), 
          // Mongo would return the original document instead of the updated document.
          { new: true, runValidators: true }
        );
          //return the updated thought with new reaction pushed.
        return updatedThought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    
    addFriend: async (parent, { friendId }, context) => {
      //If the user exists, add a friend to the User's friend array by friendid.
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;