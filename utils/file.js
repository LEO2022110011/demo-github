import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileWord,
  faFilePowerpoint,
  faFileExcel,
  faFilePdf,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileZipper,
} from "@fortawesome/free-solid-svg-icons";
import fileIcon from "../assets/icons/file.svg";
import markdownIcon from '../assets/icons/markdown.svg'
import service from "./request";
import axios from 'axios';


export function getFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "";
  }
  return filename.slice(lastDotIndex + 1);
}

export function removeFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  return (lastDotIndex === -1) ? filename : filename.substr(0, lastDotIndex);
}


const iconClass = "w-4 h-4 mr-2";
export const propertyToIconMap = (size) => ({
    'writer': <FontAwesomeIcon icon={faFileWord} className={`${size || iconClass} text-[#4285f4]`} />,
    'writer-global': <FontAwesomeIcon icon={faFileWord} className={`${size || iconClass} text-[#4285f4]`} />,
    'writer-web': <FontAwesomeIcon icon={faFileWord} className={`${size || iconClass} text-[#4285f4]`} />,
    'impress': <FontAwesomeIcon icon={faFilePowerpoint} className={`${size || iconClass} text-[#f4b400]`} />,
    'calc': <FontAwesomeIcon icon={faFileExcel} className={`${size || iconClass} text-[#249d58]`} />,
    'draw': <FontAwesomeIcon icon={faFileImage} className={`${size ||iconClass} text-[#249d58]`} />
  })

const lessIconClass = "text-2xl hover:text-3xl duration-200"
export const lessPropertyToIconMap = {
  'writer': <FontAwesomeIcon icon={faFileWord} className={`${lessIconClass} text-[#4285f4]`} />,
  'impress': <FontAwesomeIcon icon={faFilePowerpoint} className={`${lessIconClass} text-[#f4b400]`} />,
  'calc': <FontAwesomeIcon icon={faFileExcel} className={`${lessIconClass} text-[#249d58]`} />,
  'draw': <FontAwesomeIcon icon={faFileImage} className={`${lessIconClass} text-[#249d58]`} />,
  'markdown': <img className={`w-6 h-6 hover:w-7 hover:h-7 duration-200 mb-[1px]`} src={markdownIcon} alt="" />
}

export function getFileTypeIcon(name, coolApps, size) {
  const suffix = getFileExtension(name);
  const fileProperty = findPropertyByExtension(suffix, coolApps);
  
  const extensionToIconMap = {
    'pdf': <FontAwesomeIcon icon={faFilePdf} className={`${size || iconClass} text-amber-700 `} />,
    'jpg': <FontAwesomeIcon icon={faFileImage} className={`${size || iconClass} text-sky-300`} />,
    'png': <FontAwesomeIcon icon={faFileImage} className={`${size || iconClass} text-sky-300`} />,
    'jpeg': <FontAwesomeIcon icon={faFileImage} className={`${size || iconClass} text-sky-300`} />,
    'mp3': <FontAwesomeIcon icon={faFileAudio} className={`${size || iconClass} text-gray-400`} />,
    'mp4': <FontAwesomeIcon icon={faFileVideo} className={`${size || iconClass} text-gray-400`} />,
    'zip': <FontAwesomeIcon icon={faFileZipper} className={`${size || iconClass} text-gray-500`} />,
    'rar': <FontAwesomeIcon icon={faFileZipper} className={`${size || iconClass} text-gray-500`} />,
    'txt': <img className={`${size || iconClass}`} src={markdownIcon} alt="" />,
    'md': <img className={`${size || iconClass}`} src={markdownIcon} alt="" />,
  };

  if (extensionToIconMap[suffix]) {
    return extensionToIconMap[suffix];
  }

  return propertyToIconMap(size)[fileProperty] || <img className={`${size || iconClass}`} src={fileIcon} alt="" />;
}

export function convertFileSize(fileSizeInBytes) {
  const fileSizeInKB = fileSizeInBytes / 1024; // 转换为 KB
  const fileSizeInMB = fileSizeInKB / 1024; // 转换为 MB
  const fileSizeInGB = fileSizeInMB / 1024; // 转换为 GB
  if (fileSizeInGB >= 1) {
    return fileSizeInGB.toFixed(2) + " GB";
  } else if (fileSizeInMB >= 1) {
    return fileSizeInMB.toFixed(2) + " MB";
  } else if (fileSizeInKB >= 1) {
    return fileSizeInKB.toFixed(2) + " KB";
  } else {
    return fileSizeInBytes + " bytes";
  }
}

export function downloadFile(ids) {
  ids.forEach((id, index) => {
    const delay = index * 1000; 
    setTimeout(() => {
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);
      link.href = window.location.origin + `/filer/download/${id}`;
      link.setAttribute('download', ''); 
      link.click();
      document.body.removeChild(link);
    }, delay);
  });
}

function findPropertyByExtension(extension, data) {
  for (const property in data) {
    if (data.hasOwnProperty(property)) {
      const extensions = data[property].extensions;
      if (extensions.includes(extension)) {
        return property;
      }
    }
  }
  return null; // Return null if the extension is not found
}

export async function uploadFile(file, spaceInfo, setProgerss, action) {

    // const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const cancelTokenSource = axios.CancelToken.source();
    const chunkSize = 1024 * 1024;

    let folder_id = spaceInfo.folder_id === "" ? spaceInfo.space_id : spaceInfo.folder_id

    // create a file holder record
    const res = await service.post("/filer/new", {
        folder_id: folder_id,
        file_name: file.name,
        file_type: ".",
        action
    })
    const {item_id, item_name} = res;
    setProgerss(`0%`, cancelTokenSource, item_id)
    let pos = 0;
    while (pos < file.size) {
        await uploadFileChunk(item_id, file.slice(pos, pos + chunkSize));
        setProgerss(`${Math.round((pos / file.size) * 100)}%`, cancelTokenSource, item_id)
        pos += chunkSize;
    }
    if(pos >= file.size) {
        setProgerss('100%',cancelTokenSource, item_id)
    }
    async function uploadFileChunk(item_id, chunk) {
        const formdata = new FormData();
        formdata.append('item_id', item_id);
        formdata.append('fileobj', chunk);
        try {
            await axios.post('/filer/upload', formdata,  {
                cancelToken: cancelTokenSource.token
            })
        } catch (error) {
            throw error
        }
    }
}


export function isImageFile(fileName) {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}