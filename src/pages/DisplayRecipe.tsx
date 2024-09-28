import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useResponsive } from "../styling/useResponsive";
import axios from "axios";
import "primeicons/primeicons.css";
import toast, { Toaster } from "react-hot-toast";
import heartimg from "../assets/heart.png";
import redheartimg from "../assets/redheart.png";
import Navbar from "../components/navbar";
import Nav from "../components/NavbarRes";
import coverimg from "../assets/cover.png";

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
  let toastid = "";
  const { uri } = useParams();
  const [recipe, setRecipes] = useState<Hit>();
  const [favoriteRecipesURIs, setFavoriteRecipeURIs] = useState<string[]>([]);
  const [favoritesUpdated, setFavoritesUpdated] = useState<boolean>(false);
  const [recipeLabel, setRecipeLabel] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<string>("");
  const [recipeUri, setRecipeUri] = useState<string>("");
  const [recipeCuisineType, setRecipeCuisineType] = useState<string>("");
  const [recipeDishType, setRecipeDishType] = useState<string>("");
  const [recipeCalories, setRecipeCalories] = useState<number>(0);
  const [recipeUrl, setRecipeUrl] = useState<string>("");
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([]);
  const recipeid = uri?.slice(-39);
  const breakpoints = [480, 768, 1279];
  const breakpointIndex = useResponsive(breakpoints);

  const displayUri = uri ? decodeURIComponent(uri) : "#";
  console.log(displayUri);

  const handleFavorite = async (uri: string) => {
    //
    try {
      const response = await axios.post(
        "https://cook-book-api-rho.vercel.app/recipes/add-to-favorites",
        {
          uri: uri,
        }
      );
      // const response = await axios.post("http://localhost:8080/recipes/add-to-favorites", {
      //   uri: uri,
      // });
      toast.remove(toastid);
      toast.success(response.data.message, {
        duration: 3000,
      });

      console.log(response.data);
      setFavoritesUpdated((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to favorites");
    }
  };

  const handleFavoriteButtonToast = () => {
    toastid = toast("Processing your request...", {
      icon: "⏳",
      duration: 10000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  function stringExistsInArray(arr: string[], str: string): boolean {
    return arr.includes(str);
  }

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

  // get favorite recipes from the database
  useEffect(() => {
    const getFavoriteRecipes = async () => {
      try {
        const response = await axios.get(
          "https://cook-book-api-rho.vercel.app/recipes/get-favorites"
        );
        console.log("favorites response: ", response);
        // const response = await axios.get('http://localhost:8080/recipes/get-favorites');
        const recipeURIs = response.data.favorites.map(
          (favorite: any) => favorite.uri
        );
        setFavoriteRecipeURIs(recipeURIs);
        console.log("favrecipeURIs: ", recipeURIs);
      } catch (error) {
        console.error(error);
      }
    };

    getFavoriteRecipes();
  }, [favoritesUpdated]);

  return (
    <>
      {breakpointIndex === 0 && (
        <div className="flex flex-col " style={{ minHeight: "100vh" }}>
          {/* Image cover */}
          <img
            src={recipeImage}
            alt="Recipe"
            className="top-0 cover-image w-full h-80"
            style={
              {
                // WebkitMaskImage:
                //   "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // Safari compatibility
                // maskImage:
                //   "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // For other browsers
              }
            }
          />
          {stringExistsInArray(favoriteRecipesURIs, recipeUri) ? (
            <img
              src={redheartimg}
              alt="Recipe"
              className="bg-white rounded-full p-1"
              onClick={(e) => {
                handleFavoriteButtonToast();
                handleFavorite(recipeUri);
                console.log("Added to Favorites");
              }}
              style={{
                width: "35px",
                height: "35px",
                position: "absolute", // Make it absolutely positioned
                top: "20px", // Distance from the top
                right: "10px", // Distance from the right
                cursor: "pointer", // Make it look like a button
                zIndex: 1, // Ensure it appears above other content
              }}
            />
          ) : (
            <img
              src={heartimg}
              alt="Recipe"
              className="bg-white rounded-full p-1"
              style={{
                width: "35px",
                height: "35px",
                position: "absolute", // Make it absolutely positioned
                top: "20px", // Distance from the top
                right: "10px", // Distance from the right
                cursor: "pointer", // Make it look like a button
                zIndex: 1, // Ensure it appears above other content
              }}
              onClick={(e) => {
                handleFavoriteButtonToast();
                handleFavorite(recipeUri);
                console.log("Added to Favorites");
              }}
            />
          )}

          {/* Fixed back icon toward the top left */}
          <button
            className="absolute top-5 left-4 bg-white rounded-full pt-2 pb-1 pr-2 pl-2"
            onClick={() => window.history.back()}
          >
            <i className="pi pi-arrow-left text-xl"></i>
          </button>

          {/* Display recipe details */}
          <div className="pl-4 mt-5">
          <h1 className="text-white text-2xl font-bold">{recipeLabel}</h1>
          <p className="text-gray-200">
            <b>Cuisine:</b> {recipeCuisineType[0]} {recipeCuisineType[1]}
          </p>
          <p className="text-gray-200"><b>Dish Type:</b> {recipeDishType}</p>
          <p className="text-gray-200">
            <b>Calories:</b> {recipeCalories.toFixed(2)} kcal
          </p>
        </div>

          {/* Display ingredients */}
          <div className="pl-4 pb-1 mt-3">
            <h2 className="text-white text-lg font-bold">Ingredients:</h2>
            <ul>
              {recipeIngredients.map((ingredient) => (
                <li className="text-white" key={ingredient}>- {ingredient}</li>
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
        <div className="flex flex-col " style={{ minHeight: "100vh" }}>
        {/* Image cover */}
        <img
          src={recipeImage}
          alt="Recipe"
          className="top-0 cover-image w-full self-center h-80"
          style={
            {
              // WebkitMaskImage:
              //   "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // Safari compatibility
              // maskImage:
              //   "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%)", // For other browsers
            }
          }
        />
        {stringExistsInArray(favoriteRecipesURIs, recipeUri) ? (
          <img
            src={redheartimg}
            alt="Recipe"
            className="bg-white rounded-full p-1"
            onClick={(e) => {
              handleFavoriteButtonToast();
              handleFavorite(recipeUri);
              console.log("Added to Favorites");
            }}
            style={{
              width: "35px",
              height: "35px",
              position: "absolute", // Make it absolutely positioned
              top: "20px", // Distance from the top
              right: "10px", // Distance from the right
              cursor: "pointer", // Make it look like a button
              zIndex: 1, // Ensure it appears above other content
            }}
          />
        ) : (
          <img
            src={heartimg}
            alt="Recipe"
            className="bg-white rounded-full p-1"
            style={{
              width: "35px",
              height: "35px",
              position: "absolute", // Make it absolutely positioned
              top: "20px", // Distance from the top
              right: "10px", // Distance from the right
              cursor: "pointer", // Make it look like a button
              zIndex: 1, // Ensure it appears above other content
            }}
            onClick={(e) => {
              handleFavoriteButtonToast();
              handleFavorite(recipeUri);
              console.log("Added to Favorites");
            }}
          />
        )}

        {/* Fixed back icon toward the top left */}
        <button
          className="absolute top-5 left-4 bg-white rounded-full pt-2 pb-1 pr-2 pl-2"
          onClick={() => window.history.back()}
        >
          <i className="pi pi-arrow-left text-xl"></i>
        </button>

        {/* Display recipe details */}
        <div className="pl-4 mt-5">
          <h1 className="text-white text-2xl font-bold">{recipeLabel}</h1>
          <p className="text-gray-200">
            <b>Cuisine:</b> {recipeCuisineType[0]} {recipeCuisineType[1]}
          </p>
          <p className="text-gray-200"><b>Dish Type:</b> {recipeDishType}</p>
          <p className="text-gray-200">
            <b>Calories:</b> {recipeCalories.toFixed(2)} kcal
          </p>
        </div>

        {/* Display ingredients */}
        <div className="pl-4 pb-1 mt-3">
          <h2 className="text-white text-lg font-bold">Ingredients:</h2>
          <ul>
            {recipeIngredients.map((ingredient) => (
              <li className="text-white" key={ingredient}>- {ingredient}</li>
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
      {breakpointIndex === 2 && (
        <>
        <Nav />
        {/* <img src={coverimg} alt="" className="w-full h-56" /> */}
        <div
          className="flex flex-col items-center"
          style={{ minHeight: "89vh" }}
        >
          {/* Image cover */}
          <div className="flex items-start justify-between mt-5  w-5/6 mb-16">
            <button
              className=" rounded-full pt-2 pb-1 pr-2 pl-2"
              onClick={() => window.history.back()}
            >
              <i className="text-white pi pi-arrow-left text-xl"></i>
            </button>
            <h1 className="text-white text-2xl font-bold">{recipeLabel}</h1>
            {stringExistsInArray(favoriteRecipesURIs, recipeUri) ? (
              <img
                src={redheartimg}
                alt="Recipe"
                className="bg-white rounded-full p-1"
                onClick={(e) => {
                  handleFavoriteButtonToast();
                  handleFavorite(recipeUri);
                  console.log("Added to Favorites");
                }}
                style={{
                  width: "35px",
                  height: "35px",
                  top: "20px", // Distance from the top
                  right: "10px", // Distance from the right
                  cursor: "pointer", // Make it look like a button
                  zIndex: 1, // Ensure it appears above other content
                }}
              />
            ) : (
              <img
                src={heartimg}
                alt="Recipe"
                className="bg-white rounded-full p-1"
                style={{
                  width: "35px",
                  height: "35px",
                  top: "20px", // Distance from the top
                  right: "10px", // Distance from the right
                  cursor: "pointer", // Make it look like a button
                  zIndex: 1, // Ensure it appears above other content
                }}
                onClick={(e) => {
                  handleFavoriteButtonToast();
                  handleFavorite(recipeUri);
                  console.log("Added to Favorites");
                }}
              />
            )}
          </div>
          

          {/* Fixed back icon toward the top left */}

          <div className="flex flex-row items-center w-5/6 justify-between h-auto ">
          <img
            src={recipeImage}
            alt="Recipe"
            className="h-96 w-2/3 rounded-3xl"
            style={{}}
          />
            {/* Display ingredients */}
            <div className="pl-4 pb-1 mt-3">
              <h2 className="text-white text-xl font-bold">Ingredients:</h2>
              <ul>
                {recipeIngredients.map((ingredient) => (
                  <li className="text-white" key={ingredient}>- {ingredient}</li>
                ))}
              </ul>
            </div>

            
          </div>
          <div className="flex flex-row items-center w-5/6 justify-around h-auto ">
            {/* Display recipe details */}
            <div className="pl-4 mt-5">
            {/* <h2 className="text-white text-lg font-bold">Info:</h2> */}
              <p className="text-gray-200">
                <b className="text-white text-xl font-bold">Cuisine:</b> {recipeCuisineType[0]} {recipeCuisineType[1]}
              </p>
              <p className="text-gray-200"><b className="text-white text-xl font-bold">Dish Type:</b> {recipeDishType}</p>
              <p className="text-gray-200">
              <b className="text-white text-xl font-bold">Calories:</b> {recipeCalories.toFixed(2)} kcal
              </p>
            </div>

            {/* Fixed View Full Recipe button */}
            <div className="flex flex-col h-auto justify-around  m-2">
              <button
                className="bg-orange-500 text-white rounded-xl p-3 m-1"
                onClick={() => window.open(recipeUrl, "_blank")}
              >
                View Full Recipe <i className="pi pi-arrow-up-right"></i>
              </button>
              <button
                className="bg-orange-500 text-white rounded-xl p-3 m-1"
                onClick={(e) => {
                  handleFavoriteButtonToast();
                  handleFavorite(recipeUri);
                  console.log("Added to Favorites");
                }}
              >
                Add to Favorites <i className="pi pi-heart"></i>
              </button>
            </div>
            </div>
        </div>
      </>
      )}
      {breakpointIndex === 3 && (
        <>
          <Nav />
          {/* <img src={coverimg} alt="" className="w-full h-56" /> */}
          <div
            className="flex flex-col items-center"
            style={{ minHeight: "89vh" }}
          >
            {/* Image cover */}
            <div className="flex items-start justify-between mt-5  w-5/6 mb-16">
              <button
                className=" rounded-full pt-2 pb-1 pr-2 pl-2"
                onClick={() => window.history.back()}
              >
                <i className="text-white pi pi-arrow-left text-xl"></i>
              </button>
              <h1 className="text-white text-2xl font-bold">{recipeLabel}</h1>
              {stringExistsInArray(favoriteRecipesURIs, recipeUri) ? (
                <img
                  src={redheartimg}
                  alt="Recipe"
                  className="bg-white rounded-full p-1"
                  onClick={(e) => {
                    handleFavoriteButtonToast();
                    handleFavorite(recipeUri);
                    console.log("Added to Favorites");
                  }}
                  style={{
                    width: "35px",
                    height: "35px",
                    top: "20px", // Distance from the top
                    right: "10px", // Distance from the right
                    cursor: "pointer", // Make it look like a button
                    zIndex: 1, // Ensure it appears above other content
                  }}
                />
              ) : (
                <img
                  src={heartimg}
                  alt="Recipe"
                  className="bg-white rounded-full p-1"
                  style={{
                    width: "35px",
                    height: "35px",
                    top: "20px", // Distance from the top
                    right: "10px", // Distance from the right
                    cursor: "pointer", // Make it look like a button
                    zIndex: 1, // Ensure it appears above other content
                  }}
                  onClick={(e) => {
                    handleFavoriteButtonToast();
                    handleFavorite(recipeUri);
                    console.log("Added to Favorites");
                  }}
                />
              )}
            </div>
            

            {/* Fixed back icon toward the top left */}

            <div className="flex flex-row items-center w-5/6 justify-around h-auto ">
            <img
              src={recipeImage}
              alt="Recipe"
              className="h-96 w-1/3 rounded-3xl"
              style={{}}
            />
              {/* Display ingredients */}
              <div className="pl-4 pb-1 mt-3">
                <h2 className="text-white text-xl font-bold">Ingredients:</h2>
                <ul>
                  {recipeIngredients.map((ingredient) => (
                    <li className="text-white" key={ingredient}>- {ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
              {/* Display recipe details */}
              <div className="pl-4 mt-5">
              {/* <h2 className="text-white text-lg font-bold">Info:</h2> */}
                <p className="text-gray-200">
                  <b className="text-white text-xl font-bold">Cuisine:</b> {recipeCuisineType[0]} {recipeCuisineType[1]}
                </p>
                <p className="text-gray-200"><b className="text-white text-xl font-bold">Dish Type:</b> {recipeDishType}</p>
                <p className="text-gray-200">
                <b className="text-white text-xl font-bold">Calories:</b> {recipeCalories.toFixed(2)} kcal
                </p>
              </div>

              {/* Fixed View Full Recipe button */}
              <div className="flex flex-col h-auto justify-around  m-2">
                <button
                  className="bg-orange-500 text-white rounded-xl p-3 m-1"
                  onClick={() => window.open(recipeUrl, "_blank")}
                >
                  View Full Recipe <i className="pi pi-arrow-up-right"></i>
                </button>
                <button
                  className="bg-orange-500 text-white rounded-xl p-3 m-1"
                  onClick={(e) => {
                    handleFavoriteButtonToast();
                    handleFavorite(recipeUri);
                    console.log("Added to Favorites");
                  }}
                >
                  Add to Favorites <i className="pi pi-heart"></i>
                </button>
              </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DisplayRecipe;
