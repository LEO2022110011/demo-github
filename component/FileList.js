import { getFileExtension } from "../utils/file";
import Itemcard from "./Itemcard";
import service from "../utils/request";
import message from "../utils/message";

const FileList = ({view, fileList, extensions, handleItemClick, openFolder, spaceInfo, getFileList, setPath,setIsPropertiesModalVisible, setCurrentItem,selectedItems }) => {

    async function handleOpen(item) {
        const { item_id, item_name, is_folder } = item;
        if (is_folder) {
            openFolder({item_id, item_name});
            return;
        } 

        const extension = getFileExtension(item_name);
        
        // if (['txt','md'].includes(extension)) {
        //    window.open('/markdown?file_id=' + item_id);
        //    return;
        // }
        if (extensions.includes(extension)) {
            try {
                const res = await service.get("/filer/edit/" + item_id);
                window.open(`${res.editor}?WOPISrc=${res.wopisrc}/${item_id}?access_token=${res.access}`);
            } catch (error) {
                message("error", "File not found: " + item_id);
            }
            return;
        } else {
          window.open(`/filer/open/${item_id}`);
        }

    }

    return fileList?.map((card) => (
        <Itemcard
            key={card.item_id}
            item={card}
            handleItemClick={handleItemClick}
            spaceInfo={spaceInfo}
            handleOpen={handleOpen}
            getFileList={getFileList}
            openFolder={openFolder}
            setPath={setPath}
            setIsPropertiesModalVisible={setIsPropertiesModalVisible}
            setCurrentItem={setCurrentItem}
            view={view}
					  selectedItems={selectedItems}
        />
    ));
}

export default FileList;
