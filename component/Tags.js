import React, { useState } from 'react';

const tags = [
    {
        name: "Important",
        count: 100,
        keyword: "Company",
        children: [
            { name: "Project B", count: 20, keyword: "Company", children: [] },
            { name: "Project A", count: 80, keyword: "Company", children: [] },
        ],
    },
    {
        name: "Urgent",
        count: 50,
        keyword: "Company",
        children: [
            { name: "Meeting Notes", count: 20, keyword: "Company", children: [] },
            { name: "Research", count: 30, keyword: "Company", children: [] },
        ],
    },
    {
        name: "Work",
        count: 80,
        keyword: "Support",
        children: [{ name: "Presentation", count: 80, keyword: "Support", children: [] }],
    },
    {
        name: "Travel",
        count: 20,
        keyword: "Support",
        children: [
            { name: "Archive", count: 20, keyword: "Company", children: [] },
            { name: "Confidential", count: 30, keyword: "Company", children: [] },
        ],
    },
    { name: "Finance", count: 30, keyword: "Development", children: [] },
];

function TagItem({ tag, handleTagsSelected, selectedParent, selectedTag }) {
    const isSelectedParent = selectedParent === tag.name;
    const isSelected = selectedTag === tag.name;

    const handleClick = () => {
        if (tag.children.length > 0) {
            handleTagsSelected(tag.name, null);
        } else {
            handleTagsSelected(selectedParent, tag.name);
        }
    };

    return (
        <div className='mt-1'>
            <div
                onClick={handleClick}
                className={`cursor-pointer flex items-center text-sm font-medium px-2.5 py-1 rounded-full 
                           hover:bg-gray-300 text-gray-500 gap-1 ${
                               isSelectedParent || isSelected ? "bg-gray-300" : "bg-gray-200"
                           }`}
            >
                {tag.name}
                <span className="text-zinc-700">({tag.count})</span>
            </div>
            {isSelectedParent && tag.children.length > 0 && (
                <div className="pl-4">
                    {tag.children.map((child, index) => (
                        <TagItem
                            key={index}
                            tag={child}
                            handleTagsSelected={handleTagsSelected}
                            selectedParent={selectedParent}
                            selectedTag={selectedTag}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Tags({ keyword }) {
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);

    function handleTagsSelected(parent, tag) {
        setSelectedParent(parent);
        setSelectedTag(tag);
    }

    return (
        <div className="flex flex-col gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2.5">
            {tags
                .filter(tag => tag.keyword === keyword)
                .map((item, index) => (
                    <TagItem
                        key={index}
                        tag={item}
                        handleTagsSelected={handleTagsSelected}
                        selectedParent={selectedParent}
                        selectedTag={selectedTag}
                    />
                ))}
        </div>
    );
}