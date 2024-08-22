//////////////////////importing the required files and packages////////////////////////
import React, { useEffect, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import Drawer from "react-modern-drawer";
import 'primeicons/primeicons.css';
import "react-modern-drawer/dist/index.css";
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
import { fetchRecipes, fetchRandomRecipes } from "../lib/utils";
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////// interface declarations  //////////////////////////
interface Recipe {
  label: string;
  image: string;
  url: string;
}

interface Hit {
  recipe: Recipe;
}
///////////////////////////////////////////////////////////////////////////

const Recipes = () => {
  /////////////////////////// state declarations  //////////////////////////
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
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

  const [recipes, setRecipes] = useState<Hit[]>([]);
  const [randomrecipes, setRandomRecipes] = useState<Hit[]>([]);
  //////////////////////////////////////////////////////////////////////////

  ///////////////////////// operations to be performed on the state //////////////////////////
  useEffect(() => {
    console.log(selectedIngredients);
    console.log(selectedCuisine);
  }, [selectedIngredients, selectedCuisine]);

  useEffect(() => {
    const fetchAndSetRandomRecipes = async () => {
      const hits = await fetchRandomRecipes();
      setRandomRecipes(hits); // Update the recipes state with the fetched hits
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
      <div className="max-w-screen-xl mx-auto p-4 flex flex-col">
        <h1
          className="text-5xl text-white font-semibold text-center mb-5"
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
              <h2 className="text-xl mb-10">Apply Filters <i className="pi pi-filter"></i></h2>
              <div className="bg-slate-400 mt-2 w-full h-0.3 border rounded-lg"></div>
            </div>
            {/* dropdown menu to select multiple ingredients */}
            <p className="text-black text-center mb-1 mt-2">Select Ingredients</p>
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
              {/* use cards to display the recipe label, image and anchor tag for the url */}
              <h2 className="text-white text-lg text-center mb-3 mt-3">Browsing random recipes for you</h2>
              <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                
                {randomrecipes.map((randomrecipe) => (
                  <Card
                  key={randomrecipe.recipe.url}
                  className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                  style={{
                    width: "17rem",
                    height: "360px",
                    background: "white",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", // Default shadow
                  }}
                >
                    <img
                      src={randomrecipe.recipe.image}
                      alt="not found"
                      style={{
                        width: "100%",
                        height: "60%",
                        objectFit: "cover",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                    />
                    <CardContent
                      className="flex flex-col p-2 justify-between"
                      style={{ flexGrow: 1 }} // Allows content to grow and fill available space
                    >
                      <CardHeader className="mt--10">
                        <CardTitle className="text-[#005D90] text-center align-middle overflow-clip h-11 ">
                          {/* {`${randomrecipe.recipe.label}`} */}
                          {/* only display the first 30 characted of the label */}
                          {`${randomrecipe.recipe.label}`}
                          {/* {`${randomrecipe.recipe.label}`.length > 30 && "..."} */}
                        </CardTitle>
                      </CardHeader>
                      <div className="flex items-center justify-center">
                        <a href={randomrecipe.recipe.url} className="bg-white text-[#005D90] hover:bg-[#005D90] hover:text-white font-bold py-1 px-3 rounded border border-[#005D90] ">
                          View Recipe
                        </a>
                      
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* use cards to display the recipe label, image and anchor tag for the url */}
              <h2 className="text-white text-lg text-center mb-3 mt-3">Recipes Based on your Search</h2>
              <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                
                {recipes.map((recipe) => (
                  <Card
                  key={recipe.recipe.url}
                  className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                  style={{
                    width: "17rem",
                    height: "350px",
                    background: "white",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", // Default shadow
                  }}
                >
                    <img
                      src={recipe.recipe.image}
                      alt="not found"
                      style={{
                        width: "100%",
                        height: "60%",
                        objectFit: "cover",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                    />
                    <CardContent
                      className="flex flex-col p-2 justify-between"
                      style={{ flexGrow: 1 }} // Allows content to grow and fill available space
                    >
                      <CardHeader>
                        <CardTitle className="text-[#005D90] text-center align-middle mt--3">
                          {/* {`${randomrecipe.recipe.label}`} */}
                          {/* only display the first 30 characted of the label */}
                          {`${recipe.recipe.label}`.substring(0, 25)}
                          {`${recipe.recipe.label}`.length > 25 && "..."}
                        </CardTitle>
                      </CardHeader>
                      <div className="flex items-center justify-center">
                        <a href={recipe.recipe.url} className="bg-white text-[#005D90] hover:bg-[#005D90] hover:text-white font-bold py-1 px-3 rounded border border-[#005D90] ">
                          View Recipe
                        </a>
                      
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
