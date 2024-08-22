import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import {
  ingredientOptions,
  cuisineOptions,
  mealTypeOptions,
  dishTypeOptions,
} from "../data/ArrayExports";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchRecipes = async (query: string, selectedCuisineType: string, selectedDishType: string, selectedMealType: string) => {
  //const appId = "ab7aeda7";
  const appId = process.env.REACT_APP_APPLICATION_ID;
  //const appKey = "582c50836c0a17b6c3b525cff3c88f63";
  const appKey = process.env.REACT_APP_APPLICATION_KEY;
  
  let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

  if (selectedCuisineType) {
      url += `&cuisineType=${selectedCuisineType}`;
  }

  
  if (selectedDishType) {
    url += `&dishType=${selectedDishType}`;
  }
  if (selectedMealType) {
      url += `&mealType=${selectedMealType}`;
  }
  
  try {
      const response = await axios.get(url);
      console.log(response.data.hits); // Handle the API response data
      return response.data.hits;
  } catch (error) {
      console.error("Failed to fetch recipes:", error);
      return [];
  }
};

// fetch random recipes
export const fetchRandomRecipes = async () => {
  //const appId = "ab7aeda7";
  const appId = process.env.REACT_APP_APPLICATION_ID;
  //const appKey = "582c50836c0a17b6c3b525cff3c88f63";
  const appKey = process.env.REACT_APP_APPLICATION_KEY;

  let query = getRandomIngredient();
  let selectedCuisineType = getRandomCuisineType();

  console.log(query, selectedCuisineType);
  
  let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&cuisineType=${selectedCuisineType}`;


  try {
      console.log(url);
      console.log("fetching random recipes");
      const response = await axios.get(url);
      console.log(response.data.hits); // Handle the API response data
      return response.data.hits;
  } catch (error) {
      console.error("Failed to fetch recipes:", error);
      return [];
  }
};

//return the last 39 characters of the url
export const extractRecipeId = (url: string) => {
  return url.slice(-39);
}

// function that returns a random ingredient from the ingredientOptions array
const getRandomIngredient = () => {
  const randomIndex = Math.floor(Math.random() * ingredientOptions.length);
  return ingredientOptions[randomIndex].value;
}

// function that returns a random cuisine type from the cuisineOptions array
const getRandomCuisineType = () => {
  const randomIndex = Math.floor(Math.random() * cuisineOptions.length);
  return cuisineOptions[randomIndex].value;
}

// function that returns a random meal type from the mealTypeOptions array
const getRandomMealType = () => {
  const randomIndex = Math.floor(Math.random() * mealTypeOptions.length);
  return mealTypeOptions[randomIndex].value;
}

// function that returns a random dish type from the dishTypeOptions array
const getRandomDishType = () => {
  const randomIndex = Math.floor(Math.random() * dishTypeOptions.length);
  return dishTypeOptions[randomIndex].value;
}
