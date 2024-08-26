import React, { useState,useEffect } from 'react';
import axios from 'axios';
import img from "../assets/wip.gif";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/cards";
import heartimg from "../assets/heart.png";

interface Recipe {
  label: string;
  image: string;
  url: string;
  uri: string;
}

interface Hit {
  recipe: Recipe;
}

const Favorites = () => {
  const [favoriteRecipesID, setFavoriteRecipesID] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Hit[]>([]);  
  
  useEffect(() => {
    const getFavoriteRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/recipes/get-favorites');
        const recipeIDs = response.data.favorites.map((favorite: any) => favorite.recipeid);
  
        // Update the state with the entire array at once
        setFavoriteRecipesID(recipeIDs);
        
  
      } catch (error) {
        console.error(error);
      }
    };
  
    getFavoriteRecipes();
  }, []);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const allRecipes: Hit[] = [];
        for (const id of favoriteRecipesID) {
          const appId = 'ab7aeda7'; // Replace with your actual App ID
          const appKey = '582c50836c0a17b6c3b525cff3c88f63'; // Replace with your actual App Key

          const url = `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${appId}&app_key=${appKey}`;

          // Fetch recipe details
          const response = await axios.get(url);
          allRecipes.push(response.data.recipe);

        }

        // Update the state with all fetched recipes
        setRecipes(allRecipes);
        console.log(allRecipes);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchRecipeDetails();
  }, [ favoriteRecipesID ]);

  return (
    <div className='bg-gray-700 min-h-screen'>
      <div className='flex justify-center align-middle'>
        <h2 className='text-white text-2xl'>Work in Progress</h2>
        </div>
    </div>
  );
};

export default Favorites;