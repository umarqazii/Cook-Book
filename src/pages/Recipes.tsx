import React, { useEffect, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  ingredientOptions,
  cuisineOptions,
  mealTypeOptions,
  dishTypeOptions,
} from "../data/recipePageData";
import { fetchRecipes } from "../lib/utils";

interface Recipe {
  label: string;
  image: string;
  url: string;
}

interface Hit {
  recipe: Recipe;
}

const Recipes = () => {
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

  const [recipes, setRecipes] = useState<Hit[]>([]);

  useEffect(() => {
    console.log(selectedIngredients);
    console.log(selectedCuisine);
  }, [selectedIngredients, selectedCuisine]);

  useEffect(() => {
    const fetchAndSetRecipes = async () => {
      const hits = await fetchRecipes(
        selectedIngredients.map((ingredient) => ingredient.value).join(","),
        selectedCuisine?.value || ""
      );
      setRecipes(hits); // Update the recipes state with the fetched hits
    };

    fetchAndSetRecipes();
  }, [selectedIngredients, selectedCuisine]);

  return (
    <div className="bg-gray-700 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4 flex flex-col">
        <h1
          className="text-5xl text-white font-semibold text-center mb-5"
          style={{ fontFamily: '"Matemasie", cursive' }}
        >
          Recipes
        </h1>
        <div className="flex justify-center"> {/* Centering the button */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
        onClick={toggleDrawer}
      >
        Apply Filters
      </button>
    </div>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="bottom"
          className="border rounded-t-2xl"
        >
          <div className="flex flex-col ">
          <div className="flex justify-center">
            <div className="bg-slate-400 mt-2 mb-2 sm:w-1/3 w-2/3 h-1 border rounded-lg"></div>
          </div>
            {/* dropdown menu to select multiple ingredients */}
            <p className="text-black text-center mb-1 ">Select Ingredients</p>
            <div className="flex justify-center mb-5">
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={[ingredientOptions[29]]}
                isMulti
                options={ingredientOptions}
                className="w-full sm:w-1/2"
                onChange={(selectedOptions) =>
                  setSelectedIngredients(selectedOptions)
                }
              />
            </div>
            {/* dropdown menu to select a single cuisine */}
            <p className="text-black text-center mb-1">Select Cuisine</p>
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
            <div className="flex justify-center"> {/* Centering the button */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Dynamic grid items from API */}
            {recipes.map((recipeData, index) => {
              const { label, image, url } = recipeData.recipe;

              return (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 text-center"
                >
                  <h2 className="text-xl text-white font-semibold">{label}</h2>
                  <img
                    src={image}
                    alt={label}
                    className="mt-2 rounded-lg w-full object-cover"
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-blue-400 mt-2 "
                  >
                    View Recipe
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
