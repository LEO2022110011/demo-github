import React, { useState } from "react";
import { cn } from "../utils/string";

export default function KeywordsChipInput({ keywords, onKeywordsChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      if (!keywords.includes(inputValue)) {
        onKeywordsChange([...keywords, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    const index = keywords.findIndex((item) => item === keywordToDelete);
    if (index === 0) return 0;

    onKeywordsChange(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBackspace = (e) => {
    // If the input is empty and backspace is pressed, remove the last keyword
    if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      handleDeleteKeyword(keywords[keywords.length - 1]);
    }
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Keywords
      </label>
      <div className="flex items-center flex-wrap gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2.5 has-[:focus]:ring-blue-500 has-[:focus]:border-blue-500">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center text-sm font-medium px-2.5 py-1 rounded-full",
              index === 0
                ? "bg-gray-200 text-gray-500"
                : "bg-blue-100 text-blue-700"
            )}
          >
            {keyword}
            <button
              onClick={() => handleDeleteKeyword(keyword)}
              disabled={index === 0}
              className="ml-2 text-blue-500 hover:text-blue-800 disabled:pointer-events-none disabled:text-gray-400"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            handleBackspace(e);
            handleAddKeyword(e);
          }}
          placeholder="Enter a keyword and press enter"
          className="flex-grow bg-transparent outline-none text-sm px-2.5 py-1"
        />
      </div>
    </div>
  );
}
