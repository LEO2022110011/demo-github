import React, { useState } from 'react';
import { CONTAINER_TYPES, FILE_EXTENSIONS, UI_STRINGS } from '../config/filterConfig';
import { useTagManagement } from '../hooks/useTagManagement';
import TagFrame from './TagFrame';
import ItemProperties from './ItemProperties';
import { openFolder } from '../utils/folderUtils';
import { getFileExtension } from '../utils/fileUtils';
import { getFileIcon } from './filterAreaUtils';
import service from '../utils/request';
import message from '../utils/message';
import withDraggable from '../hoc/withDraggable';

export const FilterArea = ({ onTagsChange }) => {
  const [filterText, setFilterText] = useState('');
  const [borderVisible, setBorderVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [draggedTag, setDraggedTag] = useState(null);

  const {
    tagClasses,
    middleTagClasses,
    rightTagClasses,
    selectedTags,
    predefinedTags,
    directoryContents,
    showMiddleFrame,
    showRightFrame,
    isTagAttached,
    handleTagClick,
    removeTagClass,
    handleDrop,
    setShowMiddleFrame,
    setShowRightFrame,
    setIsTagAttached
  } = useTagManagement();

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    onTagsChange(e.target.value);
  };

  const handleDragStart = (e, tag) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(tag));
    setDraggedTag(tag);
  };

  const handleDragEnd = (e, tag) => {
    setDraggedTag(null);
  };

  const handleDoubleClick = async (item) => {
    const { item_id, item_name, is_folder } = item;

    if (is_folder) {
      openFolder({ item_id, item_name });
      return;
    }

    const extension = getFileExtension(item_name);

    if (FILE_EXTENSIONS.includes(extension)) {
      try {
        const res = await service.get(`/filer/edit/${item_id}`);
        window.open(`${res.editor}?WOPISrc=${res.wopisrc}/${item_id}?access_token=${res.access}`);
      } catch (error) {
        message("error", "File not found: " + item_id);
      }
    } else {
      window.open(`/filer/open/${item_id}`);
    }
  };

  return (
    <div className="flex h-[62vh]">
      {/* Left Frame */}
      <div className="flex flex-col w-1/5 bg-gray-50 h-full">
        <TagFrame
          tagClasses={tagClasses}
          predefinedTags={predefinedTags}
          selectedTags={selectedTags}
          containerType={CONTAINER_TYPES.LEFT}
          onDrop={(e) => handleDrop(e, CONTAINER_TYPES.LEFT)}
          onTagClassDragStart={handleDragStart}
          onTagClassDragEnd={handleDragEnd}
          onTagClassClick={handleTagClick}
          onTagClassRemove={(e, index) => removeTagClass(e, index)}
          onTagDragStart={handleDragStart}
          onTagClick={handleTagClick}
          borderVisible={borderVisible}
          setBorderVisible={setBorderVisible}
          setShowMiddleFrame={setShowMiddleFrame}
          setShowRightFrame={setShowRightFrame}
          isTagAttached={isTagAttached}
        />
      </div>

      {/* Middle Frame */}
      {showMiddleFrame && (
        <div className="flex flex-col w-1/5 bg-gray-50 h-full mx-4">
          <TagFrame
            tagClasses={middleTagClasses}
            predefinedTags={predefinedTags}
            selectedTags={selectedTags}
            containerType={CONTAINER_TYPES.MIDDLE}
            onDrop={(e) => handleDrop(e, CONTAINER_TYPES.MIDDLE)}
            onTagClassDragStart={handleDragStart}
            onTagClassDragEnd={handleDragEnd}
            onTagClassClick={handleTagClick}
            onTagClassRemove={(e, index) => removeTagClass(e, index, true)}
            onTagDragStart={handleDragStart}
            onTagClick={handleTagClick}
            borderVisible={borderVisible}
            setBorderVisible={setBorderVisible}
            setShowMiddleFrame={setShowMiddleFrame}
            setShowRightFrame={setShowRightFrame}
            isTagAttached={isTagAttached}
          />
        </div>
      )}

      {/* Right Frame */}
      {showRightFrame && (
        <div className="flex flex-col w-1/5 bg-gray-50 h-full mx-4">
          <TagFrame
            tagClasses={rightTagClasses}
            predefinedTags={predefinedTags}
            selectedTags={selectedTags}
            containerType={CONTAINER_TYPES.RIGHT}
            onDrop={(e) => handleDrop(e, CONTAINER_TYPES.RIGHT)}
            onTagClassDragStart={handleDragStart}
            onTagClassDragEnd={handleDragEnd}
            onTagClassClick={handleTagClick}
            onTagClassRemove={(e, index) => removeTagClass(e, index, false, true)}
            onTagDragStart={handleDragStart}
            onTagClick={handleTagClick}
            borderVisible={borderVisible}
            setBorderVisible={setBorderVisible}
            setShowMiddleFrame={setShowMiddleFrame}
            setShowRightFrame={setShowRightFrame}
            isTagAttached={isTagAttached}
          />
        </div>
      )}

      {/* Items Display Area */}
      <div className="flex-1 flex items-center justify-center bg-white h-full">
        {selectedTags.length === 0 ? (
          <div className="text-gray-400 flex flex-col items-center justify-center">
            <p className="text-sm text-center">{UI_STRINGS.NO_ITEMS}</p>
          </div>
        ) : (
          <div className="p-4 w-full h-full overflow-auto relative">
            {directoryContents.length > 0 ? (
              <div className="space-y-2">
                {directoryContents.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 relative cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`mr-2 ${getFileIcon(item.item_name).color}`}>
                            {getFileIcon(item.item_name).icon}
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {item.item_name}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Size: {item.item_size > 1024 * 1024
                            ? `${(item.item_size / (1024 * 1024)).toFixed(2)} MB`
                            : item.item_size > 1024
                              ? `${(item.item_size / 1024).toFixed(2)} kB`
                              : `${item.item_size} bytes`}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Created by: {item.created_by}</span>
                        <span className="mx-2">•</span>
                        <span>Created time: {item.created_time}</span>
                        <span className="mx-2">•</span>
                        <span>Modified time: {item.modified_time}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setIsPropertiesOpen(true);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center focus:outline-none"
                      >
                        <span className="text-gray-600 text-sm">⚙</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
                <p>{UI_STRINGS.CLICK_TO_VIEW}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ItemProperties
        isOpen={isPropertiesOpen}
        onClose={() => {
          setIsPropertiesOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
};

export default withDraggable(FilterArea);