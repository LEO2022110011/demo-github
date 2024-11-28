import React, { useCallback, useMemo, useState,useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUp,
    faPlus,
    faArrowDown,
    faUpDownLeftRight,
    faTrash,
    faArrowRightFromBracket,
    faCopy
} from "@fortawesome/free-solid-svg-icons";
import folderIcon from "../assets/icons/folder.svg";


import service from "../utils/request";
import { downloadFile, getFileTypeIcon } from "../utils/file";
import "animate.css";
import message from "../utils/message";
import NewFileModal from "./NewFileModal";
import MoveModal from "./MoveModal";
import Dialog from "./Dialog";
import UploadModal from "./UploadModal";
import Sort from "./Sort";
import Search from "./Search";
import { SpaceIcon } from "./Sidebar";
import { SpaceContext } from "../SpaceContext";
import KeywordSelect from "./KeywordSelect";
import Tags from "./Tags";
import { getAllowedActions } from "../utils/permissions";


export default function Toolbar({spaces, path, setPath, fileList, setFileList, spaceInfo,
    handleLogout, getFileList, selectedItems, setSelectedItems,openFolder, sortOrder, setSortOrder, upload, view, setView, checkExists, resolvedPermissions}) {

    const [isNewFileVisible, setIsNewFileVisible] = useState(false);
    const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [keyword, setKeyword] = useState(null);
    const [filtered, setFiltered] = useState(false);
    const [selectedTags, setSelectedTags] = useState(null);


    const { coolApps } = useContext(SpaceContext);


    const currentSpace = useMemo(() => {
            const id = path[0]?.id;
            return spaces.find((space) => space.id === id) || { id: "", name: "", class: "" };
    }, [path, spaces]);

    const allowedActions = getAllowedActions(resolvedPermissions) || []

    async function confirmDelete() {
        try {
            message("loading", "Deleting now...")
            setIsDeleteModalVisible(false);

            await service.post("/filer/delete", Object.keys(selectedItems));
            await getFileList(spaceInfo.current_id);
            setSelectedItems([])
            message("success", "Delete successfully");
        } catch (error) {
            message("error", error);
        }
    }

    async function handleNavClick(index) {
        if (index + 1 === path.length) return;
        getFileList(path[index].id);
        const pathSlice = path.slice(0, index + 1);
        setPath(pathSlice);
    }
    
    async function handleDownload() {
        if (!Object.keys(selectedItems).length) {
            message("warn", "No files selected for download");
            return;
        }

        try {
            const keys = Object.keys(selectedItems);
            // const hasFolder = keys.some((key) => selectedItems[key].is_folder);
            // if (hasFolder) throw Error("This operation on folder not supported!");
            message("success", "Start downloading");
            downloadFile(keys);
        } catch (error) {
            message("error", error);
        }
    }

    function handleDeleteClick() {
        if (Object.keys(selectedItems).length === 0) {
            message("warn", "There is no item be selected");
            return;
        }
        setIsDeleteModalVisible(true);
    }

    function handleMoveClick() {
        if (Object.keys(selectedItems).length === 0) {
            message("warn", "There is no item be selected");
            return;
        }
        setIsMoveModalVisible(true);
    }

    async function handleCopyClick() {
        const keys = Object.keys(selectedItems)
        if(keys.length === 0) {
            message("warn", "There is no item be selected");
            return;
        }
        if(keys.length > 1) {
            message("warn", "Please select only one item");
            return;
        }
        try {
           message("loading", 'Copying now...')
          
           await service.post('/filer/copy',{item_id: keys[0]})
           await getFileList(spaceInfo.current_id);
           message("success", "Copy successfully");
        } catch (error) {
            message("error", error);
        }
    }
    
    const ToolbarTitle = useCallback(() => {
        if (currentSpace.id === "search") {
            return <Search setFileList={setFileList}/>
        }
        if (currentSpace.class === "special") {
            return (
                <nav aria-label="breadcrumb">
                    <ol className="flex flex-wrap mb-1 list-none rounded-sm text-base text-neutral-900 items-center">
                        <li className="breadcrumb-item flex items-center cursor-pointer">
                            <SpaceIcon space={currentSpace} />
                            <span className="ms-3">{currentSpace.caption}</span>
                        </li>
                    </ol>
                </nav>
            )
        }
        return (
            path?.length > 0 && (
                <nav className="w-full" aria-label="breadcrumb">
                    <ol className="flex overflow-x-auto flex-nowrap mb-1 list-none rounded-sm text-base text-neutral-900 items-center">
                        <li className="breadcrumb-item flex items-center cursor-pointer" onClick={() => handleNavClick(0)} >
                            <SpaceIcon space={currentSpace} />
                            <span className="ms-3">{path[0]?.name}</span>
                        </li>
                        {path.map((folder, index) => index > 0 ? 
                            (
                            <li key={folder.id} className="flex whitespace-nowrap breadcrumb-item active" aria-current="page" >
                                <span className="text-elliipsis cursor-pointer" onClick={() => handleNavClick(index)}>
                                    {folder.name}
                                </span>
                            </li>
                            ) : null
                        )}
                    </ol>
                </nav>
            )
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSpace, setFileList,path]); 
    
    function ToolbarActionBtn({icon, onClick, action}) {
        return (
            <button
                disabled={canPerformAction(action)}
                title={action}
                onClick={onClick} 
                className="py-1 px-2.5 border border-gray-300 rounded-full w-fit h-fit text-neutral-900 hover:bg-gray-200 disabled:pointer-events-none disabled:border-gray-300/80 disabled:text-neutral-900/40"
            >
                <FontAwesomeIcon icon={icon} size="sm" />
            </button>
        )        
    }

    function canPerformAction(action) {
        switch (action) {
            case "Create":
            case "Upload":
                return Object.keys(selectedItems).length > 0;
            case "Logout":
                return false;
            default:
                return !allowedActions.includes(action)
        }
    }

    function ToolbarTools() {
        if (currentSpace.id === "search" || currentSpace.id === "recent" || currentSpace.id === "favour" || currentSpace.id === "tasks" ) {
            return "";
        }
        if (currentSpace.id === "trash") {
            return (
                <ToolbarActionBtn icon={faUpDownLeftRight} onClick={() => handleMoveClick()} />
            )
        }		
        return (
            <>
                <ToolbarActionBtn action={"Upload"} icon={faArrowUp} onClick={() => setIsUploadModalVisible(true)} />
                <ToolbarActionBtn action={"Create"} icon={faPlus} onClick={() => setIsNewFileVisible(true)} />
                <ToolbarActionBtn action={"Download"} icon={faArrowDown} onClick={() => handleDownload()} />
                <ToolbarActionBtn action={"Move"} icon={faUpDownLeftRight} onClick={() => handleMoveClick()} />
                <ToolbarActionBtn action={"Copy"} icon={faCopy} onClick={() => handleCopyClick()}/>
                <ToolbarActionBtn action={"Delete"} icon={faTrash} onClick={() => handleDeleteClick()} />
                <ToolbarActionBtn action={"Logout"} icon={faArrowRightFromBracket} onClick={() => handleLogout()} />
            </>
        );
    }

    function handleViewChange(view) {
      localStorage.setItem('view', view)
      setView(view)
    }



    return (
        <div
            className="toolbar  pt-4 fixed top-0 z-10 bg-white w-[95%]  sm:w-calc-100-minus-16rem"
        >
            <div className="flex pb-1 w-full">
                <ToolbarTitle />          
            </div>
            <div className="flex justify-between pb-1">
              <div className=" flex gap-2">
                <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} />
                {spaceInfo.current_id === 'search' && <KeywordSelect filtered={filtered} setFiltered={setFiltered} keyword={keyword} setKeyword={setKeyword}/>}
              </div>
                <div className="space-x-3 flex items-center">
                    <div className=" w-20 h-8 border-[#ffa270] border-2 flex rounded">
                       <div onClick={() => handleViewChange("list")} className={`flex-1 flex justify-center items-center cursor-pointer ${view === 'list' && 'bg-[#ffa270]'}`}>
                        <svg t="1725591142514" className={`w-4 h-4 ${view==='list'?"fill-white" : " fill-[#ffa270]"}`} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10434"><path d="M892.928 128q28.672 0 48.64 19.968t19.968 48.64l0 52.224q0 28.672-19.968 48.64t-48.64 19.968l-759.808 0q-28.672 0-48.64-19.968t-19.968-48.64l0-52.224q0-28.672 19.968-48.64t48.64-19.968l759.808 0zM892.928 448.512q28.672 0 48.64 19.968t19.968 48.64l0 52.224q0 28.672-19.968 48.64t-48.64 19.968l-759.808 0q-28.672 0-48.64-19.968t-19.968-48.64l0-52.224q0-28.672 19.968-48.64t48.64-19.968l759.808 0zM892.928 769.024q28.672 0 48.64 19.968t19.968 48.64l0 52.224q0 28.672-19.968 48.64t-48.64 19.968l-759.808 0q-28.672 0-48.64-19.968t-19.968-48.64l0-52.224q0-28.672 19.968-48.64t48.64-19.968l759.808 0z"  p-id="10435"></path></svg>
                       </div>
                       <div onClick={() => handleViewChange("grid")} className={`flex-1 flex justify-center items-center cursor-pointer ${view === 'grid' && 'bg-[#ffa270]'}`}>
                        <svg t="1725527761116" className={`w-4 h-4 ${view==='grid'?"fill-white" : " fill-[#ffa270]"}`} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8553" ><path d="M64 160a96 96 0 0 1 96-96h224a96 96 0 0 1 96 96v224a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V160z m0 480a96 96 0 0 1 96-96h224a96 96 0 0 1 96 96v224a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V640z m576-96a96 96 0 0 0-96 96v224a96 96 0 0 0 96 96h224a96 96 0 0 0 96-96V640a96 96 0 0 0-96-96H640zM640 64h224q96 0 96 96v224q0 96-96 96H640q-96 0-96-96V160q0-96 96-96z" p-id="8554"></path></svg>
                       </div>
                    </div>
                    <ToolbarTools />
                </div>
            </div>
            {spaceInfo.current_id === 'search' && filtered &&<Tags setSelectedTags={setSelectedTags} selectedTags={selectedTags}  keyword={keyword?.value}/>}
            
			{isNewFileVisible && (
				<NewFileModal
					getFileList={getFileList}
					spaceInfo={spaceInfo}
					fileList={fileList}
					setIsNewFileVisible={setIsNewFileVisible}
					openFolder={openFolder}
				/>
			)}
            {isMoveModalVisible && (
                <MoveModal
                    getFileList={getFileList}
                    setPath={setPath}
                    openFolder={openFolder}
                    spaces={spaces}
                    selectedItems={selectedItems}
                    setIsMoveModalVisible={setIsMoveModalVisible}
                    fileList={fileList}
                    spaceInfo={spaceInfo}
                    path={path}
                />
            )}
            {isDeleteModalVisible && (
                <Dialog
                    title="Are you sure to delete the selection?"
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalVisible(false)}
                >
                  <div className="w-[100%] border-gray-300 border mx-auto max-h-28 mb-5 rounded flex flex-wrap gap-x-8 gap-y-2 py-2 px-3 overflow-x-auto">{
                    Object.keys(selectedItems).map(key => <div key={selectedItems[key].item_id} className="flex items-center gap-1">
                    {!selectedItems[key].is_folder ? 
                            (  
                                getFileTypeIcon(selectedItems[key].item_name, coolApps, "m-r1 w-4 h-4")
                            ) : (
                                <img className=" w-4 h-4" src={folderIcon} alt="" />
                            )
                        }  {selectedItems[key].item_name}</div>)
                    }</div>
                </Dialog>
            )}
            {isUploadModalVisible && (
                <UploadModal
                    setIsVisible={setIsUploadModalVisible}
                    spaceInfo={spaceInfo}
                    getFileList={getFileList}
                    upload={upload}
                    checkExists={checkExists}
                />
            )}
        </div>
    );
}
