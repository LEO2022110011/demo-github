import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

/**
 * Represents a file class object.
 * 
 * @typedef {Object} FileClass
 * @property {number} id - The unique identifier of the file class.
 * @property {string} value - The lowercase value representing the file class.
 * @property {string} label - The capitalized label of the file class.
 */

/**
 * FileClassSelect component renders a dropdown select menu for choosing a file class.
 *
 * @param {Object} props - The component props.
 * @param {FileClass[]} [props.fileClasses=[]] - Array of file class options. Each option is an object containing `id`, `value`, and `label`.
 * @param {string} props.selected - The currently selected file class value.
 * @param {function} props.onFileClassSelect - Callback function invoked when a file class is selected.
 * 
 * @returns {JSX.Element} The rendered FileClassSelect component.
 */
export default function FileClassSelect({fileClasses=[], selected, onFileClassSelect}) {

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Class
      </label>
      <Select value={selected} onValueChange={onFileClassSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={!selected && "Select a class"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {fileClasses.map(item => (<SelectItem key={item.id} value={item.value}>{item.label}</SelectItem>))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Returns an array of file class objects.
 * This array is a placeholder and should be replaced by an API call provided by the backend.
 * 
 * @returns {FileClass[]} Array of file class objects.
 */
export const FILE_CLASSES = [
  { id: 0, value: "general", label: "General" },
  { id: 1, value: "hr", label: "Hr" },
  { id: 2, value: "internal", label: "Internal" },
  { id: 3, value: "drafts", label: "Drafts" },
  { id: 4, value: "archived", label: "Archived" },
  { id: 5, value: "finance", label: "Finance" },
  { id: 6, value: "legal", label: "Legal" },
  { id: 7, value: "marketing", label: "Marketing" },
  { id: 8, value: "sales", label: "Sales" },
  { id: 9, value: "operations", label: "Operations" },
  { id: 10, value: "miscellaneous", label: "Miscellaneous" },
  { id: 11, value: "it", label: "It" },
  { id: 12, value: "research", label: "Research" },
  { id: 13, value: "development", label: "Development" },
  { id: 14, value: "support", label: "Support" },
  { id: 15, value: "customer_service", label: "Customer Service" },
];