import React, { useEffect, useState } from 'react';
import { FilterArea } from './FilterArea';
import service from "../utils/request";
import message from "../utils/message";

export const ExploreToolbar = ({ onTagsChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagClasses, setTagClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/tag/list_tagclass')
      .then(res => res.json())
      .then(data => {
        setTagClasses(data);
        setLoading(false);
      })
      .catch(error => {
        message("error", error);
        setLoading(false);
      });
  }, []);

  const handleTagClick = (tag) => {
    if (!tag) return;
    
    const isSelected = selectedTags.some(t => t?.value === tag?.value);
    let newSelected;
    if (isSelected) {
      newSelected = selectedTags.filter(t => t?.value !== tag?.value);
    } else {
      newSelected = [...selectedTags, tag];
    }
    setSelectedTags(newSelected);
    if (onTagsChange) {
      onTagsChange(newSelected.map(tag => tag?.value).filter(Boolean));
    }
  };

  const handleDragStart = (e, tag) => {
    if (!tag) return;
    
    try {
      e.dataTransfer.setData('text/plain', JSON.stringify(tag));
      e.dataTransfer.effectAllowed = 'move';
    } catch (error) {
      console.error('Error in drag start:', error);
    }
  };

  const filteredTagClasses = tagClasses.filter(tag => 
    tag?.phrase?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 border-b">
      <div 
        className="text-gray-600 text-left cursor-pointer flex items-center justify-between ml-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className="font-semibold">Tag Class</span>
          <svg 
            className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="relative mr-auto ml-4">
          <input
            type="text"
            placeholder="Search by Tag Class"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="pl-8 pr-4 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
          />
          <svg 
            className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className={`flex flex-wrap gap-2 bg-white p-4 mx-4 rounded-lg shadow-sm transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 ${isExpanded ? 'max-h-[400px]' : 'max-h-[150px]'}`}>
        {!loading && filteredTagClasses.map((tag) => tag && (
          <button
            key={tag.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, tag)}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-2 rounded-lg cursor-move ${
              selectedTags.some(t => t?.value === tag.id.toString())
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-bold text-base">
                  {tag.value}
                </span>
              </div>
              {tag.phrase && (
                <div className="text-sm font-medium mt-1 text-gray-600">
                  {tag.phrase}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 text-gray-600 text-left font-semibold">Filter Area</div>
      <div className="flex-1">  
        <FilterArea onTagsChange={onTagsChange} selectedTags={selectedTags} />
      </div>
    </div>
  );
};