import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListUl,
  faClock,
  faTrashCan,
  faMagnifyingGlass,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "../utils/string";

// Helper function with object lookup for space class and id
const spaceIcons = {
  user: faHome,
  search: faMagnifyingGlass,
  recent: faClock,
  trash: faTrashCan,
  favour: faHeart,
  tasks: faListUl,
};

function getSpaceIcon(spaceClass, spaceId) {
  // Use space class first, fallback to space id, or default to faListUl

  const icon = spaceIcons[spaceClass] || spaceIcons[spaceId]

  if (!icon) throw new Error(`No icon found with spaceClass: ${spaceClass} and spaceId: ${spaceId}`);

  return icon;
}

export function SpaceIcon({ space, isSelected }) {
  return (
    <FontAwesomeIcon
      icon={getSpaceIcon(space.class, space.id)}
      className={cn("w-5 h-5 text-gray-500", isSelected && "text-current")}
    />
  );
}

function Space({ space, isSelected }) {
  return (
    <div
      className={cn(
        "flex rounded-r-full transition items-center p-2 text-gray-900 text-sm font-normal hover:bg-[#ededed] cursor-pointer group relative",
        isSelected &&
          "bg-gray-200 font-semibold before:absolute before:h-full before:w-1 before:bg-[#ffa270] before:-left-1"
      )}
    >
      <SpaceIcon space={space} isSelected={isSelected} />
      <span className="ms-3">{space.caption}</span>
    </div>
  );
}

const Sidebar = ({ spaces, switchSpace }) => {
  const [currentSpaceId, setCurrentSpaceId] = useState("");

  useEffect(() => {
    const sessionPath = sessionStorage.getItem("path");
    if (sessionPath) {
      const pathParse = JSON.parse(sessionPath);
      setCurrentSpaceId(pathParse[0]?.id);
      return;
    }
    if (spaces) {
      setCurrentSpaceId(spaces[0]?.id);
    }
  }, [spaces]);

  function handleSpaceChange(space) {
    setCurrentSpaceId(space.id);
    switchSpace(space);
  }

  return (
    <aside
      id="default-sidebar"
      className="z-[5] w-56 h-screen fixed transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 ">
        <ul className="space-y-2 font-mediumpy-2">
          {spaces.map((space) => (
            <li key={space.id} onClick={() => handleSpaceChange(space)}>
              <Space isSelected={space.id === currentSpaceId} space={space} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
