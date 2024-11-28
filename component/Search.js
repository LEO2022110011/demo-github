import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDebouncedCallback } from "use-debounce";
import service from "../utils/request";
import message from "../utils/message";

function Search({ setFileList }) {

    const handleSearch = useDebouncedCallback(
        async (e) => {
            const value = e.target.value.trim();
            try {
                const result = await service.post("/filer/search", {
                    query: value,
                });
                setFileList(result || []);
            } catch (error) {
                message("error", error);
            }
        }, 1000
    );

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (
        <form className="w-full">
            <label
                for="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only "
            >
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="texg-base" />
                </div>
                <input
                    onChange={handleSearch}
                    type="search"
                    id="default-search"
                    onKeyUp={handleKeyPress}
                    onKeyDown={handleKeyPress}
                    className="block w-full p-2 ps-10 text-sm text-gray-900 rounded-lg bg-[#e9eef6] outline-none focus:bg-white focus:shadow focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search Folder, Files..."
                />
            </div>
        </form>
    );
};

export default Search;
