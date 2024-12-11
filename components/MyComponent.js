import React from 'react';
import withTagSelection from '../utils/withTagSelection';

const MyComponent = ({ tags, selectedTagId, onTagClick }) => {
  return (
    <div>
      {tags.map(tag => (
        <div
          key={tag.id}
          onClick={() => onTagClick(tag.id)}
          className={`tag ${selectedTagId === tag.id ? 'bg-orange-100' : 'bg-gray-200'}`}
        >
          {tag.name}
        </div>
      ))}
    </div>
  );
};

export default withTagSelection(MyComponent);