import React from "react";
import { useResponsive } from "../styling/useResponsive";
import "primeicons/primeicons.css";
import img1 from "../assets/img1.jpg";

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

const staticRecipe1: Hit = {
  recipe: {
    label: "Pakistani-style White Lentils with a Sizzling Oil Garnish",
    image: img1,
    ingredients: [
      "1 cup white lentils",
      "1/2 cup water",
      "1/2 teaspoon ground black pepper",
      "1/2 teaspoon ground cumin",
    ],
    cuisineType: "Indian",
    url: "https://food52.com/recipes/8539-pakistani-style-white-lentils-with-a-sizzling-oil-garnish",
    uri: "http://www.edamam.com/ontologies/edamam.owl#recipe_1e38243afa522e6775a99d917fd2d5c3",
    calories: 150,
    dishType: "Lunch",
  },
};

const DisplayRecipe = () => {
  const breakpoints = [640, 768, 1600]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);

  return (
    <>
      {breakpointIndex === 0 && (
        <div className="flex flex-col" style={{ minHeight: "calc(100vh - 72px)" }}>
        {/* Image cover */}
        <img
          src={staticRecipe1.recipe.image}
          alt="Recipe"
          className="cover-image w-full h-80"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // Safari compatibility
            maskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // For other browsers
          }}
        />
      
        {/* Display recipe details */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">{staticRecipe1.recipe.label}</h1>
          <p className="text-gray-600">Cuisine: {staticRecipe1.recipe.cuisineType}</p>
          <p className="text-gray-600">Dish Type: {staticRecipe1.recipe.dishType}</p>
          <p className="text-gray-600">Calories: {staticRecipe1.recipe.calories}</p>
        </div>
      
        {/* Display ingredients */}
        <div className="pl-4 pb-1 ">
          <h2 className="text-lg font-bold">Ingredients:</h2>
          <ul>
            {staticRecipe1.recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>

      
        {/* View Full Recipe button */}
        <button className="w-full bg-orange-500 text-white mt-2 p-3 rounded-t-xl rounded-tl-xl"
        onClick={() => window.open(staticRecipe1.recipe.url)}
        >View Full Recipe <i className="pi pi-arrow-up-right"></i></button>
      </div>
      
      )}
      {breakpointIndex === 1 && <div>
        <h1>ONLY AVAILABLE ON MOBILE SCREENS FOR NOW</h1>
        </div>}
      {breakpointIndex === 2 && <div>
        {/* Content for large screens */}
        <h1>ONLY AVAILABLE ON MOBILE SCREENS FOR NOW</h1>
        </div>}
    </>
  );
};

export default DisplayRecipe;
