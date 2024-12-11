import React from 'react';
import { TAG_NAMES } from '../config/filterConfig';

const TagClass = ({ 
  tag, 
  index, 
  selectedTags, 
  onDragStart, 
  onDragEnd, 
  onClick, 
  onRemove 
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, tag)}
      onDragEnd={(e) => onDragEnd(e, tag)}
      onClick={(e) => onClick(e, tag)}
      className={`flex items-center justify-between px-4 py-2 rounded-md cursor-move mb-1 
        bg-gray-200 border border-gray-300 hover:bg-gray-300 
        ${selectedTags.some(t => t.id === tag.id) ? 'bg-orange-100 hover:bg-orange-200' : ''}`}
    >
      <span className={`text-sm font-bold 
        ${selectedTags.some(t => t.id === tag.id) ? 'text-orange-600' : 'text-black'}`}>
        {TAG_NAMES[tag.id] || tag.name}
      </span>
      <button
        onClick={(e) => onRemove(e, index)}
        className="text-gray-400 hover:text-gray-600 ml-2"
      >
        ×
      </button>
    </div>
  );
};

export default TagClass; 