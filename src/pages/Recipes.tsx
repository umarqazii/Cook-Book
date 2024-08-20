import React, { useEffect } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { ingredientOptions, cuisineOptions } from "../data/recipePageData";

const Recipes = () => {
  const animatedComponents = makeAnimated();
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [selectedCuisine, setSelectedCuisine] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    console.log(selectedIngredients);
    console.log(selectedCuisine);
  }, [selectedIngredients, selectedCuisine]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/recipes/all", {
        params: {
          ingredients: selectedIngredients.map(
            (ingredient) => ingredient.value
          ),
          cuisine: selectedCuisine?.value,
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, [selectedIngredients, selectedCuisine]);

  return (
    <div className="bg-gray-700 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-3xl text-white font-semibold text-center mb-3">
          Recipes
        </h1>
        <div>
          {/* search bar */}
          <p className="text-white mt-3 mb-1">Select Ingredients</p>
          <div className="flex justify-center mb-5">
            
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[ingredientOptions[0], ingredientOptions[3]]}
              isMulti
              options={ingredientOptions}
              className="w-full sm:w-1/2"
              onChange={(selectedOptions) =>
                setSelectedIngredients(selectedOptions)
              }
            />
          </div>
          {/* dropdown menu to select a single cuisine */}
          <p className="text-white mt-3 mb-1">Select Cuisine</p>
          <div className="flex justify-center mb-5">
            <Select
              components={animatedComponents}
              options={cuisineOptions}
              className="w-full sm:w-1/2"
              onChange={(selectedCuisine) =>
                setSelectedCuisine(
                  selectedCuisine as SingleValue<{
                    value: string;
                    label: string;
                  }>
                )
              }
              isClearable
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl text-white font-semibold">Recipe 1</h2>
              <p className="text-gray-400">Description of Recipe 1</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl text-white font-semibold">Recipe 2</h2>
              <p className="text-gray-400">Description of Recipe 2</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl text-white font-semibold">Recipe 3</h2>
              <p className="text-gray-400">Description of Recipe 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
