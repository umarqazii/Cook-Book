import React, { useEffect, useState } from "react";
import { toolsOptions } from "../data/ArrayExports";

const Tools = () => {
  const [selectedTool, setSelectedTool] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  // Function to handle the change in the dropdown menu
  const handleToolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption =
      toolsOptions.find((option) => option.value === selectedValue) || null;
    setSelectedTool(selectedOption);
  };

  return (
    <div className="bg-gray-700 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4 flex flex-col">
        <h1
          className="text-5xl text-white font-semibold text-center mb-5"
          style={{ fontFamily: '"Matemasie", cursive' }}
        >
          Tools
        </h1>
        <p className="text-white text-center mb-1">Select a Conversion Tool</p>
        <div className="flex justify-center mb-5">
          <select
            className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleToolChange}
          >
            <option value="">Select a Conversion Tool</option>
            {toolsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <h1>{selectedTool?.label}</h1>
      </div>
    </div>
  );
};

export default Tools;
