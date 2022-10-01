import React from 'react';
//if theres data, we return message saying no thoughts yet, if there is,
//we map through and create a card for each one.
//the key prop helps react internally track which data needs to be re-rendered
const ThoughtList = ({ thoughts, title }) => {
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              {thought.username}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <p>{thought.thoughtText}</p>
              <p className="mb-0">
                Reactions: {thought.reactionCount} || Click to{' '}
                {thought.reactionCount ? 'see' : 'start'} the discussion!
                {/* if thres reactions, see, if not, start the discussion */}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;