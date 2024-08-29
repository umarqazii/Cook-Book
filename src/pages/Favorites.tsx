import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/cards";
import toast, { Toaster } from 'react-hot-toast';
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
  const [loading, setLoading] = useState(true);
  const [favoriteRecipesID, setFavoriteRecipesID] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);  // Correct the state type to Recipe[]
  
  useEffect(() => {
    const getFavoriteRecipes = async () => {
      try {
        const response = await axios.get('https://cook-book-api-rho.vercel.app/recipes/get-favorites');
        // const response = await axios.get('http://localhost:8080/recipes/get-favorites');
        const recipeIDs = response.data.favorites.map((favorite: any) => favorite.recipeid);
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
        const allRecipes: Recipe[] = []; // Changed type to Recipe[]
        setLoading(true);
        for (const id of favoriteRecipesID) {
          const appId = 'ab7aeda7'; 
          const appKey = '582c50836c0a17b6c3b525cff3c88f63'; 

          const url = `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${appId}&app_key=${appKey}`;

          const response = await axios.get(url);
          allRecipes.push(response.data.recipe); // Directly push response.data.recipe which is a Recipe
        }

        setRecipes(allRecipes); // Directly set recipes as array of Recipe objects
        setLoading(false);
        console.log(allRecipes);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    if (favoriteRecipesID.length > 0) { // Add a check to prevent fetching with empty array
      fetchRecipeDetails();
    }
  }, [favoriteRecipesID]);

  const handleRemoveFromFavorites = async (uri: string) => {
    try {
      await axios.post('https://cook-book-api-rho.vercel.app/recipes/remove-favorite', { uri });
      // await axios.post('http://localhost:8080/recipes/remove-favorite', { uri });
      toast.success('Recipe removed from favorites');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove recipe from favorites');
    }
  }

  const handleFavoriteButtonToast = () => {
    toast('Processing your request...',
      {
        icon: '⏳',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  return (
    <div className=' min-h-screen p-4'>
  <div className='flex justify-center text-white text-5xl mb-8' style={{ fontFamily: '"Matemasie", cursive' }}>
    <h1>Favorites</h1>
  </div>

  {favoriteRecipesID.length === 0 ? (
    <div className='flex justify-center text-white text-2xl'>
      <h1>No Favorites Yet</h1>
    </div>
  ) : (
    loading ? (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
      </div>
    ) : (
      <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
        {recipes.map((favRecipe) => (
          <Card
            key={favRecipe.url}
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
              position: "relative",
            }}
            onClick={() => window.open(favRecipe.url, "_blank")}
          >
            <img
              src={favRecipe.image}
              alt="not found"
              style={{
                width: "100%",
                height: "60%",
                objectFit: "cover",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            />

            <img
              src={heartimg}
              alt="not found"
              style={{
                width: "35px",
                height: "35px",
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                zIndex: 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteButtonToast();
                handleRemoveFromFavorites(favRecipe.uri);
                console.log('Added to Favorites');
              }}
            />

            <CardContent>
              <div className="flex items-center justify-center">
                <CardHeader className="self-center">
                  <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                    {favRecipe.label}
                  </CardTitle>
                </CardHeader>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  )}
</div>

  );
};

export default Favorites;
