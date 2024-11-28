import Select from "react-select";
import Checkbox from "./Checkbox";

const fakeData = [
    { value: "Company", label: "Company" },
    { value: "Development", label: "Development" },
    { value: "Support", label: "Support" },
];



// Custom styles for the react-select component
const customStyles = {
    control: (provided) => ({
        ...provided,
        minHeight: "36px",
        height: "36px",
        minWidth: "150px",
    }),
    valueContainer: (provided) => ({
        ...provided,
        height: "36px",
        padding: "0 8px",
    }),
    input: (provided) => ({
        ...provided,
        margin: "0",
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "36px",
    }),
};

export default function KeywordSelect({
    setKeyword,
    keyword,
    setFiltered,
    filtered,
}) {
    function handleCheckboxChange() {
        setFiltered(!filtered);
    }

    return (
        <div className="flex items-center gap-1">
            <Select
                styles={customStyles}
                value={keyword}
                options={fakeData}
                onChange={setKeyword}
            />
            <span>Filter</span>
            <Checkbox
                size="h-5 w-5"
                checked={filtered}
                onChange={handleCheckboxChange}
                color="bg-zinc-500"
            />
        </div>
    );
}
