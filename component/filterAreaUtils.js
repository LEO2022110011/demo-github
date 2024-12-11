export const getTagName = (id) => {
  const defaultNames = {
    1: "Keyword A",
    2: "Keyword B",
    3: "YEAR",
    4: "SYSTEM"
  };

  if (typeof id === 'object') {
    if (id.phrase) {
      return id.phrase;
    }
    return defaultNames[id.id] || "Unknown";
  }
  
  return defaultNames[id] || "Unknown";
};

export const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  switch (extension) {
    case 'docx':
    case 'doc':
    case 'txt':
      return {
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        color: extension === 'txt' ? 'text-gray-500' : 'text-blue-500'
      };
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return {
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        color: 'text-red-500'
      };
    default:
      return {
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        color: 'text-gray-500'
      };
  }
}; 