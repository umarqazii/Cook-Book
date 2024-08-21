import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchRecipes = async (query: string, selectedCuisineType: string) => {
  //const appId = "ab7aeda7";
  const appId = process.env.REACT_APP_APPLICATION_ID;
  //const appKey = "582c50836c0a17b6c3b525cff3c88f63";
  const appKey = process.env.REACT_APP_APPLICATION_KEY;
  
  let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

  if (selectedCuisineType) {
      url += `&cuisineType=${selectedCuisineType}`;
  }

  try {
      const response = await axios.get(url);
      console.log(response.data); // Handle the API response data
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