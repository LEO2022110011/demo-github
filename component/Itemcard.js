import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareUpRight,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { convertFileSize, removeFileExtension, getFileTypeIcon} from "../utils/file";
import folderIcon from "../assets/icons/folder.svg";
import service from "../utils/request";
import message from "../utils/message";
import { SpaceContext } from "../SpaceContext";
import Mark from "./Mark";
import { isImageFile } from "../utils/file";

export default function Itemcard({view, item, handleItemClick, handleOpen, spaceInfo, getFileList,
                   openFolder, setPath, setIsPropertiesModalVisible,setCurrentItem,selectedItems })
{
    const { coolApps } = useContext(SpaceContext);

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    async function handleEnterKeyUp(e) {
        if (e.keyCode === 13) {
          try {
            const itemInfo =  await service.get('/filer/item/'+ item.item_id)
            setCurrentItem({...itemInfo, permissions: item.permissions})
            setIsPropertiesModalVisible(true)
          } catch (error) {
            message("error", error);
          }
        }
    };

    async function handleMarkClick(id) {
        try {
          const itemInfo =  await service.get('/filer/item/'+ id)
          setCurrentItem({...itemInfo, permissions: item.permissions})
          setIsPropertiesModalVisible(true)
        } catch (error) {
          message("error", error);
        }
  };
  

    const handleJumpBtnClick = async (item) => {
        await getFileList(item.folder_id === '' ? item.space_id : item.folder_id);
        const new_path = await service.get("/filer/path/" + item.item_id);
        
        setPath(new_path);
    }
    
    function getItemName(item) {
        return item.is_folder ? item.item_name : removeFileExtension(item.item_name);        
    }


    return (
        <section
            onKeyUp={handleEnterKeyUp}
            onClick={() => handleItemClick(item)}
            onDoubleClick={() => handleOpen(item)}
        >
          {view === 'list' ?
            <label className="relative flex items-center rounded-full cursor-pointer group">
                <input
                    type="checkbox"
                    className=" outline-none group-hover:bg-zinc-200 before:content[''] peer relative h-14 w-full cursor-pointer appearance-none rounded border border-gray-200 bg-white transition-all checked:border-none checked:ring-2 checked:ring-[#ffa270] hover:bg-zinc-200 focus:bg-white"
                    checked={item.item_id in selectedItems}
                />
                <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"></span>
                <div
                    className="flex flex-col px-4 pt-1 text-start absolute"
                    onClick={stopPropagation}
                >
                    <div className="text-base font-semibold leading-none whitespace-nowrap tracking-tight text-neutral-900 flex">
                        {!item.is_folder ? 
                            (  
                                getFileTypeIcon(item.item_name, coolApps)
                            ) : (
                                <img className=" w-4 h-4 mr-2" src={folderIcon} alt="" />
                            )
                        }
                        {getItemName(item) }
                        {(!item.is_folder && item.space_id !== spaceInfo.space_id && spaceInfo.space_id !== 'trash') &&
                            <button onClick={() => handleJumpBtnClick(item)}>
                                <FontAwesomeIcon icon={faSquareUpRight} className="w4 h4 ml-2" />
                            </button>
                        }
                    </div>
                    <p className="text-xs py-1 text-neutral-600">
                        {!item.is_folder && <span className="mr-2">{convertFileSize(item.item_size)}</span>}
                        {(item.created_by !== '') && <span className="mr-2">owner {item.created_by}</span>}
                        <span className="mr-2">created on {item.created_time}</span>
                        <span>Last modified on {item.modified_time}</span>
                    </p>
                </div>
                <Mark value={item.item_mark} id={item.item_id} handleItemClick={handleMarkClick}/>
            </label> :
            <div tabIndex="0" title={item.item_name} onKeyUp={handleEnterKeyUp} className={`outline-none relative p-2 w-28 h-28 border-2 rounded hover:bg-zinc-300  
                transition-all cursor-pointer flex items-center flex-col ${item.item_id in selectedItems ? 'border-[#ffa270]' : 'border-gray-200' }`}>
              {!item.is_folder ? 
                (  
                  isImageFile(item.item_name) ? <img loading="lazy" src={`/filer/open/${item.item_id}`} className="  h-14" alt="" />:  getFileTypeIcon(item.item_name, coolApps, "w-20 h-14")
                ) : (
                    <img className=" w-20 h-14" src={folderIcon} alt="" />
                )
               }
              <div className={`transition-all w-full border-t-2 mt-1 ${item.item_id in selectedItems ? 'border-[#ffa270]' : 'border-gray-200' }`}></div>
              <div className=" w-full text-sm font-semibold text-neutral-900 leading-none  tracking-tight mt-1"><p className="truncate">{getItemName(item) }</p></div>
              {(item.created_by !== '') && <span className=" text-xs text-neutral-600">{item.created_by}</span>}
              {(!item.is_folder && item.space_id !== spaceInfo.space_id && spaceInfo.space_id !== 'trash') &&
                            <button className=" absolute top-1 right-1" onClick={() => handleJumpBtnClick(item)}>
                                <FontAwesomeIcon icon={faSquareUpRight} className="w4 h4 ml-2" />
                            </button>
              }
              
            </div>
          }
        </section>
    );
}

