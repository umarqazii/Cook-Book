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

  const [celsius, setCelsius] = useState<number>();
  const [fahrenheit, setFahrenheit] = useState<number>();
  const [grams, setGrams] = useState<number>();
  const [ounces, setOunces] = useState<number>();
  const [cups, setCups] = useState<number>();
  const [tablespoons, setTablespoons] = useState<number>();
  const [teaspoons, setTeaspoons] = useState<number>();
  const [gallons, setGallons] = useState<number>();
  const [liters, setLiters] = useState<number>();

  // Function to handle the change in the dropdown menu
  const handleToolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption =
      toolsOptions.find((option) => option.value === selectedValue) || null;
    setSelectedTool(selectedOption);
  };

  const handleGallonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gallonsValue = Number(e.target.value);
    setGallons(gallonsValue);
    setCups((gallonsValue * 16));
    setOunces((gallonsValue * 128));
    setLiters((gallonsValue * 3.78541));
  }

  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const litersValue = Number(e.target.value);
    setLiters(litersValue);
    setGallons((litersValue / 3.78541));
    setCups((litersValue * 4.22675));
    setOunces((litersValue * 33.814));
  }

  const handleTeaspoonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const teaspoonsValue = Number(e.target.value);
    setTeaspoons(teaspoonsValue);
    setCups((teaspoonsValue / 48));
    setOunces((teaspoonsValue / 6));
  }

  const handleCupsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cupsValue = Number(e.target.value);
    setCups(cupsValue);
    setTablespoons((cupsValue * 16));
    setTeaspoons((cupsValue * 48));
    setOunces((cupsValue * 8));
    setGallons((cupsValue / 16));
    setLiters((cupsValue / 4.22675));
  }

  const handleTablespoonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tablespoonsValue = Number(e.target.value);
    setTablespoons(tablespoonsValue);
    setCups((tablespoonsValue / 16));
    setOunces((tablespoonsValue / 2));
  }

    const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gramsValue = Number(e.target.value);
    setGrams(gramsValue);
    setOunces((gramsValue / 28.34952) );
  };

  const handleOuncesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ouncesValue = Number(e.target.value);
    setOunces(ouncesValue);
    setGrams((ouncesValue * 28.34952));
    setCups((ouncesValue / 8));
    setTablespoons((ouncesValue * 2));
    setTeaspoons((ouncesValue * 6));
    setGallons((ouncesValue / 128));
    setLiters((ouncesValue / 33.814));
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

  // Helper function to convert decimal to fraction
  const decimalToFraction = (decimal: number): string => {
    const gcd = (a: number, b: number): number => {
      return b ? gcd(b, a % b) : a;
    };

    const len = decimal.toString().length - 2;
    const denominator = Math.pow(10, len);
    const numerator = decimal * denominator;
    const divisor = gcd(numerator, denominator);

    const fraction = Math.floor(numerator / divisor) + '/' + Math.floor(denominator / divisor);
    
    // To handle cases like 1.0 showing as "1/1"
    if (fraction === "1/1") return "1";

    return fraction;
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
        ) : selectedTool.value === "dry-gm-to-oz" ? (
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
                    <label className="text-white mb-1">Grams:</label>
                    <input
                      type="number"
                      value={grams}
                      onChange={handleGramsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Ounces:</label>
                    <input
                      type="number"
                      value={ounces}
                      onChange={handleOuncesChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "dry-cup-to-tbsp" ? (
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
                    <label className="text-white mb-1">Cups:</label>
                    <input
                      type="number"
                      value={cups}
                      onChange={handleCupsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Tablespoons:</label>
                    <input
                      type="number"
                      value={tablespoons}
                      onChange={handleTablespoonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "dry-cup-to-tsp" ? (
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
                    <label className="text-white mb-1">Cups:</label>
                    <input
                      type="number"
                      value={cups}
                      onChange={handleCupsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                    {/* display cups in fractions */}
                    <p className="text-white text-center">{cups ? decimalToFraction(cups) : ""}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Teaspoons:</label>
                    <input
                      type="number"
                      value={teaspoons}
                      onChange={handleTeaspoonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "dry-cup-to-oz" ? (
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
                    <label className="text-white mb-1">Cups:</label>
                    <input
                      type="number"
                      value={cups}
                      onChange={handleCupsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                    {/* display cups in fractions */}
                    <p className="text-white text-center">{cups ? decimalToFraction(cups) : ""}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Ounces:</label>
                    <input
                      type="number"
                      value={ounces}
                      onChange={handleOuncesChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )  : selectedTool.value === "dry-tbsp-to-oz" ? (
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
                    <label className="text-white mb-1">Tablespoons:</label>
                    <input
                      type="number"
                      value={tablespoons}
                      onChange={handleTablespoonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Ounces:</label>
                    <input
                      type="number"
                      value={ounces}
                      onChange={handleOuncesChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "dry-tsp-to-oz" ? (
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
                    <label className="text-white mb-1">Teapoons:</label>
                    <input
                      type="number"
                      value={teaspoons}
                      onChange={handleTeaspoonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Ounces:</label>
                    <input
                      type="number"
                      value={ounces}
                      onChange={handleOuncesChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "fluid-gal-to-cup" ? (
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
                    <label className="text-white mb-1">Gallons:</label>
                    <input
                      type="number"
                      value={gallons}
                      onChange={handleGallonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Cups:</label>
                    <input
                      type="number"
                      value={cups}
                      onChange={handleCupsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "fluid-gal-to-oz" ? (
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
                    <label className="text-white mb-1">Gallons:</label>
                    <input
                      type="number"
                      value={gallons}
                      onChange={handleGallonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Ounces:</label>
                    <input
                      type="number"
                      value={ounces}
                      onChange={handleOuncesChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "fluid-gal-to-liter" ? (
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
                    <label className="text-white mb-1">Gallons:</label>
                    <input
                      type="number"
                      value={gallons}
                      onChange={handleGallonsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Liters:</label>
                    <input
                      type="number"
                      value={liters}
                      onChange={handleLitersChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "fluid-cup-to-liter" ? (
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
                    <label className="text-white mb-1">Cups:</label>
                    <input
                      type="number"
                      value={cups}
                      onChange={handleCupsChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Liters:</label>
                    <input
                      type="number"
                      value={liters}
                      onChange={handleLitersChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedTool.value === "fluid-oz-to-litre" ? (
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
                    <label className="text-white mb-1">Ounces:</label>
                    <input
                      type="number"
                      value={ounces}
                      onChange={handleOuncesChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 " // Added width and border for better appearance
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Liters:</label>
                    <input
                      type="number"
                      value={liters}
                      onChange={handleLitersChange}
                      className="p-2 rounded bg-gray-200 border border-gray-400 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500" // Added width and border for better appearance
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )  :(
          <h1 className="text-white">Invalid Tool Selected</h1>
        )}
      </div>
    </div>
  );
};

export default Tools;
