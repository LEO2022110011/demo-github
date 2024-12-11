import React from 'react';
import { CONTAINER_TYPES } from '../config/filterConfig';

const withDragAndDrop = (WrappedComponent) => {
  return function WithDragAndDropComponent({
    onDrop,
    onDragStart,
    onDragEnd,
    containerType,
    borderVisible,
    setBorderVisible,
    setShowMiddleFrame,
    setShowRightFrame,
    ...props
  }) {
    const handleDragOver = (e) => {
      e.preventDefault();
      if (!e.target) return;

      const container = e.target.closest(`[data-container="${containerType}"]`);
      
      if (container) {
        setBorderVisible(true);
        if (containerType === CONTAINER_TYPES.LEFT) {
          setShowMiddleFrame(true);
        } else if (containerType === CONTAINER_TYPES.MIDDLE) {
          setShowRightFrame(true);
        }
      }
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      setBorderVisible(true);
    };

    const handleDragStart = (e) => {
      e.dataTransfer.setData('container-type', containerType);
      if (onDragStart) onDragStart(e);
    };

    return (
      <div
        draggable="true"
        data-container={containerType}
        className={`flex flex-col relative ${containerType !== CONTAINER_TYPES.LEFT ? 'mb-4' : 'mx-4 mb-4'} 
          border-2 border-dashed 
          ${borderVisible ? 'border-gray-300' : 'border-transparent'}
          rounded-lg
          ${props.isTagAttached ? 'bg-white' : 'bg-gray-100'}
          h-full overflow-y-hidden hover:overflow-y-scroll`}
        onDrop={onDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="drag-handle absolute top-2 right-2 cursor-grab active:cursor-grabbing">⋮</div>
        <div className="p-4 w-full h-full">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default withDragAndDrop; 