import service from '../utils/request';
import message from '../utils/message';
import { getTagName } from './filterAreaUtils';
import { handleTagClick as handleTagClickOriginal } from './tagHandlers';

export const handleDragStartEvent = (e, tag, setDraggedTag) => {
  e.dataTransfer.setData('text/plain', JSON.stringify({
    ...tag,
    isTagClass: true
  }));
  e.dataTransfer.effectAllowed = 'move';
  setDraggedTag(tag);
};

export const handleRemoveTagClass = (
  e,
  index,
  isMiddle = false,
  isRight = false,
  middleTagClasses,
  tagClasses,
  rightTagClasses,
  setMiddleTagClasses,
  setTagClasses,
  setRightTagClasses,
  setShowRightFrame,
  setShowMiddleFrame,
  setIsTagAttached
) => {
  e.stopPropagation();

  if (isMiddle) {
    const newTagClasses = middleTagClasses.filter((_, i) => i !== index);
    setMiddleTagClasses(newTagClasses);
    if (newTagClasses.length === 0) {
      setShowRightFrame(false);
    }
    if (newTagClasses.length === 0 && tagClasses.length === 0 && rightTagClasses.length === 0) {
      setShowMiddleFrame(false);
    }
  } else if (isRight) {
    const newTagClasses = rightTagClasses.filter((_, i) => i !== index);
    setRightTagClasses(newTagClasses);
    if (newTagClasses.length === 0 && tagClasses.length === 0 && middleTagClasses.length === 0) {
      setShowRightFrame(false);
      setShowMiddleFrame(false);
    }
  } else {
    const newTagClasses = tagClasses.filter((_, i) => i !== index);
    setTagClasses(newTagClasses);
    if (newTagClasses.length === 0 && middleTagClasses.length === 0 && rightTagClasses.length === 0) {
      setShowRightFrame(false);
      setShowMiddleFrame(false);
      setIsTagAttached(false);
    }
  }
};

export const handleTagClickEvent = (e, tag, setSelectedTags, setDirectoryContents) => {
  e.preventDefault();
  setSelectedTags([tag]);

  
  handleTagClickOriginal(tag, setDirectoryContents);
};

export const handleTagClick = handleTagClickEvent;

export const removeTagClass = handleRemoveTagClass;

export const handleDrop = (e, state) => {
  e.preventDefault();
  e.stopPropagation();
  
  const {
    draggedTag, tagClasses, middleTagClasses, rightTagClasses, 
    predefinedTags, setTagClasses, setMiddleTagClasses, 
    setRightTagClasses, setPredefinedTags, setDraggedTag,
    setDroppedTags, setShowMiddleFrame, setShowRightFrame,
    setBorderVisible, setIsTagAttached, setSelectedTags,
    setDirectoryContents
  } = state;

  // ... rest of original handleDrop logic ...
};

export const handleDragOver = (e, state) => {
  e.preventDefault();
  const { setBorderVisible, setShowMiddleFrame, setShowRightFrame } = state;
  
  if (!e.target) return;

  const leftContainer = e.target.closest('[data-container="left"]');
  const middleContainer = e.target.closest('[data-container="middle"]');
  const rightContainer = e.target.closest('[data-container="right"]');

  if (leftContainer) {
    setBorderVisible(true);
    setShowMiddleFrame(true);
  } else if (middleContainer) {
    setBorderVisible(true);
    setShowRightFrame(true);
  } else if (rightContainer) {
    setBorderVisible(true);
  }
};

export const handleDragEnd = (tagClass, state) => {
  const {
    tagClasses, middleTagClasses, rightTagClasses,
    setTagClasses, setMiddleTagClasses, setRightTagClasses,
    setShowMiddleFrame, setShowRightFrame, setDirectoryContents,
    setIsTagAttached, setBorderVisible, setDraggedTag
  } = state;

  setDraggedTag(null);
  // ... rest of original handleDragEnd logic ...
};