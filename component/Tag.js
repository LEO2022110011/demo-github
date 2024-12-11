import React from 'react';

const Tag = ({ 
  tag, 
  selectedTags, 
  onDragStart, 
  onClick 
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, tag)}
      onClick={(e) => onClick(e, tag)}
      className={`flex items-center justify-between px-4 py-2 rounded-sm cursor-pointer mb-0.5 
        ${selectedTags.some(t => t.name === tag.name)
          ? 'bg-orange-50 hover:bg-orange-50'
          : 'bg-gray-25 hover:bg-gray-50'}`}
    >
      <div className="flex items-center justify-between w-full">
        <span className={`text-sm font-normal 
          ${selectedTags.some(t => t.name === tag.name) ? 'text-orange-400' : 'text-gray-400'}`}>
          {tag.name}
        </span>
        <div className="flex items-center">
          <span className="text-xs text-gray-300">• ({tag.count})</span>
        </div>
      </div>
    </div>
  );
};

export default Tag; 