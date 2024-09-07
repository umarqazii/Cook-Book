import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar";
import "primeicons/primeicons.css";
import { imageDB } from "../lib/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useResponsive } from "../styling/useResponsive";

const AddRecipe = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const breakpoints = [480, 768, 1279]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const [img, setImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>();
  const [selectedFilename, setSelectedFilename] = useState<string>("");
  const [fileEncodedName, setFileEncodedName] = useState<string>("");
  const [recipeName, setRecipeName] = useState<string>("");
  const [ingredientLines, setIngredientLines] = useState<string[]>([]);
  const [cuisineType, setCuisineType] = useState<string>("");
  const [dishType, setDishType] = useState<string>("");
  const [mealType, setMealType] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([]);
  let toastid = "";

  // to get the image using it's name
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchImageUrl = async () => {
    try {
      const imgRef = ref(imageDB, `files/${fileEncodedName}`); // Construct the reference to the image
      const url = await getDownloadURL(imgRef); // Get the download URL
      setImageUrl(url); // Set the URL in state to display the image
      console.log(url);
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

  const fileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle the file change event
  // Handle file change event and generate UUID-encoded file name
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const encodedName = v4(); // Generate UUID for the file
      setFileEncodedName(encodedName); // Store UUID in the state
      console.log(`Encoded Name: ${encodedName}`);
      setFile(selectedFile); // Store the selected file
      setImg(URL.createObjectURL(selectedFile)); // Create a preview image URL
      console.log(`File Name: ${selectedFile.name}`);
      setSelectedFilename(selectedFile.name);
      toast.success("File selected successfully!");
    }
  };

  // Upload file to Firebase using the UUID-encoded name
  const handleUpload = () => {
    return new Promise<void>((resolve, reject) => {
      if (file) {
        toastid = toast("Uploading image...", {
          icon: "⏳",
          duration: Infinity,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        const imgRef = ref(imageDB, `files/${fileEncodedName}`); // Use the UUID-encoded name for Firebase reference
        uploadBytes(imgRef, file)
          .then(() => {
            toast.remove(toastid);
            toast.success("Image uploaded successfully!");
            resolve(); // Resolve the promise on successful upload
          })
          .catch((error) => {
            toast.remove(toastid);
            toast.error(`Upload failed: ${error.message}`);
            reject(error); // Reject the promise if the upload fails
          });
      } else {
        const error = new Error("No file selected.");
        toast.error(error.message);
        reject(error); // Reject the promise if no file is selected
      }
    });
  };

  // Function to add a new ingredient line
  const handleAddIngredient = () => {
    setIngredientLines((prev) => [...prev, ""]); // Add an empty string to the array
  };

  const handleAddInstruction = () => {
    setInstructions((prev) => [...prev, ""]); // Add an empty string to the array
  };

  // Function to handle input change for each ingredient
  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newIngredientLines = [...ingredientLines];
    newIngredientLines[index] = e.target.value; // Update the ingredient value at the given index
    setIngredientLines(newIngredientLines);
  };
  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newInstructions = [...instructions];
    newInstructions[index] = e.target.value; // Update the ingredient value at the given index
    setInstructions(newInstructions);
  };

  // Function to remove an ingredient
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredientLines = ingredientLines.filter(
      (_, i) => i !== index
    );
    setIngredientLines(updatedIngredientLines); // Remove the ingredient at the given index
  };
  const handleRemoveInstruction = (index: number) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions); // Remove the ingredient at the given index
  };

  // send encoded file name, recipe name, ingredients, cuisine type, dish type, meal type, instructions to backend
  const sendRecipeInfoToBackend = async () => {
    const recipeData = {
      imageName: fileEncodedName, // Assuming fileEncodedName is the name or data of the image
      recipeName,
      cuisineType,
      mealType,
      dishType,
      ingredients: ingredientLines, // Assuming ingredientLines is an array of ingredients
      instructions, // Assuming instructions is an array of strings (steps for the recipe)
    };

    // Check if all values are filled in
    if (
      !recipeData.imageName ||
      !recipeData.recipeName ||
      !recipeData.cuisineType ||
      !recipeData.mealType ||
      !recipeData.dishType ||
      !recipeData.ingredients ||
      !recipeData.instructions
    ) {
      toast.error("Please fill in all the fields");
      return;
    }

    try {
      // First, handle the image upload
      await handleUpload();

      // If the image upload succeeds, send the recipe data to the backend
      const response = await axios.post(
        "https://cook-book-api-rho.vercel.app/recipes/create-recipe",
        recipeData
      );
      if (response.status === 201) {
        toast.success("Recipe created successfully!");
        console.log("Recipe created successfully:", response.data);
      }
    } catch (error) {
      // Handle errors from either image upload or recipe creation
      console.error("There was an error:", error);
      toast.error("There was an error submitting the recipe.");
    }
  };

  return (
    <>
      <Navbar />
      {breakpointIndex === 0 && (
        <>
          <div className="min-h-screen p-4">
            <div
              className="flex justify-center text-white text-5xl mb-10"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              <h1>Add Recipe</h1>
            </div>

            <div className=" rounded-xl border-2 border-white h-auto w-[80vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
              {img ? (
                <img
                  className=" w-[150px] rounded-xl ml-3"
                  src={img}
                  alt="selected image"
                />
              ) : (
                <h1 className=" text-white">
                  <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
                </h1>
              )}

              <b></b>
              <h2 className="text-2xl text-white">Upload Image</h2>
              <div>
                <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={fileSelect}
                >
                  Choose File
                </button>
              </div>
              <div className="flex items-center w-fit justify-center flex-wrap">
                <p>{selectedFilename}</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange} // Handle file changes
            />
            <div className="flex items-center justify-center flex-col ">
              <h2 className="text-2xl text-white">Recipe Name</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. Chocolate Cake"
                  // this is a required field
                  required
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Cuisine Type</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. American, Mexican, etc."
                  // this is a required field
                  required
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Meal Type</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg.Breakfast, Lunch/Dinner, etc."
                  // this is a required field
                  required
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Dish Type</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. Bread, Dessert, Salad, etc."
                  // this is a required field
                  required
                  value={dishType}
                  onChange={(e) => setDishType(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Ingredients</h2>
              {ingredientLines.map((data, i) => (
                <div
                  key={i}
                  className="flex items-center w-full justify-center"
                >
                  <input
                    type="text"
                    placeholder="eg. 1 cup of sugar"
                    value={data}
                    onChange={(e) => handleIngredientChange(e, i)} // Handle input change
                    className="border rounded-sm border-gray-300 p-2 w-full mr-1 mb-2"
                  />
                  <button
                    className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                    onClick={() => handleRemoveIngredient(i)}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddIngredient}
                className="mt-4 text-white bg-orange-500 p-2 rounded-md "
              >
                Add Ingredient
              </button>

              <h2 className="text-2xl text-white mt-5">Instructions</h2>
              {instructions.map((inst, j) => (
                <div
                  key={j}
                  className="flex items-center w-full justify-center"
                >
                  <input
                    type="text"
                    placeholder="eg. Mix sugar and flour"
                    value={inst}
                    onChange={(e) => handleInstructionChange(e, j)} // Handle input change
                    className="border rounded-sm border-gray-300 p-2 w-full mr-1 mb-2"
                  />
                  <button
                    className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                    onClick={() => handleRemoveInstruction(j)}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddInstruction}
                className="mt-4 text-white bg-orange-500 p-2 rounded-md "
              >
                Add Instruction
              </button>

              <button
                className="bottom-0 text-white bg-orange-500 p-2 rounded-md mt-5 w-full"
                onClick={sendRecipeInfoToBackend}
              >
                Add Recipe
              </button>
            </div>
          </div>
        </>
      )}
      {breakpointIndex === 1 && (
        <>
        <div className="min-h-screen p-4">
          <div
            className="flex justify-center text-white text-5xl mb-10"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            <h1>Add Recipe</h1>
          </div>

          <div className=" rounded-xl border-2 border-white h-auto w-[80vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
            {img ? (
              <img
                className=" w-[150px] rounded-xl ml-3"
                src={img}
                alt="selected image"
              />
            ) : (
              <h1 className=" text-white">
                <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
              </h1>
            )}

            <b></b>
            <h2 className="text-2xl text-white">Upload Image</h2>
            <div>
              <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={fileSelect}
              >
                Choose File
              </button>
            </div>
            <div className="flex items-center w-fit justify-center flex-wrap">
              <p>{selectedFilename}</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange} // Handle file changes
          />
          <div className="flex items-center justify-center flex-col ">
            <h2 className="text-2xl text-white">Recipe Name</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg. Chocolate Cake"
                // this is a required field
                required
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Cuisine Type</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg. American, Mexican, etc."
                // this is a required field
                required
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Meal Type</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg.Breakfast, Lunch/Dinner, etc."
                // this is a required field
                required
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Dish Type</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg. Bread, Dessert, Salad, etc."
                // this is a required field
                required
                value={dishType}
                onChange={(e) => setDishType(e.target.value)}
                className="border rounded-sm border-gray-300 p-2  mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Ingredients</h2>
            {ingredientLines.map((data, i) => (
              <div
                key={i}
                className="flex items-center w-full justify-center"
              >
                <input
                  type="text"
                  placeholder="eg. 1 cup of sugar"
                  value={data}
                  onChange={(e) => handleIngredientChange(e, i)} // Handle input change
                  className="border rounded-sm border-gray-300 p-2 w-full mr-1 mb-2"
                />
                <button
                  className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                  onClick={() => handleRemoveIngredient(i)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={handleAddIngredient}
              className="mt-4 text-white bg-orange-500 p-2 rounded-md "
            >
              Add Ingredient
            </button>

            <h2 className="text-2xl text-white mt-5">Instructions</h2>
            {instructions.map((inst, j) => (
              <div
                key={j}
                className="flex items-center w-full justify-center"
              >
                <input
                  type="text"
                  placeholder="eg. Mix sugar and flour"
                  value={inst}
                  onChange={(e) => handleInstructionChange(e, j)} // Handle input change
                  className="border rounded-sm border-gray-300 p-2 w-full mr-1 mb-2"
                />
                <button
                  className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                  onClick={() => handleRemoveInstruction(j)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={handleAddInstruction}
              className="mt-4 text-white bg-orange-500 p-2 rounded-md "
            >
              Add Instruction
            </button>

            <button
              className="bottom-0 text-white bg-orange-500 p-2 rounded-md mt-5 w-full"
              onClick={sendRecipeInfoToBackend}
            >
              Add Recipe
            </button>
          </div>
        </div>
      </>
      )}
      {breakpointIndex === 2 && (
        <>
        <div className="min-h-screen p-4">
          {/* page heading */}
          <div
            className="flex justify-center text-white text-5xl mb-10"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            <h1>Add Recipe</h1>
          </div>

          {/* image upload section */}
          <div className=" rounded-xl border-2 border-white h-auto w-[50vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
          {img ? (
              <img
                className=" w-[150px] rounded-xl ml-3"
                src={img}
                alt="selected image"
              />
            ) : (
              <h1 className=" text-white">
                <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
              </h1>
            )}
            <b></b>
            <h2 className="text-2xl text-white">Upload Image</h2>
            {/* selected image preview */}

            <div>
              <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={fileSelect}
              >
                Choose File
              </button>
              {/* <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={handleUpload}
              >
                Upload
              </button> */}
            </div>
            <div className="flex items-center w-fit justify-between ">
              <p>{selectedFilename}</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange} // Handle file changes
          />
          {/* ----------get image from firebase (not required here)----------- */}
          {/* <div className="flex items-center justify-center flex-col">
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" className="w-1/2" />
            ) : (
              <></>
            )}

            <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
            onClick={fetchImageUrl}
            >Get Image</button>
          </div> */}

          <div className="flex items-center justify-center flex-col ">
            <h2 className="text-2xl text-white">Recipe Name</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg. Chocolate Cake"
                // this is a required field
                required
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Cuisine Type</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg. American, Mexican, etc."
                // this is a required field
                required
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Meal Type</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg.Breakfast, Lunch/Dinner, etc."
                // this is a required field
                required
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Dish Type</h2>
            <div className="flex items-center w-1/2 justify-center">
              <input
                type="text"
                placeholder="eg. Bread, Dessert, Salad, etc."
                // this is a required field
                required
                value={dishType}
                onChange={(e) => setDishType(e.target.value)}
                className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
              />
            </div>

            <h2 className="text-2xl text-white">Ingredients</h2>
            {ingredientLines.map((data, i) => (
              <div key={i} className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. 1 cup of sugar"
                  value={data}
                  onChange={(e) => handleIngredientChange(e, i)} // Handle input change
                  className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                />
                <button
                  className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                  onClick={() => handleRemoveIngredient(i)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={handleAddIngredient}
              className="mt-4 text-white bg-orange-500 p-2 rounded-md "
            >
              Add Ingredient
            </button>

            <h2 className="text-2xl text-white mt-5">Instructions</h2>
            {instructions.map((inst, j) => (
              <div key={j} className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. Mix sugar and flour"
                  value={inst}
                  onChange={(e) => handleInstructionChange(e, j)} // Handle input change
                  className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                />
                <button
                  className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                  onClick={() => handleRemoveInstruction(j)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={handleAddInstruction}
              className="mt-4 text-white bg-orange-500 p-2 rounded-md "
            >
              Add Instruction
            </button>

            <button
            className="mt-4 text-white bg-orange-500 p-2 rounded-md w-1/3"
            onClick={sendRecipeInfoToBackend}>Add Recipe</button>
          </div>
        </div>
      </>
      )}
      {breakpointIndex === 3 && (
        <>
          <div className="min-h-screen p-4">
            {/* page heading */}
            <div
              className="flex justify-center text-white text-5xl mb-10"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              <h1>Add Recipe</h1>
            </div>

            {/* image upload section */}
            <div className=" rounded-xl border-2 border-white h-auto w-[50vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
            {img ? (
                <img
                  className=" w-[150px] rounded-xl ml-3"
                  src={img}
                  alt="selected image"
                />
              ) : (
                <h1 className=" text-white">
                  <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
                </h1>
              )}
              <b></b>
              <h2 className="text-2xl text-white">Upload Image</h2>
              {/* selected image preview */}

              <div>
                <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={fileSelect}
                >
                  Choose File
                </button>
                {/* <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={handleUpload}
                >
                  Upload
                </button> */}
              </div>
              <div className="flex items-center w-fit justify-between ">
                <p>{selectedFilename}</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange} // Handle file changes
            />
            {/* ----------get image from firebase (not required here)----------- */}
            {/* <div className="flex items-center justify-center flex-col">
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="w-1/2" />
              ) : (
                <></>
              )}

              <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
              onClick={fetchImageUrl}
              >Get Image</button>
            </div> */}

            <div className="flex items-center justify-center flex-col ">
              <h2 className="text-2xl text-white">Recipe Name</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. Chocolate Cake"
                  // this is a required field
                  required
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Cuisine Type</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. American, Mexican, etc."
                  // this is a required field
                  required
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Meal Type</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg.Breakfast, Lunch/Dinner, etc."
                  // this is a required field
                  required
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Dish Type</h2>
              <div className="flex items-center w-1/2 justify-center">
                <input
                  type="text"
                  placeholder="eg. Bread, Dessert, Salad, etc."
                  // this is a required field
                  required
                  value={dishType}
                  onChange={(e) => setDishType(e.target.value)}
                  className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                />
              </div>

              <h2 className="text-2xl text-white">Ingredients</h2>
              {ingredientLines.map((data, i) => (
                <div key={i} className="flex items-center w-1/2 justify-center">
                  <input
                    type="text"
                    placeholder="eg. 1 cup of sugar"
                    value={data}
                    onChange={(e) => handleIngredientChange(e, i)} // Handle input change
                    className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                  />
                  <button
                    className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                    onClick={() => handleRemoveIngredient(i)}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddIngredient}
                className="mt-4 text-white bg-orange-500 p-2 rounded-md "
              >
                Add Ingredient
              </button>

              <h2 className="text-2xl text-white mt-5">Instructions</h2>
              {instructions.map((inst, j) => (
                <div key={j} className="flex items-center w-1/2 justify-center">
                  <input
                    type="text"
                    placeholder="eg. Mix sugar and flour"
                    value={inst}
                    onChange={(e) => handleInstructionChange(e, j)} // Handle input change
                    className="border rounded-sm border-gray-300 p-2 w-1/2 mr-1 mb-2"
                  />
                  <button
                    className="text-white bg-orange-500 pl-3 pr-3 pt-2 pb-2 rounded-md mb-2"
                    onClick={() => handleRemoveInstruction(j)}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddInstruction}
                className="mt-4 text-white bg-orange-500 p-2 rounded-md "
              >
                Add Instruction
              </button>

              <button
              className="mt-4 text-white bg-orange-500 p-2 rounded-md w-1/3"
              onClick={sendRecipeInfoToBackend}>Add Recipe</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddRecipe;
