import message from "../utils/message";

export const handleTagClick = (tag, setDirectoryContents) => {
  if (!tag) return;

  try {
    // Check if the clicked tag is TagY
    if (tag.name === "TagY") {
      fetch('/directory/shared/keywordB/tagY')
        .then(response => response.json())
        .then(data => {
          setDirectoryContents(data);
        })
        .catch(error => {
          message("error", error);
        });
    } 
    // Check if the clicked tag is TagZ
    else if (tag.name === "TagZ") {
      fetch('/directory/shared/keywordB/tagZ')
        .then(response => response.json())
        .then(data => {
          setDirectoryContents(data);
        })
        .catch(error => {
          message("error", error);
        });
    } 
    // Check if the clicked tag is TagX
    else if (tag.name === "TagX") {
      fetch('/directory/shared/keywordA/tagX')
        .then(response => response.json())
        .then(data => {
          setDirectoryContents(data);
        })
        .catch(error => {
          message("error", error);
        });
    } else {
      // Keep the original functionality for other tags
      setDirectoryContents([]);
    }
  } catch (error) {
    console.error('Error in tag click:', error);
  }
};

// Add more tag-related functions as needed 