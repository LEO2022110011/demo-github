import { useContext, useMemo, useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faHeart,
    faCirclePlus,
    faTrash,
    faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import useFormValidation from "../utils/useFormValidation";
import service from "../utils/request";
import Select from "react-select";
import message from "../utils/message";
import { SpaceContext } from "../SpaceContext";
import Checkbox from "./Checkbox";
import { getFileExtension, removeFileExtension } from "../utils/file";
import KeywordsChipInput from "./KeywordsChipInput";
import FileClassSelect, { FILE_CLASSES } from "./FileClassSelect";

export default function PropertiesModal({
    setIsPropertiesModalVisible,
    itemInfo,
    getFileList,
    spaceInfo,
    setCurrentItem,
}) {
    const [currentTab, setCurrentTab] = useState("Properties");
    const tabs = useMemo(() => {
        const { is_folder } = itemInfo
      
        if (itemInfo.permissions.writable) {
            return ["Properties", is_folder ? "User Access" : "Share Link"]
        }
        return ["Properties"]
    },[itemInfo])

    return (
        <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            id="select-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow pb-4">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900 ">
                            Item Properties
                        </h3>
                        <button
                            onClick={() => setIsPropertiesModalVisible(false)}
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
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <ul className="  flex flex-wrap text-sm font-medium text-center text-gray-500 border-gray-200 pl-4 pt-2 absolute bg-white z-10">
                        {tabs.map((item) => (
                            <li key={item} onClick={() => setCurrentTab(item)}>
                                <span
                                    href="#"
                                    aria-current="page"
                                    className={`inline-block px-4 py-1 text-zinc-600
                                        rounded-t-lg active cursor-pointer  border-gray-300 border duration-200 transition-colors
                                        ${
                                            item === currentTab
                                                ? "bg-gray-white border-b-0"
                                                : "bg-gray-100"
                                        } 
                                        ${item === "Properties" && tabs.length === 2 && "border-r-0"}
                                        `}
                                >
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mx-4 mt-[36px]   space-y-2 text-start  h-[340px] py-2 px-2 border-gray-300 border  rounded-b-md rounded-tr-md overflow-y-auto">
                        {currentTab === "Properties" && (
                            <ProperitesContent
                                itemInfo={itemInfo}
                                getFileList={getFileList}
                                spaceInfo={spaceInfo}
                                setCurrentItem={setCurrentItem}
                                setIsPropertiesModalVisible={setIsPropertiesModalVisible}
                            />
                        )}
                        {currentTab === "User Access" && (
                            <UserAccessContent itemInfo={itemInfo} />
                        )}
                        {currentTab === "Share Link" && (
                            <ShareLinkContent itemInfo={itemInfo} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProperitesContent({ itemInfo, getFileList, spaceInfo, setCurrentItem, setIsPropertiesModalVisible }) {
    function getItemName(item) {
      return item.is_folder ? item.item_name : removeFileExtension(item.item_name);        
    }  

    // const [timeoutId, setTimeoutId] = useState(null);
    const [info, setInfo] = useState({
      ...itemInfo,
      item_name: getItemName(itemInfo),
      extension: getFileExtension(itemInfo?.item_name),
      file_class: 'general'
    });
    const keywords = info.keywords?.split(", ") || [];
    const fileClass = info.file_class
    // const inputName = useRef("")
    

    function handleMarkClick(value) {
        console.log(value);
        setInfo({ ...info, item_mark: value });
    }

    async function handleNameValueChange(e) {
        handleChange(e);
        const value = e.target.value;
        const [_, ...newKeywords] = keywords;
        setInfo({
          ...info,
          item_name: value,
          keywords: [value, ...newKeywords].join(", "),
        });

        // if (timeoutId) {
        //   clearTimeout(timeoutId);
        // }
        // if(!value) return
        // inputName.current = value
        // const id = setTimeout(async () => {
        //   const {keywords} = await service.post("/filer/get_updated_keywords", {
        //     item_id: info.item_id,
        //     new_name: value,
        //   });
        //   setInfo({...info, keywords, item_name: inputName.current})
        // }, 500);
        // setTimeoutId(id);
      };
    

    function handleKeywordsValueChange(keywords) {
      setInfo({ ...info, keywords: keywords.join(", ") });
    }

    function handleFileClassValueChange(fileClass) {
        setInfo({...info, file_class: fileClass})
    }

    const validation = (value) => {
        // empty validation
        console.log(value);
        
        if (!value) {
            return "Name is required.";
        }
        return "";
    };
    
    const { handleChange, handleSubmit, error } = useFormValidation(
        validation,
        itemInfo?.item_name
    );

    async function handleSaveClick(e) {
        e.preventDefault();
        const validationError = handleSubmit();
        if (validationError) return;
        
        try {
            message("loading", "Saving now...");
            await service.post("/filer/rename", {
                item_id: info.item_id,
                new_name: info.item_name +  (!info.is_folder ? `.${info.extension}` : ""),
                new_mark: parseInt(info.item_mark),
                keywords: info.keywords,
            });
            // const result =  await service.get('/filer/item/'+ info.item_id)
            // setCurrentItem(result)
            message("success", "Save successfully");
            setIsPropertiesModalVisible(false)
            await getFileList(spaceInfo.current_id);
        } catch (error) {
            message("error", error);
        }
    }

    const colorMap = {
        0: "",
        1: "#ABEBC6",
        2: "#F9E79F",
        3: "#F8C471",
        4: "#EC7063",
        5: "#CB4335",
        6: "#7D3C98",
        7: "#dc2626",
    };
    return (
        <div>
            <div className=" relative">
                <label className="text-left block mb-2 text-sm font-medium text-gray-900">
                    Name
                </label>
                <input
                    className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="file or folder name"
                    required
                    value={info?.item_name}
                    onChange={handleNameValueChange}
                />
                {error && (
                    <div className="err-msg" style={{ bottom: -22 }}>
                        {error}
                    </div>
                )}
            </div>
            <div className="mt-[22px]">
                <FileClassSelect fileClasses={FILE_CLASSES} selected={fileClass} onFileClassSelect={handleFileClassValueChange}/>
            </div>
            <div className="mt-4">
                <KeywordsChipInput keywords={keywords} onKeywordsChange={handleKeywordsValueChange}/>
            </div>
            <div className="mt-4">
                <label className="text-left block mb-2 text-sm font-medium text-gray-900">
                    Favor
                </label>
                <div className="flex gap-4">
                    {Object.keys(colorMap).map((item) => {
                        return parseInt(item) >= 7 ? (
                            <div
                                key={item}
                                onClick={(e) => handleMarkClick(item)}
                                className={`flex cursor-pointer justify-center items-center transition transform hover:scale-110 w-5 h-5 rounded-full duration-200`}
                            >
                                <FontAwesomeIcon
                                    color={colorMap[item]}
                                    className="w-5 h-5"
                                    icon={
                                        item == info?.item_mark
                                            ? faHeart
                                            : farHeart
                                    }
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => handleMarkClick(item)}
                                key={item}
                                className={`flex cursor-pointer  justify-center items-center transition transform hover:scale-110 w-5 h-5 rounded-full duration-200`}
                                style={{
                                    backgroundColor: colorMap[item],
                                    border:
                                        item === "0"
                                            ? "2px solid #8e8d92"
                                            : "none",
                                }}
                            >
                                {item == info?.item_mark && (
                                    <FontAwesomeIcon
                                        color={
                                            info?.item_mark == 0
                                                ? "#8e8d92"
                                                : "#fff"
                                        }
                                        className="w-3 h-3"
                                        icon={faCheck}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end items-center space-x-2 rounded-b pr-2">
                <button
                    onClick={handleSaveClick}
                    data-modal-hide="default-modal"
                    type="button"
                    className={`text-white bg-[#ffa270] hover:bg-[#ffa270]/80 font-medium rounded-lg text-sm px-4 py-[8px] text-center}`}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

function UserAccessContent({ itemInfo }) {
    const { users } = useContext(SpaceContext);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [accessUsers, setAccessUsers] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const handleSelectOpen = () => {
      setIsSelectOpen(true);
    };
    const handleSelectClose = () => {
      setIsSelectOpen(false);
    };


    const handleCheckboxChange = (isAll, index) => {
        const accessUsersSlice = [...accessUsers];
        if (isAll) {
            const result = accessUsers.map((user) => ({
                ...user,
                isSelected: !user.isSelected,
            }));
            setIsChecked(!isChecked);
            setAccessUsers(result);
        } else {
            accessUsersSlice[index] = {
                ...accessUsersSlice[index],
                isSelected: !accessUsersSlice[index].isSelected,
            };
            setAccessUsers(accessUsersSlice);
        }
    };

    const options = useMemo(() => {
        return users.map((item) => ({
            value: item.user_id,
            label: item.email,
        }));
    }, [users]);

    function handleUserSelect(value) {
        setSelectedUsers(value);
    }

    async function getAccessUsers() {
        service
            .get("/filer/get_access_users/" + itemInfo?.item_id)
            .then(setAccessUsers);
    }

    async function handleAddBtnClick() {
        if (selectedUsers?.length === 0) {
            message("error", "There is no users be selected");
            return;
        }
        try {
            message("loading", "Giving users access now...");
            await service.post("/filer/give_access", {
                item_id: itemInfo?.item_id,
                user_ids: selectedUsers.map((user) => user.value) || [],
            });
            setSelectedUsers([]);
            setIsChecked(false);
            await getAccessUsers();
            message("success", "Add users successfully");
        } catch (error) {
            message("error", error);
        }
    }

    async function removeAccess() {
        const selectedAccessUsers = accessUsers.filter(
            (item) => item.isSelected
        );

        if (selectedAccessUsers?.length === 0) {
            message("error", "There is no users be selected");
            return;
        }
        try {
            message("loading", "Removing users access now...");
            await service.post("/filer/remove_access", {
                item_id: itemInfo?.item_id,
                user_ids: selectedAccessUsers.map((user) => user.user_id) || [],
            });
            setIsChecked(false);
            await getAccessUsers();
            message("success", "Remove users successfully");
        } catch (error) {
            message("error", error);
        }
    }

    useEffect(() => {
        getAccessUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`h-full ${isSelectOpen ? "" : "overflow-auto"}`}>
            <div>
                <label className="text-left block mb-2 text-sm font-medium text-gray-900">
                    Name
                </label>
                <div className="flex gap-6">
                    <Select
                        // defaultValue={[colourOptions[2], colourOptions[3]]}
                        isMulti={true}
                        options={options}
                        className="basic-multi-select w-full"
                        classNamePrefix="select"
                        onChange={handleUserSelect}
                        value={selectedUsers}
                        onMenuOpen={handleSelectOpen}
                        onMenuClose={handleSelectClose}
                        isOpen={isSelectOpen}
                    />
                    <button
                        onClick={handleAddBtnClick}
                        data-modal-hide="default-modal"
                        type="button"
                        className={`text-white h-[38px] flex items-center gap-2 bg-[#ffa270] hover:bg-[#ffa270]/80 font-medium rounded-md text-sm px-4 py-[8px] text-center}`}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} />
                        Add
                    </button>
                </div>
            </div>
            <div className="w-full border-b-2 mt-4 border-gray-300 "></div>
            <div className="mt-4">
                <div className="text-left  mb-2 text-sm font-medium text-gray-900 flex justify-between">
                    User Access
                    <button
                        onClick={removeAccess}
                        data-modal-hide="default-modal"
                        type="button"
                        className={`text-white flex items-center gap-2 bg-red-500 hover:bg-red-500/80 font-medium rounded-md text-sm px-4 py-[8px] text-center}`}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                </div>
                <div className="h-44  rounded-md">
                    <div className="h-7  flex bg-zinc-200">
                        <div className="w-10 flex items-center pl-2">
                            <Checkbox
                                onChange={() => handleCheckboxChange(true)}
                                size=" h-5 w-5"
                                color="bg-zinc-500"
                                checked={isChecked}
                            />
                        </div>
                        <div className="flex-1 pl-4 text-zinc-800 flex items-center">
                            Name
                        </div>
                    </div>
                    <div className=" h-[148px] overflow-auto">
                        {accessUsers.map((item, index) => (
                            <div
                                key={item?.id}
                                className={`h-8  flex items-center ${
                                    (index + 1) % 2 === 0 ? "" : "bg-zinc-100"
                                } `}
                            >
                                <div className="w-10 flex items-center pl-2">
                                    <Checkbox
                                        checked={item.isSelected}
                                        onChange={() =>
                                            handleCheckboxChange(false, index)
                                        }
                                        size=" h-5 w-5"
                                        color="bg-zinc-500"
                                    />
                                </div>
                                <div className="flex-1 pl-4 text-zinc-800">
                                    {item?.email}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShareLinkContent({ itemInfo }) {
    const [links, setLinks] = useState([]);

    async function getShareLinks() {
        service
            .get("/filer/get_shared_links/" + itemInfo.item_id)
            .then(setLinks);
    }

    useEffect(() => {
        getShareLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function generateShareLink() {
        try {
            message("loading", "Creating share link now...");
            const res = await service.post("/filer/generate_sharelink", {
                item_id: itemInfo.item_id,
            });
            message("success", "Create share link successfully");
            setLinks([res, ...links]);
        } catch (error) {
            message("error", error);
        }
    }

    function fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
    
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
    
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
    
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
    
      document.body.removeChild(textArea);
    }

    const handleCopy = async (text) => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            fallbackCopyTextToClipboard(text)
          }
          message("success", "Copy Successfully!");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleDelete = async (linkId) => {
        message("loading", "Deleting now");
        await service.post("/filer/delete_shared_link", {
            item_id: itemInfo.item_id,
            link_ids: [linkId],
        });
        await getShareLinks();
        message("success", "Delete Link Successfully");
    };

    return (
        <div>
            <div>
                <label className="text-left  mb-2 text-sm font-medium text-gray-900 flex justify-between">
                    Your Pervious Link
                    <button
                        onClick={generateShareLink}
                        data-modal-hide="default-modal"
                        type="button"
                        className={`text-white flex items-center gap-2 bg-[#ffa270] hover:bg-[#ffa270]/80 font-medium rounded-md text-sm px-4 py-[8px] text-center}`}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} />
                        Create New Link
                    </button>
                </label>
            </div>
            <div className=" h-60  mt-4 border-2 border-gray-300 rounded overflow-auto px-4 py-2">
                {links.map((item) => (
                    <div
                        key={item.id}
                        className="mb-1 cursor-pointer text-zinc-700 w-full flex items-center justify-between "
                    >
                        <div
                            onClick={() =>
                                handleCopy(window.location.origin + item.link)
                            }
                            title={window.location.origin + item.link}
                            className="w-[85%] border-b border-gray-800 overflow-hidden whitespace-nowrap text-ellipsis"
                        >
                            {window.location.origin + item.link}
                        </div>
                        <div className=" flex gap-2">
                            <FontAwesomeIcon
                                icon={faCopy}
                                onClick={() =>
                                    handleCopy(
                                        window.location.origin + item.link
                                    )
                                }
                                title="Copy"
                                className="w-5 h-5 cursor-pointer text-zinc-600"
                            />
                            <FontAwesomeIcon
                                icon={faTrash}
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                                className="w-5 h-5 cursor-pointer text-zinc-600"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
