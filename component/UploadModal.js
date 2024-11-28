import { useRef } from "react";
import uploadIcon from "../assets/icons/upload.svg";

function UploadModal({ getFileList, spaceInfo, setIsVisible, upload, checkExists }) {
    const uploadRef = useRef(null);

    async function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation()
        const files = e.dataTransfer?.files;
        if (files) {
            for (var i = 0; i < files.length; i++) {
              const result =await checkExists(files[i])
              if(!result) {
                upload(files[i])
              }
            }
        }
    };
    
    async function handleFileChange(e) {
        const { files } = e.target;
        if (files) {
            const result =await checkExists(files[0])
            if(!result) {
              upload(files[0]);
            }
            if (uploadRef.current) {
                uploadRef.current.value = "";
            }
        }
    };

    function handleFileChoosen() {
        if (uploadRef.current) {
            uploadRef.current.click();
        }
    };

    return (
        <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            id="select-modal"
            tabindex="-1"
            aria-hidden="true"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow pb-4">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900 ">Upload your file</h3>
                        <button
                            onClick={() => setIsVisible(false)}
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
                    <div
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        className="w-80 h-56 bg-slate-50 rounded-xl border-2 border-blue-300 mx-auto mt-7 border-dashed border-spacing-6"
                    >
                        <img src={uploadIcon} alt="" className="mx-auto mt-9" />
                        <div className="text-gray-400 text-xs font-medium text-center mt-9">
                            Drag & Drop your file here
                        </div>
                    </div>
                    <div className="text-gray-400 text-xs font-medium text-center mt-2">
                        Or
                    </div>
                    <input
                        onChange={handleFileChange}
                        type="file"
                        ref={uploadRef}
                        className="hidden"
                    />
                    <button
                        onClick={handleFileChoosen}
                        className="w-24 h-8 bg-blue-500 hover:bg-blue-700 rounded-lg text-center text-white text-xs font-medium mx-auto mt-2 block transition duration-200"
                    >
                        Choose a file
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
