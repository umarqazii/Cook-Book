import React, { useEffect, useState } from "react";
import { toolsOptions } from "../data/ArrayExports";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/cards";

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [celsius, setCelsius] = useState<number>(); // Corrected variable name
  const [fahrenheit, setFahrenheit] = useState<number>();

  // Function to handle the change in the dropdown menu
  const handleToolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption =
      toolsOptions.find((option) => option.value === selectedValue) || null;
    setSelectedTool(selectedOption);
  };

  const handleCelsiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const celsiusValue = Number(e.target.value);
    setCelsius(celsiusValue);
    setFahrenheit((celsiusValue * 9) / 5 + 32);
  };

  const handleFahrenheitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fahrenheitValue = Number(e.target.value);
    setFahrenheit(fahrenheitValue);
    setCelsius(((fahrenheitValue - 32) * 5) / 9);
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
            value={selectedTool?.value || ""}
          >
            <option value="" disabled>
              -- Select a Tool --
            </option>
            {toolsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {selectedTool === null ? (
          <div className="flex justify-center">
          <h1 className="text-white">No Tool Selected</h1>
          </div>
        ) : selectedTool.value === "Cel-to-Fah" ? (
          <div className="flex justify-center">
            <Card
              className="flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-1/2 h-96 bg-slate-800 p-0 m-0 border rounded-xl"
              style={{
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)", // Default shadow
              }}
            >
              <CardContent
                className="flex flex-col p-4"
                style={{ flexGrow: 1 }} // Allows content to grow and fill available space
              >
                <CardHeader className="text-center mb-4 flex justify-center">
                  <CardTitle className="text-white text-3xl font-bold text-center">
                    {selectedTool?.label}
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-col items-center justify-center space-y-4">
                  {" "}
                  {/* Added spacing between elements */}
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Celsius:</label>
                    <input
                      type="number"
                      value={celsius}
                      onChange={handleCelsiusChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Fahrenheit:</label>
                    <input
                      type="number"
                      value={fahrenheit}
                      onChange={handleFahrenheitChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <h1 className="text-white">Invalid Tool Selected</h1>
        )}
      </div>
    </div>
  );
};

export default Tools;
