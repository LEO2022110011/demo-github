import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Sort({sortOrder, setSortOrder}) {

    function toggleSortOrder() {
        setSortOrder({ ...sortOrder, order: sortOrder.order === "asc" ? "desc" : "asc" });
    }

    function toggleSortField() {
        setSortOrder({ ...sortOrder, field: sortOrder.field === "Name" ? "Date" : "Name" });
    }
    
    return (
        <div className="flex text-sm  items-center translate-y-[-1px]">
            <div
                className="bg-[#ededed] hover:bg-zinc-200 mr-1 py-1 w-[72px] text-zinc-700 cursor-pointer rounded duration-200"
                onClick={toggleSortField}
            >
                {sortOrder.field}
            </div>
            <div onClick={toggleSortOrder} className="cursor-pointer rounded-full w-8 h-8 flex justify-center items-center duration-200 hover:bg-[#ededed]">
                <FontAwesomeIcon
                    icon={faArrowDown}
                    className={` duration-200 ${sortOrder.order === "asc" ? "rotate-180" : ""}`}
                />
            </div>
        </div>
    );
};

export default Sort;
