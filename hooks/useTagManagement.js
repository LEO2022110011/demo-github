import { useState, useEffect } from 'react';
import { SPECIAL_TAG_IDS } from '../config/filterConfig';
import service from '../utils/request';
import message from '../utils/message';
import { fetchTagsData } from '../services/tagService';

export const useTagManagement = () => {
  const [tagClasses, setTagClasses] = useState([]);
  const [middleTagClasses, setMiddleTagClasses] = useState([]);
  const [rightTagClasses, setRightTagClasses] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [predefinedTags, setPredefinedTags] = useState([]);
  const [directoryContents, setDirectoryContents] = useState([]);
  const [tagNameMapping, setTagNameMapping] = useState({});
  const [showMiddleFrame, setShowMiddleFrame] = useState(false);
  const [showRightFrame, setShowRightFrame] = useState(false);
  const [isTagAttached, setIsTagAttached] = useState(false);

  useEffect(() => {
    fetchTagsData().then(data => {
      const keywordATags = data.keywordATags;
      const keywordBTags = data.keywordBTags;
      setPredefinedTags([...keywordATags, ...keywordBTags]);
    }).catch(error => {
      message("error", error);
    });
  }, []);

  useEffect(() => {
    const fetchTagNames = async () => {
      try {
        const response = await service.get('/filer/get_tag');
        const mapping = response.data.reduce((acc, tag) => {
          acc[tag.id] = tag.phrase;
          return acc;
        }, {});
        setTagNameMapping(mapping);
      } catch (error) {
        console.error('Failed to fetch tag names:', error);
      }
    };

    fetchTagNames();
  }, []);

  const handleTagClick = async (tag) => {
    const isSelected = selectedTags.some(t => t.name === tag.name);
    
    if (isSelected) {
      setSelectedTags(prev => prev.filter(t => t.name !== tag.name));
      if (selectedTags.length <= 1) {
        setDirectoryContents([]);
      }
    } else {
      try {
        const response = await service.post('/filer/get_files', { tag_id: tag.id });
        setDirectoryContents(response.data);
        setSelectedTags(prev => [...prev, tag]);
      } catch (error) {
        message("error", "Failed to fetch files");
      }
    }
  };

  const removeTagClass = (e, index, isMiddle = false, isRight = false) => {
    e.stopPropagation();
    
    if (isMiddle) {
      setMiddleTagClasses(prev => {
        const newTags = [...prev];
        newTags.splice(index, 1);
        if (newTags.length === 0) {
          setShowRightFrame(false);
        }
        return newTags;
      });
    } else if (isRight) {
      setRightTagClasses(prev => {
        const newTags = [...prev];
        newTags.splice(index, 1);
        return newTags;
      });
    } else {
      setTagClasses(prev => {
        const newTags = [...prev];
        newTags.splice(index, 1);
        if (newTags.length === 0) {
          setShowMiddleFrame(false);
        }
        return newTags;
      });
    }
  };

  const handleDrop = async (e, containerType) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const tagData = JSON.parse(e.dataTransfer.getData('text/plain'));

      if (SPECIAL_TAG_IDS.includes(tagData.id)) {
        const newTag = {
          id: tagData.id,
          name: tagData.phrase || tagNameMapping[tagData.id],
          isTagClass: true
        };

        switch (containerType) {
          case 'left':
            if (!tagClasses.some(t => t.id === tagData.id)) {
              setTagClasses(prev => [...prev, { ...newTag, isLeft: true }]);
              setShowMiddleFrame(true);
            }
            break;
          case 'middle':
            if (!middleTagClasses.some(t => t.id === tagData.id)) {
              setMiddleTagClasses(prev => [...prev, { ...newTag, isMiddle: true }]);
              setShowRightFrame(true);
            }
            break;
          case 'right':
            if (!rightTagClasses.some(t => t.id === tagData.id)) {
              setRightTagClasses(prev => [...prev, { ...newTag, isRight: true }]);
            }
            break;
        }

        if (tagData.phrase) {
          const response = await service.post('/filer/get_tags', { path: tagData.phrase });
          const newTags = response.data.map(tag => ({
            id: tag.id || tagData.id,
            name: tag.tag || "TagX",
            count: tag.file_count || 0,
            [containerType === 'left' ? 'isLeft' : containerType === 'middle' ? 'isMiddle' : 'isRight']: true,
            keywordId: tagData.id
          }));

          setPredefinedTags(prevTags => {
            const otherTags = prevTags.filter(tag => !tag[containerType === 'left' ? 'isLeft' : containerType === 'middle' ? 'isMiddle' : 'isRight']);
            return [...otherTags, ...newTags];
          });
        }
      }

      setIsTagAttached(true);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return {
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
  };
}; 