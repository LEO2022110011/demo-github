import { useState, useEffect, useMemo } from "react";
import folderIcon from "../assets/icons/folder.svg";
import service from "../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp,faHome, faListUl } from "@fortawesome/free-solid-svg-icons";
import message from "../utils/message";

function MoveModal({ setIsMoveModalVisible, spaces, path, setPath, fileList, getFileList, selectedItems, spaceInfo }) {
    const [folders, setFolders] = useState(fileList.filter((item) => item.is_folder));
    const [folderPath, setFolderPath] = useState(path);
    const [selectedFolder, setSelectedFolder] = useState({id: "", name: ""});
    
    useEffect(() => {
        setSelectedFolder({
            id: folderPath[folderPath.length - 1]?.id,
            name: folderPath[folderPath.length - 1]?.name
        })
    }, [folderPath]);

    async function moveDown(id, name) {
        const res = await service.get("/filer/list/" + id);
        setFolderPath([...folderPath, { id, name}]);
        setFolders(res.filter((item) => item.is_folder));
    }

    async function moveUp() {
        if(folderPath.length === 1) {
            setFolders(
                spaces.map(item => ({item_name: item.caption, item_id: item.id, item_type: item.class})).filter(item => item.item_type !== 'special')
            );
            setFolderPath([]);
            return
        }

        const pathSlice= [...folderPath]
        const res = await service.get('/filer/list/' + folderPath[folderPath.length - 2]?.id)
        pathSlice.pop()
        setFolderPath(pathSlice)
        setFolders(res.filter(item => item.is_folder))
    }

    async function handleConfirmClick() {
        console.log('handleConfirmClick');

        const {id} = selectedFolder
        if(folderPath.length === 0 && !id) {
            message("warn", "Please select a space")
            return
        }
        try {
            message("loading", 'Moving now...')
            setIsMoveModalVisible(false)
            
            await service.post("/filer/move", {items: Object.keys(selectedItems), folder_id: id});
            await getFileList(id)
            if(id !== folderPath[folderPath.length - 1]?.id) {
                setPath([...folderPath, selectedFolder]);
            } else {
                setPath(folderPath)
            }			
            message("success", 'Move successfully')
        } catch (error) {
            message("error", error);
        }
    }
    
    const isAllowedToMove = useMemo(() => selectedFolder.id !== undefined && (selectedFolder.id !== spaceInfo.current_id) , [selectedFolder, spaceInfo])
    
    return (
        <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            id="select-modal"
            tabindex="-1"
            aria-hidden="true"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-lg max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900 ">Move to {selectedFolder.name || 'unspecified folder.'}</h3>
                        <button
                            onClick={() => setIsMoveModalVisible(false)}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center "
                            data-modal-toggle="select-modal"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-2 text-start max-h-[400px] overflow-auto">
                        { folderPath.length !== 0 &&
                            <div
                            onClick={moveUp}
                            className="hover:bg-zinc-200 w-full p-2 rounded cursor-pointer no-select text-base whitespace-nowrap leading-none tracking-tight text-zinc-800 flex"
                                >
                                    <FontAwesomeIcon color="rgb(95, 99, 104)" icon={faArrowTurnUp} className="transform scale-x-[-1] w-4 h-4 mr-2"/>
                                    <div className=" font-semibold">. . .</div>
                            </div>
                        }
                        {folders.map((item) => (
                            <div
                                key={item.item_id}
                                onClick={() => moveDown(item.item_id, item.item_name)}
                                className={`${
                                    item.item_id === selectedFolder.id ? "bg-zinc-200" : "bg-white"
                                } hover:bg-zinc-200  no-select w-full p-2 rounded  cursor-pointer text-base whitespace-nowrap leading-none tracking-tight text-zinc-800 flex`}
                            >
                                {item?.item_type === "user" ? <FontAwesomeIcon  className="w-4 h-4 mr-2" icon={faHome}/> : item?.item_type === "share" ? <FontAwesomeIcon className=" w-4 h-4 mr-2"  icon={faListUl}/> :<img className=" w-4 h-4 mr-2" src={folderIcon} alt="" />}
                                {item.item_name}
                            </div>
                        ))}
                        {folders?.length === 0 && (
                            <div className="no-select flex items-center text-zinc-700">
                                There are no directories.
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                        <button
                            onClick={() => setIsMoveModalVisible(false)}
                            data-modal-hide="default-modal"
                            type="button"
                            className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 "
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmClick}
                            data-modal-hide="default-modal"
                            type="button"
                            className={`text-white bg-[#ffa270] hover:bg-[#ffa270]/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${!isAllowedToMove ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            Comfirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoveModal;
