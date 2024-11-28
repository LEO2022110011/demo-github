import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import service from "../utils/request";



export default function Progress({uploadList, setUploadList,getFileList, spaceInfo}) {
   async function handleUploadCloseAndCancel(key) {
        if(uploadList[key] && uploadList[key].value !== '100%') {
            uploadList[key].cancelToken.cancel('The upload is canceled')
            await service.post("/filer/delete", [uploadList[key].id]);
            await getFileList(spaceInfo.current_id);
        }
        const uploadListCopy = {...uploadList}
        delete uploadListCopy[key]
        setUploadList(uploadListCopy)
    }


    return <div className=" absolute w-96 z-10 right-2 bottom-2">
        {Object.keys(uploadList).map(item => <div key={item} className="bg-white rounded-md py-2 shadow p-2 mb-2 border">
            <div className=" text-left text-lg flex justify-between items-center mb-1">{uploadList[item].name}
                <FontAwesomeIcon onClick={() => handleUploadCloseAndCancel(item)} icon={faXmark} className=" cursor-pointer"/>
            </div>
            <div class="w-full bg-gray-200 rounded-full">
                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full duration-200" 
                    style={{width: uploadList[item].value === "0%" ? "5%" : uploadList[item].value}}>
                    {uploadList[item].value}</div>
            </div>
        </div>)}
    </div>
}