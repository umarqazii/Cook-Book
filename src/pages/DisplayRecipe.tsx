import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useResponsive } from "../styling/useResponsive";
import axios from "axios";
import "primeicons/primeicons.css";

interface Recipe {
  label: string;
  image: string;
  url: string;
  uri: string;
  calories: number;
  ingredients: string[];
  cuisineType: string;
  dishType: string;
}

interface Hit {
  recipe: Recipe;
}

const DisplayRecipe: React.FC = () => {
  const { uri } = useParams();
  const [recipe, setRecipes] = useState<Hit>();
  const [recipeLabel, setRecipeLabel] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<string>("");
  const [recipeUri, setRecipeUri] = useState<string>("");
  const [recipeCuisineType, setRecipeCuisineType] = useState<string>("");
  const [recipeDishType, setRecipeDishType] = useState<string>("");
  const [recipeCalories, setRecipeCalories] = useState<number>(0);
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([]);
  const recipeid = uri?.slice(-39);
  const breakpoints = [640, 768, 1600];
  const breakpointIndex = useResponsive(breakpoints);

  const displayUri = uri ? decodeURIComponent(uri) : "#";
  console.log(displayUri);

  useEffect(() => {
    const getRecipe = async () => {
      const appId = "ab7aeda7";
      const appKey = "582c50836c0a17b6c3b525cff3c88f63";

      const url = `https://api.edamam.com/api/recipes/v2/${recipeid}?type=public&app_id=${appId}&app_key=${appKey}`;

      const response = await axios.get(url);

      setRecipeLabel(response.data.recipe.label);
      setRecipeImage(response.data.recipe.image);
      setRecipeUri(response.data.recipe.uri);
      setRecipeCuisineType(response.data.recipe.cuisineType);
      setRecipeDishType(response.data.recipe.dishType);
      setRecipeCalories(response.data.recipe.calories);
      setRecipeUrl(response.data.recipe.url);
      setRecipeIngredients(response.data.recipe.ingredientLines);
      console.log(response.data.recipe);
      console.log(recipeLabel);
      console.log(recipeImage);
      console.log(recipeUri);
      console.log(recipeCuisineType);
      console.log(recipeDishType);
      console.log(recipeIngredients);
    };
    getRecipe();
  }, []);

  return (
    <>
      {breakpointIndex === 0 && (
        <div
          className="flex flex-col"
          style={{ minHeight: "calc(100vh - 72px)" }}
        >
          {/* Image cover */}
          <img
            src={recipeImage}
            alt="Recipe"
            className="cover-image w-full h-80"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // Safari compatibility
              maskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // For other browsers
            }}
          />

          {/* Fixed back icon toward the top left */}
          <button
            className="absolute top-20 left-4 bg-white rounded-full pt-2 pb-1 pr-2 pl-2"
            onClick={() => window.history.back()}
          >
            <i className="pi pi-arrow-left text-xl"></i>
          </button>

          {/* Display recipe details */}
          <div className="p-4">
            <h1 className="text-2xl font-bold">{recipeLabel}</h1>
            <p className="text-gray-600">Cuisine: {recipeCuisineType}</p>
            <p className="text-gray-600">Dish Type: {recipeDishType}</p>
            <p className="text-gray-600">Calories: {recipeCalories}</p>
          </div>

          {/* Display ingredients */}
          <div className="pl-4 pb-1">
            <h2 className="text-lg font-bold">Ingredients:</h2>
            <ul>
              {recipeIngredients.map((ingredient) => (
                <li key={ingredient}>- {ingredient}</li>
              ))}
            </ul>
          </div>

          {/* Fixed View Full Recipe button */}
          <button
            className="fixed bottom-0 w-full bg-orange-500 text-white p-3 rounded-t-xl"
            onClick={() => window.open(recipeUrl, "_blank")}
          >
            View Full Recipe <i className="pi pi-arrow-up-right"></i>
          </button>
        </div>
      )}
      {breakpointIndex === 1 && (
        <div>
          <h1>ONLY AVAILABLE ON MOBILE SCREENS FOR NOW</h1>
        </div>
      )}
      {breakpointIndex === 2 && (
        <div>
          <h1>ONLY AVAILABLE ON MOBILE SCREENS FOR NOW</h1>
        </div>
      )}
    </>
  );
};

export default DisplayRecipe;
