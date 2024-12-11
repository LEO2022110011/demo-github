import React, { useState, useRef } from 'react';

const withDraggable = (WrappedComponent) => {
  return function WithDraggableComponent(props) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const initialPosition = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
      if (e.target.closest('.drag-handle')) {
        setIsDragging(true);
        initialPosition.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y
        };
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - initialPosition.current.x;
        const newY = e.clientY - initialPosition.current.y;
        
        // Add boundary constraints
        const maxX = window.innerWidth - dragRef.current.offsetWidth;
        const maxY = window.innerHeight - dragRef.current.offsetHeight;
        
        setPosition({
          x: Math.min(Math.max(0, newX), maxX),
          y: Math.min(Math.max(0, newY), maxY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    return (
      <div
        ref={dragRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none',
          zIndex: isDragging ? 1000 : 1
        }}
        className="flex"
      >
        <div 
          className="drag-handle"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          
        />
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withDraggable; 