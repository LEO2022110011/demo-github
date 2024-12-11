import React from 'react';
import { UI_STRINGS } from '../config/filterConfig';
import TagClass from './TagClass';
import Tag from './Tag';
import withDragAndDrop from '../hoc/withDragAndDrop';

const TagFrame = ({
  tagClasses,
  predefinedTags,
  selectedTags,
  containerType,
  onTagClassDragStart,
  onTagClassDragEnd,
  onTagClassClick,
  onTagClassRemove,
  onTagDragStart,
  onTagClick
}) => {
  const hasTagClasses = tagClasses.length > 0;

  if (!hasTagClasses) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-gray-400 text-lg font-semibold leading-5">
          {UI_STRINGS.DRAG_HERE}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 h-full">
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 pl-2 text-left">
          {UI_STRINGS.TAG_CLASS}
        </p>
        {tagClasses.map((tagClass, index) => (
          <TagClass
            key={index}
            tag={tagClass}
            index={index}
            selectedTags={selectedTags}
            onDragStart={onTagClassDragStart}
            onDragEnd={onTagClassDragEnd}
            onClick={onTagClassClick}
            onRemove={onTagClassRemove}
          />
        ))}
      </div>

      <hr className="border-gray-300 my-2" />

      {predefinedTags.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2 pl-2 text-left">
            {UI_STRINGS.TAGS}
          </p>
          {predefinedTags
            .filter(tag => tag[`is${containerType.charAt(0).toUpperCase() + containerType.slice(1)}`])
            .map((tag, index) => (
              <Tag
                key={index}
                tag={tag}
                selectedTags={selectedTags}
                onDragStart={onTagDragStart}
                onClick={onTagClick}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default withDragAndDrop(TagFrame); 