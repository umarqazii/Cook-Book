//////////////////////importing the required files and packages////////////////////////
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import Drawer from "react-modern-drawer";
import "primeicons/primeicons.css";
import "react-modern-drawer/dist/index.css";
import toast, { Toaster } from "react-hot-toast";
import { useResponsive } from "../styling/useResponsive";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { imgArray } from "../data/ArrayExports";
import { responsive } from "../data/ArrayExports";
import Navbar from "../components/navbar";
import Nav from "../components/NavbarRes";
import jwtDecode from 'jwt-decode';
import {
  ingredientOptions,
  cuisineOptions,
  mealTypeOptions,
  dishTypeOptions,
} from "../data/ArrayExports";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/cards";
import heartimg from "../assets/heart.png";
import redheartimg from "../assets/redheart.png";
import { fetchRecipes, fetchRandomRecipes } from "../lib/utils";
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////// interface declarations  //////////////////////////
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

// Define an interface for the expected payload structure
interface DecodedToken {
  _id: string;
  Username?: string;
  Email?: string;
  iat?: number;
  exp?: number;
}

const Recipes = () => {
  /////////////////////////// state declarations  //////////////////////////
  const navigate = useNavigate();
  let toastid = "";
  const breakpoints = [480, 768, 1279]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const animatedComponents = makeAnimated();
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    MultiValue<{ value: string; label: string }>
  >([]);

  const [selectedCuisine, setSelectedCuisine] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const [textQuery, setTextQuery] = React.useState<string>("");

  const [selectedMealType, setSelectedMealType] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const [selectedDishType, setSelectedDishType] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const [favorite, setFavorite] = React.useState<boolean>(false);

  const [recipes, setRecipes] = useState<Hit[]>([]);
  const [favoriteRecipesURIs, setFavoriteRecipeURIs] = useState<string[]>([]);
  const [favoritesUpdated, setFavoritesUpdated] = useState<boolean>(false);
  const [randomrecipes, setRandomRecipes] = useState<Hit[]>([]);

  //////////////////////////////////////////////////////////////////////////

  ///////////////////////// operations to be performed on states //////////////////////////

  // displaying the selected states on the console
  useEffect(() => {
    console.log(selectedIngredients);
    console.log(selectedCuisine);
    console.log(selectedDishType);
    console.log(selectedMealType);
  }, [
    selectedIngredients,
    selectedCuisine,
    selectedDishType,
    selectedMealType,
  ]);

  // toggleDrawer function opens and closes the drawer
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  // handleFavorite function takes the recipe url as an argument and sends it to backend endpoint http://localhost:8080/recipes/add-to-favorites
  const handleFavorite = async (uri: string) => {
    //
    try {
      const response = await axios.post(
        "https://cook-book-api-rho.vercel.app/recipes/add-to-favorites",
        {
          userid: getIdFromToken(),
          uri: uri,
        }
      );
      // const response = await axios.post("http://localhost:8080/recipes/add-to-favorites", {
      //   userid: localStorage.getItem("userid"),
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
      toast.remove(toastid);
      toast.error("Failed to add to favorites, make sure you're logged in",{
        duration: 3000,
      });
    }
  };

  // displays a pending toast as soon as the favorite button is clicked
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

// get userid from token from local storage
// Utility function to decode base64 JWT
function parseJwt(token: string): { [key: string]: any } | null {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Handle URL-safe base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload); // Parse the JSON payload
  } catch (error) {
    console.error("Failed to parse JWT", error);
    return null;
  }
}

// Function to get _id from the token
function getIdFromToken(): string | null {
  const token = localStorage.getItem('token'); // Retrieve the JWT from local storage
  if (!token) {
    console.log("No token found in local storage");
    return null;
  }

  const decodedToken = parseJwt(token); // Manually decode the JWT
  if (decodedToken && decodedToken._id) {
    return decodedToken._id; // Extract and return the _id
  } else {
    console.log("Invalid or missing _id in token");
    return null;
  }
}
  

  // fetching random recipes
  useEffect(() => {
    const fetchAndSetRandomRecipes = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching
      const hits = await fetchRandomRecipes();
      setRandomRecipes(hits); // Update the recipes state with the fetched hits
      setLoading(false); // Step 2: Set loading to false after fetching

      // if length of random recipes is 0, fetch again
      if (hits.length === 0) {
        fetchAndSetRandomRecipes();
      }

    };

    fetchAndSetRandomRecipes();
  }, []);

    // get favorite recipes from the database
    useEffect(() => {
      const getFavoriteRecipes = async () => {
        try {
          const response = await axios.post('https://cook-book-api-rho.vercel.app/recipes/get-favorites',{
            userid: getIdFromToken(),
          });
          console.log("favorites response: ",response)
          // const response = await axios.get('http://localhost:8080/recipes/get-favorites');
          const recipeURIs = response.data.favorites.map((favorite: any) => favorite.uri);
          setFavoriteRecipeURIs(recipeURIs);
          //console.log("recipeURIs: ",recipeURIs)
        } catch (error) {
          console.error(error);
        }
      };
    
      getFavoriteRecipes();
    }, [favoritesUpdated]);

  // when search button is clicked, it fetches the recipes according to the states selected
  const submitSearch = () => {
    const fetchAndSetRecipes = async () => {
      toastid = toast("Processing your request...", {
        icon: "⏳",
        duration: Infinity,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      const updatedTextQuery = textQuery.replace(/ /g, "+");
      const hits = await fetchRecipes(
        // replace all the spaces from the textQuery with '+' sign

        updatedTextQuery +
          selectedIngredients.map((ingredient) => ingredient.value).join("+"),
        selectedCuisine?.value || "",
        selectedDishType?.value || "",
        selectedMealType?.value || ""
      );
      setRecipes(hits); // Update the recipes state with the fetched hits
      if (hits.length === 0) {
        toast.remove(toastid);
        toast.error("No recipes found");
      } else {
        toast.dismiss(toastid);
      }
    };

    fetchAndSetRecipes();
  };

  // Function to handle the change in the dropdown menu
  const handleCuisineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption =
      cuisineOptions.find((option) => option.value === selectedValue) || null;
    setSelectedCuisine(selectedOption);
  };

  // Function to handle the change in the dropdown menu
  const handleMealTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const selectedOption =
      mealTypeOptions.find((option) => option.value === selectedValue) || null;
    setSelectedMealType(selectedOption);
  };

  // Function to handle the change in the dropdown menu
  const handleDishTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const selectedOption =
      dishTypeOptions.find((option) => option.value === selectedValue) || null;
    setSelectedDishType(selectedOption);
  };

  const goBack = () => {
    // set recipes to empty array
    setRecipes([]);
  };

  function stringExistsInArray(arr: string[], str: string): boolean {
    return arr.includes(str);
  }

  //////////////////////////////////////////////////////////////////////////

  /////////////////////////// return statement //////////////////////////
  return (
    <>
    <Nav />
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}

      {breakpointIndex === 0 && (
        <div className=" min-h-screen">
          <div>
            <Toaster />
          </div>
          <div className="max-w-full  mx-auto p-4 flex flex-col">
          
            {/* whole search bar stuff below this with arrow */}
            <div className="flex flex-col items-left mb-3  w-full">
              
              {/* search bar/ back button/ search button */}
              <div className="flex justify-around">
                <div className="relative w-5/6 sm:w-1/2">
                  <button
                    className="absolute bg-gray-200 rounded-full left-1 top-1/2 transform -translate-y-1/2 pl-2 pr-2 pt-1 pb-1 text-gray-600 focus:outline-none"
                    onClick={goBack}
                  >
                    <span className="pi pi-arrow-left text-base"></span>
                  </button>
                  <input
                    type="text"
                    placeholder="Search for recipes..."
                    className="w-full pl-10 pr-3 py-2 border border-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                  />
                </div>
                {/* Centering the button */}
                <button
                  className="pl-3 pr-4 py-2  text-gray-600 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2o ml-1"
                  onClick={submitSearch}
                >
                  &nbsp;<i className="pi pi-search text-lg"></i>
                </button>
              </div>
    
            </div>
            {/* whole search bar stuff above this with arrow */}
            <div>
              {/* ------------While there are no recipes (Give options to search for recipes and in the meanwhile displaying random)----------------- */}
              {recipes.length === 0 ? (
                <>
                  {/* -----------------------------Selecting Cuisine (Mobile View)-------------------------------- */}
                  <details className="mt-5" open={true}>
                    <summary className="text-white text-lg">
                      <b>Select Cuisine</b>{" "}
                      <span className="text-gray-400 text-xs">
                        (click to view/hide)
                      </span>
                    </summary>
                    <div className=" mb-5">
                      <span className="text-gray-400 text-sm">
                        {"  "}
                        {selectedCuisine
                          ? "Chosen Cuisine: (" + selectedCuisine.label + ")"
                          : "Pick any one (Optional)"}
                      </span>
                    </div>
                    {/* -----------------------------Cuisine Carousel-------------------------------- */}
                    <Carousel
                      autoPlay={true}
                      infinite={true}
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      autoPlaySpeed={2000}
                      responsive={responsive}
                    >
                      {[
                        {
                          value: "american",
                          label: "American",
                          img: imgArray[0],
                        },
                        { value: "asian", label: "Asian", img: imgArray[1] },
                        {
                          value: "british",
                          label: "British",
                          img: imgArray[2],
                        },
                        {
                          value: "caribbean",
                          label: "Caribbean",
                          img: imgArray[3],
                        },
                        {
                          value: "central+europe",
                          label: "Central Europe",
                          img: imgArray[4],
                        },
                        {
                          value: "chinese",
                          label: "Chinese",
                          img: imgArray[5],
                        },
                        {
                          value: "eastern+europe",
                          label: "Eastern Europe",
                          img: imgArray[6],
                        },
                        { value: "french", label: "French", img: imgArray[7] },
                        { value: "indian", label: "Indian", img: imgArray[8] },
                        {
                          value: "italian",
                          label: "Italian",
                          img: imgArray[9],
                        },
                        {
                          value: "japanese",
                          label: "Japanese",
                          img: imgArray[10],
                        },
                        { value: "kosher", label: "Kosher", img: imgArray[11] },
                        {
                          value: "mediterranean",
                          label: "Mediterranean",
                          img: imgArray[12],
                        },
                        {
                          value: "mexican",
                          label: "Mexican",
                          img: imgArray[13],
                        },
                        {
                          value: "middle+eastern",
                          label: "Middle Eastern",
                          img: imgArray[14],
                        },
                        { value: "nordic", label: "Nordic", img: imgArray[15] },
                        {
                          value: "south+american",
                          label: "South American",
                          img: imgArray[16],
                        },
                        {
                          value: "south+east_asian",
                          label: "South East Asian",
                          img: imgArray[17],
                        },
                      ].map((cuisine) => (
                        <div
                          key={cuisine.value}
                          className="flex flex-col justify-center items-center"
                          onClick={() =>
                            selectedCuisine &&
                            selectedCuisine.value === cuisine.value
                              ? setSelectedCuisine(null)
                              : setSelectedCuisine(cuisine)
                          }
                        >
                          <div
                            className="relative border rounded-lg"
                            style={{ height: "100px", width: "100px" }}
                          >
                            <img
                              src={cuisine.img}
                              alt={cuisine.label}
                              className="border rounded-lg"
                            />
                            {/* Green Outline */}
                            {selectedCuisine &&
                              selectedCuisine.value === cuisine.value && (
                                <div
                                  className="absolute top-1/2 right-1/2 rounded-lg"
                                  style={{
                                    transform: "translate(50%, -50%)",
                                    width: "100px",
                                    height: "100px",
                                    border: "8px double green",
                                  }}
                                ></div>
                              )}
                          </div>
                          <div className="text-white text-center">
                            {cuisine.label}
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </details>
                  {/* -----------------------------End of Selecting Cuisine-------------------------------- */}

                  {/* -----------------------------Selecting MealType (Mobile View)-------------------------------- */}
                  <details className="mt-5" open={true}>
                    <summary className="text-white text-lg">
                      <b>Select Meal Type</b>{" "}
                      <span className="text-gray-400 text-xs">
                        (click to view/hide)
                      </span>
                    </summary>
                    <div className=" mb-5">
                      <span className="text-gray-400 text-sm">
                        {"  "}
                        {selectedMealType
                          ? "Chosen Option: (" + selectedMealType.label + ")"
                          : "Pick any one (Optional)"}{" "}
                      </span>
                    </div>
                    {/* -----------------------------MealType Carousel-------------------------------- */}
                    <Carousel
                      infinite={true}
                      responsive={responsive}
                      arrows={true}
                    >
                      {[
                        {
                          value: "breakfast",
                          label: "Breakfast",
                          img: imgArray[18],
                        },
                        {
                          value: "lunch+dinner",
                          label: "Lunch/Dinner",
                          img: imgArray[19],
                        },
                        { value: "snack", label: "Snack", img: imgArray[20] },
                        {
                          value: "teatime",
                          label: "Teatime",
                          img: imgArray[21],
                        },
                      ].map((mealType) => (
                        <div
                          key={mealType.value}
                          className="flex flex-col justify-center items-center"
                          onClick={() =>
                            selectedMealType &&
                            selectedMealType.value === mealType.value
                              ? setSelectedMealType(null)
                              : setSelectedMealType(mealType)
                          }
                        >
                          <div
                            className="relative border rounded-lg "
                            style={{ height: "100px", width: "100px" }}
                          >
                            <img
                              src={mealType.img}
                              alt={mealType.label}
                              className="border rounded-lg"
                            />
                            {/* Green Outline */}
                            {selectedMealType &&
                              selectedMealType.value === mealType.value && (
                                <div
                                  className="absolute top-1/2 right-1/2 rounded-lg"
                                  style={{
                                    transform: "translate(50%, -50%)",
                                    width: "100px",
                                    height: "100px",
                                    border: "8px double green",
                                  }}
                                ></div>
                              )}
                          </div>
                          <div className="text-white text-center">
                            {mealType.label}
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </details>
                  {/* -----------------------------End of Selecting MealType-------------------------------- */}

                  {/* -----------------------------Selecting DishType (Mobile View)-------------------------------- */}
                  <details className="mt-5" open={false}>
                    <summary className="text-white text-lg">
                      <b>Select Dish Type</b>{" "}
                      <span className="text-gray-400 text-xs">
                        (click to view/hide)
                      </span>
                    </summary>
                    <div className=" mb-5">
                      <span className="text-gray-400 text-sm">
                        {"  "}
                        {selectedDishType
                          ? "Chosen Option: (" + selectedDishType.label + ")"
                          : "Pick any one (Optional)"}{" "}
                      </span>
                    </div>
                    {/* -----------------------------DishType Carousel-------------------------------- */}
                    <Carousel infinite={true} responsive={responsive}>
                      {[
                        {
                          value: "biscuits+and+cookies",
                          label: "Biscuits and Cookies",
                          img: imgArray[22],
                        },
                        { value: "bread", label: "Bread", img: imgArray[23] },
                        {
                          value: "desserts",
                          label: "Desserts",
                          img: imgArray[24],
                        },
                        { value: "salad", label: "Salads", img: imgArray[25] },
                        {
                          value: "sandwiches",
                          label: "Sandwiches",
                          img: imgArray[26],
                        },
                        { value: "soup", label: "Soup", img: imgArray[27] },
                        { value: "sweets", label: "Sweets", img: imgArray[28] },
                        { value: "drinks", label: "Drinks", img: imgArray[29] },
                        {
                          value: "main+course",
                          label: "Main Course",
                          img: imgArray[30],
                        },
                        {
                          value: "starter",
                          label: "Starter",
                          img: imgArray[31],
                        },
                        {
                          value: "pancake",
                          label: "Pancake",
                          img: imgArray[32],
                        },
                        { value: "pasta", label: "Pasta", img: imgArray[33] },
                        {
                          value: "seafood",
                          label: "Seafood",
                          img: imgArray[34],
                        },
                        { value: "pizza", label: "Pizza", img: imgArray[35] },
                        {
                          value: "side+dish",
                          label: "Side Dish",
                          img: imgArray[36],
                        },
                      ].map((dishType) => (
                        <div
                          key={dishType.value}
                          className="flex flex-col justify-center items-center"
                          onClick={() =>
                            selectedDishType &&
                            selectedDishType.value === dishType.value
                              ? setSelectedDishType(null)
                              : setSelectedDishType(dishType)
                          }
                        >
                          <div
                            className="relative border rounded-lg"
                            style={{ height: "100px", width: "100px" }}
                          >
                            <img
                              src={dishType.img}
                              alt={dishType.label}
                              className="border rounded-lg"
                            />
                            {/* Green Outline */}
                            {selectedDishType &&
                              selectedDishType.value === dishType.value && (
                                <div
                                  className="absolute top-1/2 right-1/2 rounded-lg"
                                  style={{
                                    transform: "translate(50%, -50%)",
                                    width: "100px",
                                    height: "100px",
                                    border: "8px double green",
                                  }}
                                ></div>
                              )}
                          </div>
                          <div className="text-black text-center">
                            {dishType.label}
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </details>
                  {/* -----------------------------End of Selecting DishType-------------------------------- */}

                  <h2
                    className="text-white text-lg text-center mb-3 mt-5"
                    style={{ fontFamily: ' cursive', fontWeight: "bold" }}
                  >
                    Random Recipes
                  </h2>
                  {/* -----------------------------Loading state is true until random recipes are fetched-------------------------------- */}
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    // -----------------------------Displaying Random Recipes, Card Style--------------------------------
                    <div className="flex flex-wrap gap-5 justify-center w-full">
                      {randomrecipes.map((randomRecipe) => (
                        <Card
                          key={randomRecipe.recipe.url}
                          className="Card transition-transform duration-300  hover:shadow-lg hover:cursor-pointer"
                          style={{
                            width: "100%",
                            height: "200px",
                            background: "#ebebeb",
                            padding: "0px",
                            margin: "0px",
                            border: "none",
                            borderRadius: "15px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            navigate(`/displayrecipe/${encodeURIComponent(randomRecipe.recipe.uri)}`)
                          }
                        >
                          <img
                            src={randomRecipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "60%",
                              height: "100%",
                              objectFit: "cover",
                              borderTopLeftRadius: "15px",
                              borderBottomLeftRadius: "15px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          {stringExistsInArray(favoriteRecipesURIs, randomRecipe.recipe.uri) ? (
                            <img
                            src={redheartimg}
                            alt="not found"
                            style={{
                              width: "25px",
                              height: "25px",
                              position: "absolute", // Make it absolutely positioned
                              top: "10px", // Distance from the top
                              right: "10px", // Distance from the right
                              cursor: "pointer", // Make it look like a button
                              zIndex: 1, // Ensure it appears above other content
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the card's onClick event from firing
                              handleFavoriteButtonToast();
                              handleFavorite(randomRecipe.recipe.uri);
                              console.log("Added to Favorites");
                            }}
                          />
                          ):(
                            <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "25px",
                              height: "25px",
                              position: "absolute", // Make it absolutely positioned
                              top: "10px", // Distance from the top
                              right: "10px", // Distance from the right
                              cursor: "pointer", // Make it look like a button
                              zIndex: 1, // Ensure it appears above other content
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the card's onClick event from firing
                              handleFavoriteButtonToast();
                              handleFavorite(randomRecipe.recipe.uri);
                              console.log("Added to Favorites");
                            }}
                          />
                          )
                          }
                          

                          <div className="flex items-center justify-around flex-col  w-full  h-full">
                            <div>

                            <CardHeader className="flex items-center p-1 ">
                              <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                                <b>{randomRecipe.recipe.label}</b>
                              </CardTitle>
                            </CardHeader>
                            </div>
                            <div>

                            <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{randomRecipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // -----------------------------Displaying Based on Search After options are selected--------------------------------
                <>
                  <h2
                    className="text-black text-lg font-bold text-center mb-3 mt-5"
                    style={{ fontFamily: 'cursive' }}
                  >
                    BASED ON YOUR SEARCH
                  </h2>

                  {/* -----------------------------Loading state is true until recipes are fetched-------------------------------- */}
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    // ------------------------------Displaying Recipes--------------------------------
                    <div className="flex flex-wrap gap-5 justify-center w-full">
                      {recipes.map((Recipe) => (
                        <Card
                          key={Recipe.recipe.url}
                          className="Card transition-transform duration-300 hover:shadow-lg hover:cursor-pointer"
                          style={{
                            width: "100%",
                            height: "200px",
                            background: "#ebebeb",
                            padding: "0px",
                            margin: "0px",
                            border: "none",
                            borderRadius: "15px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            navigate(`/displayrecipe/${encodeURIComponent(Recipe.recipe.uri)}`)
                          }
                        >
                          <img
                            src={Recipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "60%",
                              height: "100%",
                              objectFit: "cover",
                              borderTopLeftRadius: "15px",
                              borderBottomLeftRadius: "15px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          {stringExistsInArray(favoriteRecipesURIs, Recipe.recipe.uri) ? (
                            <img
                            src={redheartimg}
                            alt="not found"
                            style={{
                              width: "25px",
                              height: "25px",
                              position: "absolute", // Make it absolutely positioned
                              top: "10px", // Distance from the top
                              right: "10px", // Distance from the right
                              cursor: "pointer", // Make it look like a button
                              zIndex: 1, // Ensure it appears above other content
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the card's onClick event from firing
                              handleFavoriteButtonToast();
                              handleFavorite(Recipe.recipe.uri);
                              console.log("Added to Favorites");
                            }}
                          />
                          ):(
                            <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "25px",
                              height: "25px",
                              position: "absolute", // Make it absolutely positioned
                              top: "10px", // Distance from the top
                              right: "10px", // Distance from the right
                              cursor: "pointer", // Make it look like a button
                              zIndex: 1, // Ensure it appears above other content
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the card's onClick event from firing
                              handleFavoriteButtonToast();
                              handleFavorite(Recipe.recipe.uri);
                              console.log("Added to Favorites");
                            }}
                          />
                          )
                          }

                          <div className="flex items-center justify-around flex-col  w-full  h-full">
                            <div>

                            <CardHeader className="flex items-center p-1 ">
                              <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                                <b>{Recipe.recipe.label}</b>
                              </CardTitle>
                            </CardHeader>
                            </div>
                            <div>

                            <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{Recipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------Tablet Screen Display--------------------------------------- */}
      {/* -----------------------------Tablet Screen Display--------------------------------------- */}
      {/* -----------------------------Tablet Screen Display--------------------------------------- */}

      {breakpointIndex === 1 && (
         <div className=" min-h-screen">
         <div>
           <Toaster />
         </div>
         <div className="max-w-full  mx-auto p-4 flex flex-col">
         
           {/* whole search bar stuff below this with arrow */}
           <div className="flex flex-col items-left mb-3  w-full">
             
             {/* search bar/ back button/ search button */}
             <div className="flex justify-center">
               <div className="relative w-5/6 sm:w-1/2">
                 <button
                   className="absolute bg-gray-200 rounded-full left-1 top-1/2 transform -translate-y-1/2 pl-2 pr-2 pt-1 pb-1 text-gray-600 focus:outline-none"
                   onClick={goBack}
                 >
                   <span className="pi pi-arrow-left text-base"></span>
                 </button>
                 <input
                   type="text"
                   placeholder="Search for recipes..."
                   className="w-full pl-10 pr-3 py-2 border border-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   value={textQuery}
                   onChange={(e) => setTextQuery(e.target.value)}
                 />
               </div>
               {/* Centering the button */}
               <button
                 className="pl-3 pr-4 py-2  text-gray-600 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2o ml-1"
                 onClick={submitSearch}
               >
                 &nbsp;<i className="pi pi-search text-lg"></i>
               </button>
             </div>
   
           </div>
           {/* whole search bar stuff above this with arrow */}
           <div>
             {/* ------------While there are no recipes (Give options to search for recipes and in the meanwhile displaying random)----------------- */}
             {recipes.length === 0 ? (
               <>
                 {/* -----------------------------Selecting Cuisine (Mobile View)-------------------------------- */}
                 <details className="mt-5" open={true}>
                   <summary className="text-white text-lg">
                     <b>Select Cuisine</b>{" "}
                     <span className="text-gray-400 text-xs">
                       (click to view/hide)
                     </span>
                   </summary>
                   <div className=" mb-5">
                     <span className="text-gray-400 text-sm">
                       {"  "}
                       {selectedCuisine
                         ? "Chosen Cuisine: (" + selectedCuisine.label + ")"
                         : "Pick any one (Optional)"}
                     </span>
                   </div>
                   {/* -----------------------------Cuisine Carousel-------------------------------- */}
                   <Carousel
                     autoPlay={true}
                     infinite={true}
                     removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                     autoPlaySpeed={2000}
                     responsive={responsive}
                   >
                     {[
                       {
                         value: "american",
                         label: "American",
                         img: imgArray[0],
                       },
                       { value: "asian", label: "Asian", img: imgArray[1] },
                       {
                         value: "british",
                         label: "British",
                         img: imgArray[2],
                       },
                       {
                         value: "caribbean",
                         label: "Caribbean",
                         img: imgArray[3],
                       },
                       {
                         value: "central+europe",
                         label: "Central Europe",
                         img: imgArray[4],
                       },
                       {
                         value: "chinese",
                         label: "Chinese",
                         img: imgArray[5],
                       },
                       {
                         value: "eastern+europe",
                         label: "Eastern Europe",
                         img: imgArray[6],
                       },
                       { value: "french", label: "French", img: imgArray[7] },
                       { value: "indian", label: "Indian", img: imgArray[8] },
                       {
                         value: "italian",
                         label: "Italian",
                         img: imgArray[9],
                       },
                       {
                         value: "japanese",
                         label: "Japanese",
                         img: imgArray[10],
                       },
                       { value: "kosher", label: "Kosher", img: imgArray[11] },
                       {
                         value: "mediterranean",
                         label: "Mediterranean",
                         img: imgArray[12],
                       },
                       {
                         value: "mexican",
                         label: "Mexican",
                         img: imgArray[13],
                       },
                       {
                         value: "middle+eastern",
                         label: "Middle Eastern",
                         img: imgArray[14],
                       },
                       { value: "nordic", label: "Nordic", img: imgArray[15] },
                       {
                         value: "south+american",
                         label: "South American",
                         img: imgArray[16],
                       },
                       {
                         value: "south+east_asian",
                         label: "South East Asian",
                         img: imgArray[17],
                       },
                     ].map((cuisine) => (
                       <div
                         key={cuisine.value}
                         className="flex flex-col justify-center items-center"
                         onClick={() =>
                           selectedCuisine &&
                           selectedCuisine.value === cuisine.value
                             ? setSelectedCuisine(null)
                             : setSelectedCuisine(cuisine)
                         }
                       >
                         <div
                           className="relative border rounded-lg"
                           style={{ height: "150px", width: "150px" }}
                         >
                           <img
                             src={cuisine.img}
                             alt={cuisine.label}
                             className="border rounded-lg"
                           />
                           {/* Green Outline */}
                           {selectedCuisine &&
                             selectedCuisine.value === cuisine.value && (
                               <div
                                 className="absolute top-1/2 right-1/2 rounded-lg"
                                 style={{
                                   transform: "translate(50%, -50%)",
                                   width: "150px",
                                   height: "150px",
                                   border: "8px double green",
                                 }}
                               ></div>
                             )}
                         </div>
                         <div className="text-white text-center">
                           {cuisine.label}
                         </div>
                       </div>
                     ))}
                   </Carousel>
                 </details>
                 {/* -----------------------------End of Selecting Cuisine-------------------------------- */}
 
                 {/* -----------------------------Selecting MealType (Mobile View)-------------------------------- */}
                 <details className="mt-5" open={false}>
                   <summary className="text-white text-lg">
                     <b>Select Meal Type</b>{" "}
                     <span className="text-gray-400 text-xs">
                       (click to view/hide)
                     </span>
                   </summary>
                   <div className=" mb-5">
                     <span className="text-gray-400 text-sm">
                       {"  "}
                       {selectedMealType
                         ? "Chosen Option: (" + selectedMealType.label + ")"
                         : "Pick any one (Optional)"}{" "}
                     </span>
                   </div>
                   {/* -----------------------------MealType Carousel-------------------------------- */}
                   <Carousel
                     infinite={true}
                     responsive={responsive}
                     arrows={true}
                   >
                     {[
                       {
                         value: "breakfast",
                         label: "Breakfast",
                         img: imgArray[18],
                       },
                       {
                         value: "lunch+dinner",
                         label: "Lunch/Dinner",
                         img: imgArray[19],
                       },
                       { value: "snack", label: "Snack", img: imgArray[20] },
                       {
                         value: "teatime",
                         label: "Teatime",
                         img: imgArray[21],
                       },
                       {
                         value: "lunch+dinner",
                         label: "Lunch/Dinner",
                         img: imgArray[19],
                       },
                       
                     ].map((mealType) => (
                       <div
                         key={mealType.value}
                         className="flex flex-col justify-center items-center"
                         onClick={() =>
                           selectedMealType &&
                           selectedMealType.value === mealType.value
                             ? setSelectedMealType(null)
                             : setSelectedMealType(mealType)
                         }
                       >
                         <div
                           className="relative border rounded-lg "
                           style={{ height: "150px", width: "150px" }}
                         >
                           <img
                             src={mealType.img}
                             alt={mealType.label}
                             className="border rounded-lg"
                           />
                           {/* Green Outline */}
                           {selectedMealType &&
                             selectedMealType.value === mealType.value && (
                               <div
                                 className="absolute top-1/2 right-1/2 rounded-lg"
                                 style={{
                                   transform: "translate(50%, -50%)",
                                   width: "150px",
                                   height: "150px",
                                   border: "8px double green",
                                 }}
                               ></div>
                             )}
                         </div>
                         <div className="text-white text-center">
                           {mealType.label}
                         </div>
                       </div>
                     ))}
                   </Carousel>
                 </details>
                 {/* -----------------------------End of Selecting MealType-------------------------------- */}
 
                 {/* -----------------------------Selecting DishType (Mobile View)-------------------------------- */}
                 <details className="mt-5" open={false}>
                   <summary className="text-white text-lg">
                     <b>Select Dish Type</b>{" "}
                     <span className="text-gray-400 text-xs">
                       (click to view/hide)
                     </span>
                   </summary>
                   <div className=" mb-5">
                     <span className="text-gray-400 text-sm">
                       {"  "}
                       {selectedDishType
                         ? "Chosen Option: (" + selectedDishType.label + ")"
                         : "Pick any one (Optional)"}{" "}
                     </span>
                   </div>
                   {/* -----------------------------DishType Carousel-------------------------------- */}
                   <Carousel infinite={true} responsive={responsive}>
                     {[
                       {
                         value: "biscuits+and+cookies",
                         label: "Biscuits and Cookies",
                         img: imgArray[22],
                       },
                       { value: "bread", label: "Bread", img: imgArray[23] },
                       {
                         value: "desserts",
                         label: "Desserts",
                         img: imgArray[24],
                       },
                       { value: "salad", label: "Salads", img: imgArray[25] },
                       {
                         value: "sandwiches",
                         label: "Sandwiches",
                         img: imgArray[26],
                       },
                       { value: "soup", label: "Soup", img: imgArray[27] },
                       { value: "sweets", label: "Sweets", img: imgArray[28] },
                       { value: "drinks", label: "Drinks", img: imgArray[29] },
                       {
                         value: "main+course",
                         label: "Main Course",
                         img: imgArray[30],
                       },
                       {
                         value: "starter",
                         label: "Starter",
                         img: imgArray[31],
                       },
                       {
                         value: "pancake",
                         label: "Pancake",
                         img: imgArray[32],
                       },
                       { value: "pasta", label: "Pasta", img: imgArray[33] },
                       {
                         value: "seafood",
                         label: "Seafood",
                         img: imgArray[34],
                       },
                       { value: "pizza", label: "Pizza", img: imgArray[35] },
                       {
                         value: "side+dish",
                         label: "Side Dish",
                         img: imgArray[36],
                       },
                     ].map((dishType) => (
                       <div
                         key={dishType.value}
                         className="flex flex-col justify-center items-center"
                         onClick={() =>
                           selectedDishType &&
                           selectedDishType.value === dishType.value
                             ? setSelectedDishType(null)
                             : setSelectedDishType(dishType)
                         }
                       >
                         <div
                           className="relative border rounded-lg"
                           style={{ height: "150px", width: "150px" }}
                         >
                           <img
                             src={dishType.img}
                             alt={dishType.label}
                             className="border rounded-lg"
                           />
                           {/* Green Outline */}
                           {selectedDishType &&
                             selectedDishType.value === dishType.value && (
                               <div
                                 className="absolute top-1/2 right-1/2 rounded-lg"
                                 style={{
                                   transform: "translate(50%, -50%)",
                                   width: "150px",
                                   height: "150px",
                                   border: "8px double green",
                                 }}
                               ></div>
                             )}
                         </div>
                         <div className="text-white text-center">
                           {dishType.label}
                         </div>
                       </div>
                     ))}
                   </Carousel>
                 </details>
                 {/* -----------------------------End of Selecting DishType-------------------------------- */}
 
                 <h2
                   className="text-white text-2xl text-center mb-3 mt-5"
                   style={{ fontFamily: ' cursive', fontWeight: "bold" }}
                 >
                   Random Recipes
                 </h2>
                 {/* -----------------------------Loading state is true until random recipes are fetched-------------------------------- */}
                 {loading ? ( // Step 3: Conditional rendering
                   <div className="flex justify-center">
                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                   </div>
                 ) : (
                   // -----------------------------Displaying Random Recipes, Card Style--------------------------------
                   <div className="flex flex-wrap gap-5 justify-center w-full">
                     {randomrecipes.map((randomRecipe) => (
                       <Card
                         key={randomRecipe.recipe.url}
                         className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                         style={{
                          width: "500px",
                          height: "200px",
                          background: "#ebebeb",
                           padding: "0px",
                           margin: "0px",
                           border: "none",
                           borderRadius: "15px",
                           display: "flex",
                           flexDirection: "row",
                           alignItems: "center",
                           justifyContent: "flex-start",
                           boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                           position: "relative", // Added to make the heart image position absolute within the card
                         }}
                         onClick={() =>
                           navigate(`/displayrecipe/${encodeURIComponent(randomRecipe.recipe.uri)}`)
                         }
                       >
                         <img
                           src={randomRecipe.recipe.image}
                           alt="not found"
                           style={{
                             width: "100%",
                             height: "100%",
                             borderTopLeftRadius: "15px",
                             borderBottomLeftRadius: "15px",
                           }}
                         />
 
                         {/* Heart Image Positioned Absolutely */}
                         {stringExistsInArray(favoriteRecipesURIs, randomRecipe.recipe.uri) ? (
                           <img
                           src={redheartimg}
                           alt="not found"
                           style={{
                             width: "25px",
                             height: "25px",
                             position: "absolute", // Make it absolutely positioned
                             top: "10px", // Distance from the top
                             right: "10px", // Distance from the right
                             cursor: "pointer", // Make it look like a button
                             zIndex: 1, // Ensure it appears above other content
                           }}
                           onClick={(e) => {
                             e.stopPropagation(); // Prevent the card's onClick event from firing
                             handleFavoriteButtonToast();
                             handleFavorite(randomRecipe.recipe.uri);
                             console.log("Added to Favorites");
                           }}
                         />
                         ):(
                           <img
                           src={heartimg}
                           alt="not found"
                           style={{
                             width: "25px",
                             height: "25px",
                             position: "absolute", // Make it absolutely positioned
                             top: "10px", // Distance from the top
                             right: "10px", // Distance from the right
                             cursor: "pointer", // Make it look like a button
                             zIndex: 1, // Ensure it appears above other content
                           }}
                           onClick={(e) => {
                             e.stopPropagation(); // Prevent the card's onClick event from firing
                             handleFavoriteButtonToast();
                             handleFavorite(randomRecipe.recipe.uri);
                             console.log("Added to Favorites");
                           }}
                         />
                         )
                         }
                         
 
                         <div className="flex items-center justify-around flex-col  w-full  h-full">
                           <div>
 
                           <CardHeader className="flex items-center p-1 ">
                             <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                               <b>{randomRecipe.recipe.label}</b>
                             </CardTitle>
                           </CardHeader>
                           </div>
                           <div>
 
                           <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{randomRecipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                           </div>
                         </div>
                       </Card>
                     ))}
                   </div>
                 )}
               </>
             ) : (
               // -----------------------------Displaying Based on Search After options are selected--------------------------------
               <>
                 <h2
                   className="text-black text-lg font-bold text-center mb-3 mt-5"
                   style={{ fontFamily: 'cursive' }}
                 >
                   BASED ON YOUR SEARCH
                 </h2>
 
                 {/* -----------------------------Loading state is true until recipes are fetched-------------------------------- */}
                 {loading ? ( // Step 3: Conditional rendering
                   <div className="flex justify-center">
                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                   </div>
                 ) : (
                   // ------------------------------Displaying Recipes--------------------------------
                   <div className="flex flex-wrap gap-5 justify-center w-full">
                     {recipes.map((Recipe) => (
                       <Card
                         key={Recipe.recipe.url}
                         className="Card transition-transform duration-300 hover:shadow-lg hover:cursor-pointer"
                         style={{
                          width: "500px",
                          height: "200px",
                          background: "#ebebeb",
                           padding: "0px",
                           margin: "0px",
                           border: "none",
                           borderRadius: "15px",
                           display: "flex",
                           flexDirection: "row",
                           alignItems: "center",
                           justifyContent: "flex-start",
                           boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                           position: "relative", // Added to make the heart image position absolute within the card
                         }}
                         onClick={() =>
                           navigate(`/displayrecipe/${encodeURIComponent(Recipe.recipe.uri)}`)
                         }
                       >
                         <img
                           src={Recipe.recipe.image}
                           alt="not found"
                           style={{
                             width: "60%",
                             height: "100%",
                             objectFit: "cover",
                             borderTopLeftRadius: "15px",
                             borderBottomLeftRadius: "15px",
                           }}
                         />
 
                         {/* Heart Image Positioned Absolutely */}
                         {stringExistsInArray(favoriteRecipesURIs, Recipe.recipe.uri) ? (
                           <img
                           src={redheartimg}
                           alt="not found"
                           style={{
                             width: "25px",
                             height: "25px",
                             position: "absolute", // Make it absolutely positioned
                             top: "10px", // Distance from the top
                             right: "10px", // Distance from the right
                             cursor: "pointer", // Make it look like a button
                             zIndex: 1, // Ensure it appears above other content
                           }}
                           onClick={(e) => {
                             e.stopPropagation(); // Prevent the card's onClick event from firing
                             handleFavoriteButtonToast();
                             handleFavorite(Recipe.recipe.uri);
                             console.log("Added to Favorites");
                           }}
                         />
                         ):(
                           <img
                           src={heartimg}
                           alt="not found"
                           style={{
                             width: "25px",
                             height: "25px",
                             position: "absolute", // Make it absolutely positioned
                             top: "10px", // Distance from the top
                             right: "10px", // Distance from the right
                             cursor: "pointer", // Make it look like a button
                             zIndex: 1, // Ensure it appears above other content
                           }}
                           onClick={(e) => {
                             e.stopPropagation(); // Prevent the card's onClick event from firing
                             handleFavoriteButtonToast();
                             handleFavorite(Recipe.recipe.uri);
                             console.log("Added to Favorites");
                           }}
                         />
                         )
                         }
 
                         <div className="flex items-center justify-around flex-col  w-full  h-full">
                           <div>
 
                           <CardHeader className="flex items-center p-1 ">
                             <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                               <b>{Recipe.recipe.label}</b>
                             </CardTitle>
                           </CardHeader>
                           </div>
                           <div>
 
                           <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{Recipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                           </div>
                         </div>
                       </Card>
                     ))}
                   </div>
                 )}
               </>
             )}
           </div>
         </div>
       </div>
      )}

      {/* -----------------------------Large Screen Display--------------------------------------- */}
      {/* -----------------------------Large Screen Display--------------------------------------- */}
      {/* -----------------------------Large Screen Display--------------------------------------- */}

      {breakpointIndex === 2 && (
        <div className=" min-h-screen">
        <div>
          <Toaster />
        </div>
        <div className="max-w-full  mx-auto p-4 flex flex-col">
        
          {/* whole search bar stuff below this with arrow */}
          <div className="flex flex-col items-left mb-3  w-full">
            
            {/* search bar/ back button/ search button */}
            <div className="flex justify-center">
              <div className="relative w-5/6 sm:w-1/2">
                <button
                  className="absolute bg-gray-200 rounded-full left-1 top-1/2 transform -translate-y-1/2 pl-2 pr-2 pt-1 pb-1 text-gray-600 focus:outline-none"
                  onClick={goBack}
                >
                  <span className="pi pi-arrow-left text-base"></span>
                </button>
                <input
                  type="text"
                  placeholder="Search for recipes..."
                  className="w-full pl-10 pr-3 py-2 border border-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                />
              </div>
              {/* Centering the button */}
              <button
                className="pl-3 pr-4 py-2  text-gray-600 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2o ml-1"
                onClick={submitSearch}
              >
                &nbsp;<i className="pi pi-search text-lg"></i>
              </button>
            </div>
  
          </div>
          {/* whole search bar stuff above this with arrow */}
          <div>
            {/* ------------While there are no recipes (Give options to search for recipes and in the meanwhile displaying random)----------------- */}
            {recipes.length === 0 ? (
              <>
                {/* -----------------------------Selecting Cuisine (Mobile View)-------------------------------- */}
                <details className="mt-5" open={true}>
                  <summary className="text-white text-lg">
                    <b>Select Cuisine</b>{" "}
                    <span className="text-gray-400 text-xs">
                      (click to view/hide)
                    </span>
                  </summary>
                  <div className=" mb-5">
                    <span className="text-gray-400 text-sm">
                      {"  "}
                      {selectedCuisine
                        ? "Chosen Cuisine: (" + selectedCuisine.label + ")"
                        : "Pick any one (Optional)"}
                    </span>
                  </div>
                  {/* -----------------------------Cuisine Carousel-------------------------------- */}
                  <Carousel
                    autoPlay={true}
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                    autoPlaySpeed={2000}
                    responsive={responsive}
                  >
                    {[
                      {
                        value: "american",
                        label: "American",
                        img: imgArray[0],
                      },
                      { value: "asian", label: "Asian", img: imgArray[1] },
                      {
                        value: "british",
                        label: "British",
                        img: imgArray[2],
                      },
                      {
                        value: "caribbean",
                        label: "Caribbean",
                        img: imgArray[3],
                      },
                      {
                        value: "central+europe",
                        label: "Central Europe",
                        img: imgArray[4],
                      },
                      {
                        value: "chinese",
                        label: "Chinese",
                        img: imgArray[5],
                      },
                      {
                        value: "eastern+europe",
                        label: "Eastern Europe",
                        img: imgArray[6],
                      },
                      { value: "french", label: "French", img: imgArray[7] },
                      { value: "indian", label: "Indian", img: imgArray[8] },
                      {
                        value: "italian",
                        label: "Italian",
                        img: imgArray[9],
                      },
                      {
                        value: "japanese",
                        label: "Japanese",
                        img: imgArray[10],
                      },
                      { value: "kosher", label: "Kosher", img: imgArray[11] },
                      {
                        value: "mediterranean",
                        label: "Mediterranean",
                        img: imgArray[12],
                      },
                      {
                        value: "mexican",
                        label: "Mexican",
                        img: imgArray[13],
                      },
                      {
                        value: "middle+eastern",
                        label: "Middle Eastern",
                        img: imgArray[14],
                      },
                      { value: "nordic", label: "Nordic", img: imgArray[15] },
                      {
                        value: "south+american",
                        label: "South American",
                        img: imgArray[16],
                      },
                      {
                        value: "south+east_asian",
                        label: "South East Asian",
                        img: imgArray[17],
                      },
                    ].map((cuisine) => (
                      <div
                        key={cuisine.value}
                        className="flex flex-col justify-center items-center"
                        onClick={() =>
                          selectedCuisine &&
                          selectedCuisine.value === cuisine.value
                            ? setSelectedCuisine(null)
                            : setSelectedCuisine(cuisine)
                        }
                      >
                        <div
                          className="relative border rounded-lg"
                          style={{ height: "200px", width: "200px" }}
                        >
                          <img
                            src={cuisine.img}
                            alt={cuisine.label}
                            className="border rounded-lg"
                          />
                          {/* Green Outline */}
                          {selectedCuisine &&
                            selectedCuisine.value === cuisine.value && (
                              <div
                                className="absolute top-1/2 right-1/2 rounded-lg"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "200px",
                                  height: "200px",
                                  border: "8px double green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-white text-center">
                          {cuisine.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </details>
                {/* -----------------------------End of Selecting Cuisine-------------------------------- */}

                {/* -----------------------------Selecting MealType (Mobile View)-------------------------------- */}
                <details className="mt-5" open={false}>
                  <summary className="text-white text-lg">
                    <b>Select Meal Type</b>{" "}
                    <span className="text-gray-400 text-xs">
                      (click to view/hide)
                    </span>
                  </summary>
                  <div className=" mb-5">
                    <span className="text-gray-400 text-sm">
                      {"  "}
                      {selectedMealType
                        ? "Chosen Option: (" + selectedMealType.label + ")"
                        : "Pick any one (Optional)"}{" "}
                    </span>
                  </div>
                  {/* -----------------------------MealType Carousel-------------------------------- */}
                  <Carousel
                    infinite={true}
                    responsive={responsive}
                    arrows={true}
                  >
                    {[
                      {
                        value: "breakfast",
                        label: "Breakfast",
                        img: imgArray[18],
                      },
                      {
                        value: "lunch+dinner",
                        label: "Lunch/Dinner",
                        img: imgArray[19],
                      },
                      { value: "snack", label: "Snack", img: imgArray[20] },
                      {
                        value: "teatime",
                        label: "Teatime",
                        img: imgArray[21],
                      },
                      {
                        value: "lunch+dinner",
                        label: "Lunch/Dinner",
                        img: imgArray[19],
                      },
                      
                    ].map((mealType) => (
                      <div
                        key={mealType.value}
                        className="flex flex-col justify-center items-center"
                        onClick={() =>
                          selectedMealType &&
                          selectedMealType.value === mealType.value
                            ? setSelectedMealType(null)
                            : setSelectedMealType(mealType)
                        }
                      >
                        <div
                          className="relative border rounded-lg "
                          style={{ height: "200px", width: "200px" }}
                        >
                          <img
                            src={mealType.img}
                            alt={mealType.label}
                            className="border rounded-lg"
                          />
                          {/* Green Outline */}
                          {selectedMealType &&
                            selectedMealType.value === mealType.value && (
                              <div
                                className="absolute top-1/2 right-1/2 rounded-lg"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "200px",
                                  height: "200px",
                                  border: "8px double green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-white text-center">
                          {mealType.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </details>
                {/* -----------------------------End of Selecting MealType-------------------------------- */}

                {/* -----------------------------Selecting DishType (Mobile View)-------------------------------- */}
                <details className="mt-5" open={false}>
                  <summary className="text-white text-lg">
                    <b>Select Dish Type</b>{" "}
                    <span className="text-gray-400 text-xs">
                      (click to view/hide)
                    </span>
                  </summary>
                  <div className=" mb-5">
                    <span className="text-gray-400 text-sm">
                      {"  "}
                      {selectedDishType
                        ? "Chosen Option: (" + selectedDishType.label + ")"
                        : "Pick any one (Optional)"}{" "}
                    </span>
                  </div>
                  {/* -----------------------------DishType Carousel-------------------------------- */}
                  <Carousel infinite={true} responsive={responsive}>
                    {[
                      {
                        value: "biscuits+and+cookies",
                        label: "Biscuits and Cookies",
                        img: imgArray[22],
                      },
                      { value: "bread", label: "Bread", img: imgArray[23] },
                      {
                        value: "desserts",
                        label: "Desserts",
                        img: imgArray[24],
                      },
                      { value: "salad", label: "Salads", img: imgArray[25] },
                      {
                        value: "sandwiches",
                        label: "Sandwiches",
                        img: imgArray[26],
                      },
                      { value: "soup", label: "Soup", img: imgArray[27] },
                      { value: "sweets", label: "Sweets", img: imgArray[28] },
                      { value: "drinks", label: "Drinks", img: imgArray[29] },
                      {
                        value: "main+course",
                        label: "Main Course",
                        img: imgArray[30],
                      },
                      {
                        value: "starter",
                        label: "Starter",
                        img: imgArray[31],
                      },
                      {
                        value: "pancake",
                        label: "Pancake",
                        img: imgArray[32],
                      },
                      { value: "pasta", label: "Pasta", img: imgArray[33] },
                      {
                        value: "seafood",
                        label: "Seafood",
                        img: imgArray[34],
                      },
                      { value: "pizza", label: "Pizza", img: imgArray[35] },
                      {
                        value: "side+dish",
                        label: "Side Dish",
                        img: imgArray[36],
                      },
                    ].map((dishType) => (
                      <div
                        key={dishType.value}
                        className="flex flex-col justify-center items-center"
                        onClick={() =>
                          selectedDishType &&
                          selectedDishType.value === dishType.value
                            ? setSelectedDishType(null)
                            : setSelectedDishType(dishType)
                        }
                      >
                        <div
                          className="relative border rounded-lg"
                          style={{ height: "200px", width: "200px" }}
                        >
                          <img
                            src={dishType.img}
                            alt={dishType.label}
                            className="border rounded-lg"
                          />
                          {/* Green Outline */}
                          {selectedDishType &&
                            selectedDishType.value === dishType.value && (
                              <div
                                className="absolute top-1/2 right-1/2 rounded-lg"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "200px",
                                  height: "200px",
                                  border: "8px double green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-white text-center">
                          {dishType.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </details>
                {/* -----------------------------End of Selecting DishType-------------------------------- */}

                <h2
                  className="text-white text-2xl text-center mb-3 mt-5"
                  style={{ fontFamily: ' cursive', fontWeight: "bold" }}
                >
                  Random Recipes
                </h2>
                {/* -----------------------------Loading state is true until random recipes are fetched-------------------------------- */}
                {loading ? ( // Step 3: Conditional rendering
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                  </div>
                ) : (
                  // -----------------------------Displaying Random Recipes, Card Style--------------------------------
                  <div className="flex flex-wrap gap-10 justify-center w-full">
                    {randomrecipes.map((randomRecipe) => (
                      <Card
                        key={randomRecipe.recipe.url}
                        className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                        style={{
                          width: "500px",
                          height: "200px",
                          background: "#ebebeb",
                          padding: "0px",
                          margin: "0px",
                          border: "none",
                          borderRadius: "15px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                          position: "relative", // Added to make the heart image position absolute within the card
                        }}
                        onClick={() =>
                          navigate(`/displayrecipe/${encodeURIComponent(randomRecipe.recipe.uri)}`)
                        }
                      >
                        <img
                          src={randomRecipe.recipe.image}
                          alt="not found"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "15px",
                            borderBottomLeftRadius: "15px",
                          }}
                        />

                        {/* Heart Image Positioned Absolutely */}
                        {stringExistsInArray(favoriteRecipesURIs, randomRecipe.recipe.uri) ? (
                          <img
                          src={redheartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(randomRecipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        ):(
                          <img
                          src={heartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(randomRecipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        )
                        }
                        

                        <div className="flex items-center justify-around flex-col  w-full  h-full">
                          <div>

                          <CardHeader className="flex items-center p-1 ">
                            <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                              <b>{randomRecipe.recipe.label}</b>
                            </CardTitle>
                          </CardHeader>
                          </div>
                          <div>

                          <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{randomRecipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // -----------------------------Displaying Based on Search After options are selected--------------------------------
              <>
                <h2
                  className="text-black text-lg font-bold text-center mb-3 mt-5"
                  style={{ fontFamily: 'cursive' }}
                >
                  BASED ON YOUR SEARCH
                </h2>

                {/* -----------------------------Loading state is true until recipes are fetched-------------------------------- */}
                {loading ? ( // Step 3: Conditional rendering
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                  </div>
                ) : (
                  // ------------------------------Displaying Recipes--------------------------------
                  <div className="flex flex-wrap gap-5 justify-center w-full">
                    {recipes.map((Recipe) => (
                      <Card
                        key={Recipe.recipe.url}
                        className="Card transition-transform duration-300 hover:shadow-lg hover:cursor-pointer"
                        style={{
                          width: "500px",
                          height: "200px",
                          background: "#ebebeb",
                          padding: "0px",
                          margin: "0px",
                          border: "none",
                          borderRadius: "15px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                          position: "relative", // Added to make the heart image position absolute within the card
                        }}
                        onClick={() =>
                          navigate(`/displayrecipe/${encodeURIComponent(Recipe.recipe.uri)}`)
                        }
                      >
                        <img
                          src={Recipe.recipe.image}
                          alt="not found"
                          style={{
                            width: "60%",
                            height: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "15px",
                            borderBottomLeftRadius: "15px",
                          }}
                        />

                        {/* Heart Image Positioned Absolutely */}
                        {stringExistsInArray(favoriteRecipesURIs, Recipe.recipe.uri) ? (
                          <img
                          src={redheartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(Recipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        ):(
                          <img
                          src={heartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(Recipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        )
                        }

                        <div className="flex items-center justify-around flex-col  w-full  h-full">
                          <div>

                          <CardHeader className="flex items-center p-1 ">
                            <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                              <b>{Recipe.recipe.label}</b>
                            </CardTitle>
                          </CardHeader>
                          </div>
                          <div>

                          <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{Recipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* -----------------------------Larger Screen Display >1279px --------------------------------------- */}
      {/* -----------------------------Larger Screen Display >1279px --------------------------------------- */}
      {/* -----------------------------Larger Screen Display >1279px --------------------------------------- */}

      {breakpointIndex === 3 && (
        <div className=" min-h-screen">
        <div>
          <Toaster />
        </div>
        <div className="max-w-full  mx-auto p-4 flex flex-col">
        
          {/* whole search bar stuff below this with arrow */}
          <div className="flex flex-col items-left mb-3  w-full">
            
            {/* search bar/ back button/ search button */}
            <div className="flex justify-center">
              <div className="relative w-5/6 sm:w-1/2">
                <button
                  className="absolute bg-gray-200 rounded-full left-1 top-1/2 transform -translate-y-1/2 pl-2 pr-2 pt-1 pb-1 text-gray-600 focus:outline-none"
                  onClick={goBack}
                >
                  <span className="pi pi-arrow-left text-base"></span>
                </button>
                <input
                  type="text"
                  placeholder="Search for recipes..."
                  className="w-full pl-10 pr-3 py-2 border border-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                />
              </div>
              {/* Centering the button */}
              <button
                className="pl-3 pr-4 py-2  text-gray-600 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2o ml-1"
                onClick={submitSearch}
              >
                &nbsp;<i className="pi pi-search text-lg"></i>
              </button>
            </div>
  
          </div>
          {/* whole search bar stuff above this with arrow */}
          <div>
            {/* ------------While there are no recipes (Give options to search for recipes and in the meanwhile displaying random)----------------- */}
            {recipes.length === 0 ? (
              <>
                {/* -----------------------------Selecting Cuisine (Mobile View)-------------------------------- */}
                <details className="mt-5" open={true}>
                  <summary className="text-white text-lg">
                    <b>Select Cuisine</b>{" "}
                    <span className="text-gray-400 text-xs">
                      (click to view/hide)
                    </span>
                  </summary>
                  <div className=" mb-5">
                    <span className="text-gray-400 text-sm">
                      {"  "}
                      {selectedCuisine
                        ? "Chosen Cuisine: (" + selectedCuisine.label + ")"
                        : "Pick any one (Optional)"}
                    </span>
                  </div>
                  {/* -----------------------------Cuisine Carousel-------------------------------- */}
                  <Carousel
                    autoPlay={true}
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                    autoPlaySpeed={2000}
                    responsive={responsive}
                  >
                    {[
                      {
                        value: "american",
                        label: "American",
                        img: imgArray[0],
                      },
                      { value: "asian", label: "Asian", img: imgArray[1] },
                      {
                        value: "british",
                        label: "British",
                        img: imgArray[2],
                      },
                      {
                        value: "caribbean",
                        label: "Caribbean",
                        img: imgArray[3],
                      },
                      {
                        value: "central+europe",
                        label: "Central Europe",
                        img: imgArray[4],
                      },
                      {
                        value: "chinese",
                        label: "Chinese",
                        img: imgArray[5],
                      },
                      {
                        value: "eastern+europe",
                        label: "Eastern Europe",
                        img: imgArray[6],
                      },
                      { value: "french", label: "French", img: imgArray[7] },
                      { value: "indian", label: "Indian", img: imgArray[8] },
                      {
                        value: "italian",
                        label: "Italian",
                        img: imgArray[9],
                      },
                      {
                        value: "japanese",
                        label: "Japanese",
                        img: imgArray[10],
                      },
                      { value: "kosher", label: "Kosher", img: imgArray[11] },
                      {
                        value: "mediterranean",
                        label: "Mediterranean",
                        img: imgArray[12],
                      },
                      {
                        value: "mexican",
                        label: "Mexican",
                        img: imgArray[13],
                      },
                      {
                        value: "middle+eastern",
                        label: "Middle Eastern",
                        img: imgArray[14],
                      },
                      { value: "nordic", label: "Nordic", img: imgArray[15] },
                      {
                        value: "south+american",
                        label: "South American",
                        img: imgArray[16],
                      },
                      {
                        value: "south+east_asian",
                        label: "South East Asian",
                        img: imgArray[17],
                      },
                    ].map((cuisine) => (
                      <div
                        key={cuisine.value}
                        className="flex flex-col justify-center items-center"
                        onClick={() =>
                          selectedCuisine &&
                          selectedCuisine.value === cuisine.value
                            ? setSelectedCuisine(null)
                            : setSelectedCuisine(cuisine)
                        }
                      >
                        <div
                          className="relative border rounded-lg"
                          style={{ height: "200px", width: "200px" }}
                        >
                          <img
                            src={cuisine.img}
                            alt={cuisine.label}
                            className="border rounded-lg"
                          />
                          {/* Green Outline */}
                          {selectedCuisine &&
                            selectedCuisine.value === cuisine.value && (
                              <div
                                className="absolute top-1/2 right-1/2 rounded-lg"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "200px",
                                  height: "200px",
                                  border: "8px double green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-white text-center">
                          {cuisine.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </details>
                {/* -----------------------------End of Selecting Cuisine-------------------------------- */}

                {/* -----------------------------Selecting MealType (Mobile View)-------------------------------- */}
                <details className="mt-5" open={false}>
                  <summary className="text-white text-lg">
                    <b>Select Meal Type</b>{" "}
                    <span className="text-gray-400 text-xs">
                      (click to view/hide)
                    </span>
                  </summary>
                  <div className=" mb-5">
                    <span className="text-gray-400 text-sm">
                      {"  "}
                      {selectedMealType
                        ? "Chosen Option: (" + selectedMealType.label + ")"
                        : "Pick any one (Optional)"}{" "}
                    </span>
                  </div>
                  {/* -----------------------------MealType Carousel-------------------------------- */}
                  <Carousel
                    infinite={true}
                    responsive={responsive}
                    arrows={true}
                  >
                    {[
                      {
                        value: "breakfast",
                        label: "Breakfast",
                        img: imgArray[18],
                      },
                      {
                        value: "lunch+dinner",
                        label: "Lunch/Dinner",
                        img: imgArray[19],
                      },
                      { value: "snack", label: "Snack", img: imgArray[20] },
                      {
                        value: "teatime",
                        label: "Teatime",
                        img: imgArray[21],
                      },
                      {
                        value: "lunch+dinner",
                        label: "Lunch/Dinner",
                        img: imgArray[19],
                      },
                      
                    ].map((mealType) => (
                      <div
                        key={mealType.value}
                        className="flex flex-col justify-center items-center"
                        onClick={() =>
                          selectedMealType &&
                          selectedMealType.value === mealType.value
                            ? setSelectedMealType(null)
                            : setSelectedMealType(mealType)
                        }
                      >
                        <div
                          className="relative border rounded-lg "
                          style={{ height: "200px", width: "200px" }}
                        >
                          <img
                            src={mealType.img}
                            alt={mealType.label}
                            className="border rounded-lg"
                          />
                          {/* Green Outline */}
                          {selectedMealType &&
                            selectedMealType.value === mealType.value && (
                              <div
                                className="absolute top-1/2 right-1/2 rounded-lg"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "200px",
                                  height: "200px",
                                  border: "8px double green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-white text-center">
                          {mealType.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </details>
                {/* -----------------------------End of Selecting MealType-------------------------------- */}

                {/* -----------------------------Selecting DishType (Mobile View)-------------------------------- */}
                <details className="mt-5" open={false}>
                  <summary className="text-white text-lg">
                    <b>Select Dish Type</b>{" "}
                    <span className="text-gray-400 text-xs">
                      (click to view/hide)
                    </span>
                  </summary>
                  <div className=" mb-5">
                    <span className="text-gray-400 text-sm">
                      {"  "}
                      {selectedDishType
                        ? "Chosen Option: (" + selectedDishType.label + ")"
                        : "Pick any one (Optional)"}{" "}
                    </span>
                  </div>
                  {/* -----------------------------DishType Carousel-------------------------------- */}
                  <Carousel infinite={true} responsive={responsive}>
                    {[
                      {
                        value: "biscuits+and+cookies",
                        label: "Biscuits and Cookies",
                        img: imgArray[22],
                      },
                      { value: "bread", label: "Bread", img: imgArray[23] },
                      {
                        value: "desserts",
                        label: "Desserts",
                        img: imgArray[24],
                      },
                      { value: "salad", label: "Salads", img: imgArray[25] },
                      {
                        value: "sandwiches",
                        label: "Sandwiches",
                        img: imgArray[26],
                      },
                      { value: "soup", label: "Soup", img: imgArray[27] },
                      { value: "sweets", label: "Sweets", img: imgArray[28] },
                      { value: "drinks", label: "Drinks", img: imgArray[29] },
                      {
                        value: "main+course",
                        label: "Main Course",
                        img: imgArray[30],
                      },
                      {
                        value: "starter",
                        label: "Starter",
                        img: imgArray[31],
                      },
                      {
                        value: "pancake",
                        label: "Pancake",
                        img: imgArray[32],
                      },
                      { value: "pasta", label: "Pasta", img: imgArray[33] },
                      {
                        value: "seafood",
                        label: "Seafood",
                        img: imgArray[34],
                      },
                      { value: "pizza", label: "Pizza", img: imgArray[35] },
                      {
                        value: "side+dish",
                        label: "Side Dish",
                        img: imgArray[36],
                      },
                    ].map((dishType) => (
                      <div
                        key={dishType.value}
                        className="flex flex-col justify-center items-center"
                        onClick={() =>
                          selectedDishType &&
                          selectedDishType.value === dishType.value
                            ? setSelectedDishType(null)
                            : setSelectedDishType(dishType)
                        }
                      >
                        <div
                          className="relative border rounded-lg"
                          style={{ height: "200px", width: "200px" }}
                        >
                          <img
                            src={dishType.img}
                            alt={dishType.label}
                            className="border rounded-lg"
                          />
                          {/* Green Outline */}
                          {selectedDishType &&
                            selectedDishType.value === dishType.value && (
                              <div
                                className="absolute top-1/2 right-1/2 rounded-lg"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "200px",
                                  height: "200px",
                                  border: "8px double green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-white text-center">
                          {dishType.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </details>
                {/* -----------------------------End of Selecting DishType-------------------------------- */}

                <h2
                  className="text-white text-2xl text-center mb-3 mt-5"
                  style={{ fontFamily: ' cursive', fontWeight: "bold" }}
                >
                  Random Recipes
                </h2>
                {/* -----------------------------Loading state is true until random recipes are fetched-------------------------------- */}
                {loading ? ( // Step 3: Conditional rendering
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                  </div>
                ) : (
                  // -----------------------------Displaying Random Recipes, Card Style--------------------------------
                  <div className="flex flex-wrap gap-10 justify-center w-full">
                    {randomrecipes.map((randomRecipe) => (
                      <Card
                        key={randomRecipe.recipe.url}
                        className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                        style={{
                          width: "400px",
                          height: "200px",
                          background: "#ebebeb",
                          padding: "0px",
                          margin: "0px",
                          border: "none",
                          borderRadius: "15px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                          position: "relative", // Added to make the heart image position absolute within the card
                        }}
                        onClick={() =>
                          navigate(`/displayrecipe/${encodeURIComponent(randomRecipe.recipe.uri)}`)
                        }
                      >
                        <img
                          src={randomRecipe.recipe.image}
                          alt="not found"
                          style={{
                            width: "60%",
                            height: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "15px",
                            borderBottomLeftRadius: "15px",
                          }}
                        />

                        {/* Heart Image Positioned Absolutely */}
                        {stringExistsInArray(favoriteRecipesURIs, randomRecipe.recipe.uri) ? (
                          <img
                          src={redheartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(randomRecipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        ):(
                          <img
                          src={heartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(randomRecipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        )
                        }
                        

                        <div className="flex items-center justify-around flex-col  w-full  h-full">
                          <div>

                          <CardHeader className="flex items-center p-1 ">
                            <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                              <b>{randomRecipe.recipe.label}</b>
                            </CardTitle>
                          </CardHeader>
                          </div>
                          <div>

                          <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{randomRecipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // -----------------------------Displaying Based on Search After options are selected--------------------------------
              <>
                <h2
                  className="text-white text-lg font-bold text-center mb-3 mt-5"
                  style={{ fontFamily: 'cursive' }}
                >
                  BASED ON YOUR SEARCH
                </h2>

                {/* -----------------------------Loading state is true until recipes are fetched-------------------------------- */}
                {loading ? ( // Step 3: Conditional rendering
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                  </div>
                ) : (
                  // ------------------------------Displaying Recipes--------------------------------
                  <div className="flex flex-wrap gap-10 justify-center w-full">
                    {recipes.map((Recipe) => (
                      <Card
                        key={Recipe.recipe.url}
                        className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                        style={{
                          width: "400px",
                          height: "200px",
                          background: "#ebebeb",
                          padding: "0px",
                          margin: "0px",
                          border: "none",
                          borderRadius: "15px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                          position: "relative", // Added to make the heart image position absolute within the card
                        }}
                        onClick={() =>
                          navigate(`/displayrecipe/${encodeURIComponent(Recipe.recipe.uri)}`)
                        }
                      >
                        <img
                          src={Recipe.recipe.image}
                          alt="not found"
                          style={{
                            width: "60%",
                            height: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "15px",
                            borderBottomLeftRadius: "15px",
                          }}
                        />

                        {/* Heart Image Positioned Absolutely */}
                        {stringExistsInArray(favoriteRecipesURIs, Recipe.recipe.uri) ? (
                          <img
                          src={redheartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(Recipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        ):(
                          <img
                          src={heartimg}
                          alt="not found"
                          style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute", // Make it absolutely positioned
                            top: "10px", // Distance from the top
                            right: "10px", // Distance from the right
                            cursor: "pointer", // Make it look like a button
                            zIndex: 1, // Ensure it appears above other content
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(Recipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />
                        )
                        }

                        <div className="flex items-center justify-around flex-col  w-full  h-full">
                          <div>

                          <CardHeader className="flex items-center p-1 ">
                            <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                              <b>{Recipe.recipe.label}</b>
                            </CardTitle>
                          </CardHeader>
                          </div>
                          <div>

                          <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">{Recipe.recipe.calories.toFixed(1)} kcal</CardDescription>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Recipes;
