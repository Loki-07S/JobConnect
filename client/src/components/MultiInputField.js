import React, { useState } from 'react';

const MultiInputField = ({ title, values = [], onChange }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      const updated = [...values, input.trim()];
      onChange(updated);
      setInput('');
    }
  };

  const handleDelete = (index) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{title}</label>
      
      {/* Display entered items */}
      <ul className="mb-2 space-y-1">
        {values.map((item, index) => (
          <li
            key={index}
            className="bg-blue-50 px-4 py-2 rounded flex justify-between items-center text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Input Field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add ${title.toLowerCase()}`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MultiInputField;
