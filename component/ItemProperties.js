import React from 'react';

const ItemProperties = ({ isOpen, onClose, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Item Properties</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Properties Section */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Properties</div>
            <input
              type="text"
              value={item?.item_name || ''}
              readOnly
              className="w-full p-2 border rounded bg-gray-50"
            />
          </div>

          {/* Class Section */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Class</div>
            <div className="relative">
              <input
                type="text"
                value="General"
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                ▼
              </span>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Keywords</div>
            <div className="p-2 border rounded bg-gray-50">
              <div className="inline-block bg-gray-200 rounded px-2 py-1 text-sm mr-2">
                Document Server Rework
                <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
              </div>
              <input
                type="text"
                placeholder="Enter a keyword and press enter"
                className="border-none bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Favor Section */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Favor</div>
            <div className="flex space-x-2">
              <button className="w-6 h-6 rounded-full border border-gray-300"></button>
              <button className="w-6 h-6 rounded-full bg-green-200"></button>
              <button className="w-6 h-6 rounded-full bg-yellow-200"></button>
              <button className="w-6 h-6 rounded-full bg-orange-200"></button>
              <button className="w-6 h-6 rounded-full bg-red-200"></button>
              <button className="w-6 h-6 rounded-full bg-red-400"></button>
              <button className="w-6 h-6 rounded-full bg-purple-400"></button>
              <button className="w-6 h-6 rounded-full bg-white border border-gray-300">
                <span className="text-red-500">♥</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemProperties; 