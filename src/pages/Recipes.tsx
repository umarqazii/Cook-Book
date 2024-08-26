//////////////////////importing the required files and packages////////////////////////
import React, { useEffect, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import Drawer from "react-modern-drawer";
import "primeicons/primeicons.css";
import "react-modern-drawer/dist/index.css";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import {
  ingredientOptions,
  cuisineOptions,
  mealTypeOptions,
  dishTypeOptions,
} from "../data/ArrayExports";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/cards";
import heartimg from "../assets/heart.png";
import { fetchRecipes, fetchRandomRecipes } from "../lib/utils";
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////// interface declarations  //////////////////////////
interface Recipe {
  label: string;
  image: string;
  url: string;
  uri: string;
}

interface Hit {
  recipe: Recipe;
}
///////////////////////////////////////////////////////////////////////////

const Recipes = () => {
  /////////////////////////// state declarations  //////////////////////////
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const animatedComponents = makeAnimated();
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    MultiValue<{ value: string; label: string }>
  >([]);

  const [selectedCuisine, setSelectedCuisine] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const [selectedMealType, setSelectedMealType] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const [selectedDishType, setSelectedDishType] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const [favorite, setFavorite] = React.useState<boolean>(false);

  const [recipes, setRecipes] = useState<Hit[]>([]);
  const [randomrecipes, setRandomRecipes] = useState<Hit[]>([]);
  //////////////////////////////////////////////////////////////////////////

  ///////////////////////// operations to be performed on states //////////////////////////
  useEffect(() => {
    console.log(selectedIngredients);
    console.log(selectedCuisine);
  }, [selectedIngredients, selectedCuisine]);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  // handleFavorite function takes the recipe url as an argument and sends it to backend endpoint http://localhost:8080/recipes/add-to-favorites
  const handleFavorite = async (uri: string) => {
    // 
    try {
      const response = await axios.post("http://localhost:8080/recipes/add-to-favorites", {
        uri: uri,
      });
      toast.success(response.data.message);
      
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to favorites");
    }


  };

  useEffect(() => {
    const fetchAndSetRandomRecipes = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching
      const hits = await fetchRandomRecipes();
      setRandomRecipes(hits); // Update the recipes state with the fetched hits
      setLoading(false); // Step 2: Set loading to false after fetching
    };

    fetchAndSetRandomRecipes();
  }, []);

  useEffect(() => {
    const fetchAndSetRecipes = async () => {
      const hits = await fetchRecipes(
        selectedIngredients.map((ingredient) => ingredient.value).join(","),
        selectedCuisine?.value || "",
        selectedDishType?.value || "",
        selectedMealType?.value || ""
      );
      setRecipes(hits); // Update the recipes state with the fetched hits
    };

    fetchAndSetRecipes();
  }, [
    selectedIngredients,
    selectedCuisine,
    selectedMealType,
    selectedDishType,
  ]);

  // Function to handle the change in the dropdown menu
  const handleCuisineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption =
      cuisineOptions.find((option) => option.value === selectedValue) || null;
    setSelectedCuisine(selectedOption);
  };

  // Function to handle the change in the dropdown menu
  const handleMealTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const selectedOption =
      mealTypeOptions.find((option) => option.value === selectedValue) || null;
    setSelectedMealType(selectedOption);
  };

  // Function to handle the change in the dropdown menu
  const handleDishTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const selectedOption =
      dishTypeOptions.find((option) => option.value === selectedValue) || null;
    setSelectedDishType(selectedOption);
  };

  //////////////////////////////////////////////////////////////////////////

  /////////////////////////// return statement //////////////////////////
  return (
    <div className="bg-gray-700 min-h-screen">
      <div><Toaster/></div>
      <div className="max-w-full  mx-auto p-4 flex flex-col">
        <h1
          className="text-5xl text-white font-semibold text-center mb-6"
          style={{ fontFamily: '"Matemasie", cursive' }}
        >
          Recipes
        </h1>
        <div className="flex justify-center mb-3">
          {" "}
          {/* Centering the button */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
            onClick={toggleDrawer}
          >
            Browse Recipes &nbsp;<i className="pi pi-search"></i>
          </button>
        </div>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="bottom"
          className="border rounded-t-2xl"
          style={{ height: "80vh" }}
          
        >
          <div className="flex flex-col ">
            <div className="flex justify-center flex-col items-center">
              <div className="bg-slate-400 mt-2 mb-2 sm:w-1/3 w-2/3 h-1 border rounded-lg"></div>
              <h2 className="text-xl mb-10">
                Apply Filters <i className="pi pi-filter"></i>
              </h2>
              <div className="bg-slate-400 mt-2 w-full h-0.3 border rounded-lg"></div>
            </div>
            {/* dropdown menu to select multiple ingredients */}
            <p className="text-black text-center mb-1 mt-2">
              Select Ingredients
            </p>
            <div className="flex justify-center mb-5">
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={[ingredientOptions[0]]}
                isMulti
                options={ingredientOptions}
                className="w-11/12 sm:w-1/2"
                onChange={(selectedOptions) =>
                  setSelectedIngredients(selectedOptions)
                }
              />
            </div>
            <div className="flex justify-center">
              <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
            </div>
            {/* dropdown menu to select a single cuisine */}
            <p className="text-black text-center mb-1">Select Cuisine</p>
            <div className="flex justify-center mb-5">
              <select
                className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleCuisineChange}
              >
                <option value="">Select a cuisine</option>
                {cuisineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* dropdown menu to select a single dish type */}
            <div className="flex justify-center">
              <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
            </div>
            <p className="text-black text-center mb-1">Select Dish Type</p>
            <div className="flex justify-center mb-5">
              <select
                className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleDishTypeChange}
              >
                <option value="">Select a dish type</option>
                {dishTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* dropdown menu to select a single meal type */}
            <div className="flex justify-center">
              <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
            </div>
            <p className="text-black text-center mb-1">Select Meal Type</p>
            <div className="flex justify-center mb-5">
              <select
                className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleMealTypeChange}
              >
                <option value="" className="text-gray-300">
                  Select a meal type
                </option>
                {mealTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              {" "}
              {/* Centering the button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5"
                onClick={toggleDrawer}
              >
                Done
              </button>
            </div>
          </div>
        </Drawer>
        <div>
          {recipes.length === 0 ? (
            <>
            <h2 className="text-white text-lg text-center mb-3 mt-3">
              --- RANDOM RECIPES FOR YOU ---
            </h2>
            {loading ? ( // Step 3: Conditional rendering
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                {randomrecipes.map((randomRecipe) => (
                  <Card
                  key={randomRecipe.recipe.url}
                  className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                  style={{
                    width: "21rem",
                    height: "330px",
                    background: "white",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    position: "relative", // Added to make the heart image position absolute within the card
                  }}
                  onClick={() => window.open(randomRecipe.recipe.url, "_blank")}
                >
                  <img
                    src={randomRecipe.recipe.image}
                    alt="not found"
                    style={{
                      width: "100%",
                      height: "60%",
                      objectFit: "cover",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                    }}
                  />
                
                  {/* Heart Image Positioned Absolutely */}
                  <img
                    src={heartimg}
                    alt="not found"
                    style={{
                      width: "35px",
                      height: "35px",
                      position: "absolute", // Make it absolutely positioned
                      top: "10px", // Distance from the top
                      right: "10px", // Distance from the right
                      cursor: "pointer", // Make it look like a button
                      zIndex: 1, // Ensure it appears above other content
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card's onClick event from firing
                      handleFavorite(randomRecipe.recipe.uri);
                      console.log('Added to Favorites');
                    }}
                  />
                
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <CardHeader className="self-center">
                        <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                          {randomRecipe.recipe.label}
                        </CardTitle>
                      </CardHeader>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </>
          ) : (
            <>
            <h2 className="text-white text-lg text-center mb-3 mt-3">
              --- RECIPES BASED ON YOUR SEARCH ---
            </h2>
            {loading ? ( // Step 3: Conditional rendering
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                {recipes.map((Recipe) => (
                  <Card
                  key={Recipe.recipe.url}
                  className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                  style={{
                    width: "21rem",
                    height: "330px",
                    background: "white",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    position: "relative", // Added to make the heart image position absolute within the card
                  }}
                  onClick={() => window.open(Recipe.recipe.url, "_blank")}
                >
                  <img
                    src={Recipe.recipe.image}
                    alt="not found"
                    style={{
                      width: "100%",
                      height: "60%",
                      objectFit: "cover",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                    }}
                  />
                
                  {/* Heart Image Positioned Absolutely */}
                  <img
                    src={heartimg}
                    alt="not found"
                    style={{
                      width: "35px",
                      height: "35px",
                      position: "absolute", // Make it absolutely positioned
                      top: "10px", // Distance from the top
                      right: "10px", // Distance from the right
                      cursor: "pointer", // Make it look like a button
                      zIndex: 1, // Ensure it appears above other content
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card's onClick event from firing
                      handleFavorite(Recipe.recipe.uri);
                      console.log('Added to Favorites');
                    }}
                  />
                
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <CardHeader className="self-center">
                        <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                          {Recipe.recipe.label}
                        </CardTitle>
                      </CardHeader>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
