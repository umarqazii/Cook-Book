import React, { useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';

interface Recipe {
    dateOfPosting: string;
    imageName: string;
    recipeName: string;
    cuisineType: string;
    mealType: string;
    dishType: string;
    ingredients: string[];
    instructions: string[];
}

const DisplayMyRecipes = () => {

    // state that will store an array of recipes
    const [recipes, setRecipes] = React.useState<Recipe[]>([]);

    // get recipes from the database
    useEffect(() => {
        const getRecipes = async () => {
            try {
                //const response = await axios.get('http://localhost:8080/recipes/get-all-recipes');
                const response = await axios.get('https://cook-book-api-rho.vercel.app/recipes/get-all-recipes');
                console.log(response.data.recipes);
                // const response = await axios.get('http://localhost:8080/recipes/get-all-recipes');
                setRecipes(response.data.recipes);
                console.log("recipes array",recipes);
            } catch (error) {
                console.error(error);
            }
        };
        getRecipes();
    }, []);

  return (
    <>
      <Navbar />
      {recipes.map((recipe) => (
        <div key={recipe.imageName} >
          <h1>{recipe.dateOfPosting}</h1>
          <h2>{recipe.imageName}</h2>
          <h2>{recipe.recipeName}</h2>
          <p>{recipe.cuisineType}</p>
          <p>{recipe.mealType}</p>
          <p>{recipe.dishType}</p>
          <p>{recipe.ingredients}</p>
          <p>{recipe.instructions}</p>
          <br></br>
        </div>
      ))}
    </>
  );
};

export default DisplayMyRecipes;