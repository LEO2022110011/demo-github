import { useContext } from "react";
import folderIcon from "../assets/icons/folder.svg";
import { lessPropertyToIconMap } from "../utils/file";
import useFormValidation from "../utils/useFormValidation";
import service from "../utils/request";
import message from "../utils/message";
import { SpaceContext } from "../SpaceContext";


function CustomSelect({selectApp}) {
    const options = [
        { value: '', label: 'Folder' },
        { value: 'writer', label: 'writer' },
        { value: 'calc', label: 'calc' },
        { value: 'impress', label: 'impress' },
        { value: 'draw', label: 'draw' },
        { value: 'markdown', label: 'markdown'}
    ];

    return (
        <div className="flex h-10 w-full items-center pt-2">
            {options.map(option => 
                <a title={option.label} className={`${option.value ? 'w-9' : 'w-10'}`} href="/#" onClick={(e) => selectApp(e, option.value)}>
                    {lessPropertyToIconMap[option.label] ||
                    <img className="w-6 h-6 inline-block mb-[3px] hover:w-7 hover:h-7 duration-200" src={folderIcon} alt=""/>}
                </a>
            )}
        </div>
    )
}

function NewFileModal({ setIsNewFileVisible, spaceInfo, getFileList, openFolder }) {

    const { coolApps } = useContext(SpaceContext);

    const validation = (value) => {
        // empty validation
        if (!value) {
            return "name is required.";
        }
        // same name validation, not necessary, we support duplicate filename.
        //if (fileList.some((file) => file.item_name === value + (type && `.${type}`))) {
        //  return "There is an item with the same name.";
        // }
        return "";
    };

    const { handleChange, handleSubmit, value, error } = useFormValidation(validation);

    async function selectApp(e, key) {
        e.preventDefault()
        let type = coolApps[key]?.extensions[0] || ""
        if(key === 'markdown') type = 'txt'
        const validationError = handleSubmit()
        if(validationError) return

        try {
            message("loading", "Creating now...")
            const res = await service.post("/filer/new", {
                folder_id: spaceInfo.folder_id === '' ? spaceInfo.space_id : spaceInfo.folder_id,
                file_name: value,
                file_type: (type && `${type}`) || ""
            })
            const {item_id, item_name} = res
            setIsNewFileVisible(false)
            if(res.is_folder) {
                await openFolder({item_id, item_name})
                message("success", "Create successfully")
            } else {
                const res = await service.get("/filer/edit/" + item_id);
                message("success", "Create successfully")
                getFileList(spaceInfo.current_id)
                window.open(`${res.editor}?WOPISrc=${res.wopisrc}/${item_id}?access_token=${res.access}`);
            }
        } catch (error) {
            message("error", error)
        }
    }

    return (
        <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            id="select-modal"
            tabindex="-1"
            aria-hidden="true"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow ">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900 ">New Item</h3>
                        <button
                            onClick={() => setIsNewFileVisible(false)}
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
                    <div className="p-6 space-y-2 text-start w-[416px] h-[190px]">
                        {/* <label for="countries" className="block text-sm font-medium text-gray-900">File oName</label>
                */}
                        <input onChange={handleChange} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none rounded-lg py-2.5 px-2 block w-full p-2." required />
                        {error && (
                            <div className="err-msg" style={{ bottom: 35 }}>
                                {error}
                            </div>
                        )}
                        <label for="countries" className="block text-sm font-medium text-gray-900">Click a file type to continue</label>
                        <CustomSelect selectApp={selectApp}/>
                    </div>
                    <div class="flex justify-end items-center p-4 space-x-2 border-t border-gray-200 rounded-b">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFileModal;
