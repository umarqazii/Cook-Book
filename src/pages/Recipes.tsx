//////////////////////importing the required files and packages////////////////////////
import React, { useEffect, useState } from "react";
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
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";
import img6 from "../assets/6.jpg";
import img7 from "../assets/7.jpg";
import img8 from "../assets/8.jpg";
import img9 from "../assets/9.jpg";
import img10 from "../assets/10.jpg";
import img11 from "../assets/11.jpg";
import img12 from "../assets/12.jpg";
import img13 from "../assets/13.jpg";
import img14 from "../assets/14.jpg";
import img15 from "../assets/15.jpg";
import img16 from "../assets/16.jpg";
import img17 from "../assets/17.jpg";
import img18 from "../assets/18.jpg";
import img19 from "../assets/19.jpg";
import img20 from "../assets/20.jpg";
import img21 from "../assets/21.jpg";
import img22 from "../assets/22.jpg";
import { responsive } from "../data/ArrayExports";

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
import { fetchRecipes, fetchRandomRecipes } from "../lib/utils";
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////// interface declarations  //////////////////////////
interface Recipe {
  label: string;
  image: string;
  url: string;
  uri: string;
}

interface Hit {
  recipe: Recipe;
}
///////////////////////////////////////////////////////////////////////////

const Recipes = () => {
  /////////////////////////// state declarations  //////////////////////////
  const breakpoints = [640, 768, 1600]; // Example breakpoints: small, medium, large screens
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
  const [randomrecipes, setRandomRecipes] = useState<Hit[]>([]);
  //////////////////////////////////////////////////////////////////////////

  ///////////////////////// operations to be performed on states //////////////////////////
  useEffect(() => {
    console.log(selectedIngredients);
    console.log(selectedCuisine);
  }, [selectedIngredients, selectedCuisine]);

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
          uri: uri,
        }
      );
      // const response = await axios.post("http://localhost:8080/recipes/add-to-favorites", {
      //   uri: uri,
      // });
      toast.success(response.data.message);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to favorites");
    }
  };

  const handleFavoriteButtonToast = () => {
    toast("Processing your request...", {
      icon: "⏳",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  useEffect(() => {
    const fetchAndSetRandomRecipes = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching
      const hits = await fetchRandomRecipes();
      setRandomRecipes(hits); // Update the recipes state with the fetched hits
      setLoading(false); // Step 2: Set loading to false after fetching
    };

    //fetchAndSetRandomRecipes();
  }, []);

  const submitSearch = () => {
    const fetchAndSetRecipes = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching
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
      setLoading(false); // Step 2: Set loading to false after fetching
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

  //////////////////////////////////////////////////////////////////////////

  /////////////////////////// return statement //////////////////////////
  return (
    <>
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}
      {breakpointIndex === 0 && (
        <div className=" min-h-screen">
          <div>
            <Toaster />
          </div>
          <div className="max-w-full  mx-auto p-4 flex flex-col">
            {/* <h1
          className="text-5xl text-white font-semibold text-center mb-6"
          style={{ fontFamily: '"Matemasie", cursive' }}
        >
          Recipes
        </h1> */}
            <div className="flex justify-between items-center mb-3  w-full">
              
              <button
                className="text-white mr"
                onClick={goBack}
              >
                &nbsp;<i className="pi pi-angle-left text-2xl"></i>
              </button>
              {/* search bar */}
              <input
                type="text"
                placeholder="Search for recipes..."
                className="w-5/6 sm:w-1/2 px-3 py-2 border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
              />
              {/* Centering the button */}
              <button
                className="px-1 py-2  text-white border-white border-2 rounded-md shadow-sm focus:outline-none focus:ring-2o ml-1"
                onClick={submitSearch}
              >
                &nbsp;<i className="pi pi-search text-lg"></i>
              </button>
              {/* <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
                onClick={toggleDrawer}
              >
                &nbsp;<i className="pi pi-sliders-h"></i>
              </button> */}
            </div>

            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="bottom"
              className="border rounded-t-2xl"
              style={{
                height: "80vh",
              }}
            >
              <div className="flex flex-col ">
                <div className="flex justify-center flex-col items-center">
                  <div
                    className="bg-slate-400 mt-2 mb-2 sm:w-1/3 w-2/3 h-1 border rounded-lg cursor-pointer"
                    onClick={toggleDrawer}
                  ></div>
                  <h2
                    className="text-xl mb-10 cursor-pointer"
                    onClick={toggleDrawer}
                  >
                    Apply Filters <i className="pi pi-filter"></i>
                  </h2>
                  <div className="bg-slate-400 mt-2 w-full h-0.3 border rounded-lg"></div>
                </div>
                {/* dropdown menu to select multiple ingredients */}
                <p className="text-black text-center mb-1 mt-2">
                  Select Ingredients
                </p>
                <div className="flex justify-center mb-5">
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    defaultValue={[ingredientOptions[0]]}
                    isMulti
                    options={ingredientOptions}
                    className="w-11/12 sm:w-1/2"
                    onChange={(selectedOptions) =>
                      setSelectedIngredients(selectedOptions)
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                </div>
                {/* dropdown menu to select a single cuisine */}
                <p className="text-black text-center mb-1">Select Cuisine</p>
                <div className="flex justify-center mb-5">
                  <select
                    className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleCuisineChange}
                  >
                    <option value="">Select a cuisine</option>
                    {cuisineOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* dropdown menu to select a single dish type */}
                <div className="flex justify-center">
                  <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                </div>
                <p className="text-black text-center mb-1">Select Dish Type</p>
                <div className="flex justify-center mb-5">
                  <select
                    className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleDishTypeChange}
                  >
                    <option value="">Select a dish type</option>
                    {dishTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* dropdown menu to select a single meal type */}
                <div className="flex justify-center">
                  <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                </div>
                <p className="text-black text-center mb-1">Select Meal Type</p>
                <div className="flex justify-center mb-5">
                  <select
                    className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleMealTypeChange}
                  >
                    <option value="" className="text-gray-300">
                      Select a meal type
                    </option>
                    {mealTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center">
                  {" "}
                  {/* Centering the button */}
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
              {recipes.length === 0 ? (
                <>
                  <div className="mt-5 mb-5">
                    <span>
                      <b>Cuisines for You</b>
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
                      { value: "american", label: "American", img: img1 },
                      { value: "asian", label: "Asian", img: img2 },
                      { value: "british", label: "British", img: img3 },
                      { value: "caribbean", label: "Caribbean", img: img4 },
                      {
                        value: "central+europe",
                        label: "Central Europe",
                        img: img5,
                      },
                      { value: "chinese", label: "Chinese", img: img6 },
                      {
                        value: "eastern+europe",
                        label: "Eastern Europe",
                        img: img7,
                      },
                      { value: "french", label: "French", img: img8 },
                      { value: "indian", label: "Indian", img: img9 },
                      { value: "italian", label: "Italian", img: img10 },
                      { value: "japanese", label: "Japanese", img: img11 },
                      { value: "kosher", label: "Kosher", img: img12 },
                      {
                        value: "mediterranean",
                        label: "Mediterranean",
                        img: img13,
                      },
                      { value: "mexican", label: "Mexican", img: img14 },
                      {
                        value: "middle+eastern",
                        label: "Middle Eastern",
                        img: img15,
                      },
                      { value: "nordic", label: "Nordic", img: img16 },
                      {
                        value: "south+american",
                        label: "South American",
                        img: img17,
                      },
                      {
                        value: "south+east_asian",
                        label: "South East Asian",
                        img: img18,
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
                                  border: "5px solid green",
                                }}
                              ></div>
                            )}
                        </div>
                        <div className="text-black text-center">
                          {cuisine.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>

                  <div className="mt-5 mb-5">
                    <span>
                      <b>Meal Types</b>
                    </span>
                  </div>
                  <Carousel
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    responsive={responsive}
                  >
                    <div className="flex justify-center flex-col">
                      <div
                        className="border rounded-lg"
                        style={{ height: "100px", width: "100px" }}
                      >
                        <img
                          src={img19}
                          alt="breakfast"
                          className="border rounded-lg"
                        />
                        {/* a div below this to name the cuisine. max width should be 100px */}
                      </div>
                      <div className="text-black text-center">Breakfast</div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div
                        className="border rounded-lg"
                        style={{ height: "100px", width: "100px" }}
                      >
                        <img
                          src={img20}
                          alt="Lunch/Dinner"
                          className="border rounded-lg"
                        />
                      </div>
                      <div className="text-black text-center w-24">
                        Lunch/Dinner
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div
                        className="border rounded-lg"
                        style={{ height: "100px", width: "100px" }}
                      >
                        <img
                          src={img21}
                          alt="Snack"
                          className="border rounded-lg"
                        />
                      </div>
                      <div className="text-black text-center">Snack</div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div
                        className="border rounded-lg"
                        style={{ height: "100px", width: "100px" }}
                      >
                        <img
                          src={img22}
                          alt="Teatime"
                          className="border rounded-lg"
                        />
                      </div>
                      <div className="text-black text-center">Teatime</div>
                    </div>
                  </Carousel>
                  <h2 className="text-white text-lg text-center mb-3 mt-3">
                    --- RANDOM RECIPES FOR YOU ---
                  </h2>
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                      {randomrecipes.map((randomRecipe) => (
                        <Card
                          key={randomRecipe.recipe.url}
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
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            window.open(randomRecipe.recipe.url, "_blank")
                          }
                        >
                          <img
                            src={randomRecipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "100%",
                              height: "60%",
                              objectFit: "cover",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "35px",
                              height: "35px",
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

                          <CardContent>
                            <div className="flex items-center justify-center">
                              <CardHeader className="self-center">
                                <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                                  {randomRecipe.recipe.label}
                                </CardTitle>
                              </CardHeader>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-white text-lg text-center mb-3 mt-3">
                    BASED ON YOUR SEARCH 
                  </h2>
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                      {recipes.map((Recipe) => (
                        <Card
                          key={Recipe.recipe.url}
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
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            window.open(Recipe.recipe.url, "_blank")
                          }
                        >
                          <img
                            src={Recipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "100%",
                              height: "60%",
                              objectFit: "cover",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "35px",
                              height: "35px",
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

                          <CardContent>
                            <div className="flex items-center justify-center">
                              <CardHeader className="self-center">
                                <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                                  {Recipe.recipe.label}
                                </CardTitle>
                              </CardHeader>
                            </div>
                          </CardContent>
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
      {breakpointIndex === 1 && (
        <div className=" min-h-screen">
          <div>
            <Toaster />
          </div>
          <div className="max-w-full  mx-auto p-4 flex flex-col">
            <h1
              className="text-5xl text-white font-semibold text-center mb-6"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              Recipes
            </h1>
            <div className="flex justify-center mb-3">
              {" "}
              {/* Centering the button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
                onClick={toggleDrawer}
              >
                Browse Recipes &nbsp;<i className="pi pi-search"></i>
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Drawer
                  open={isOpen}
                  onClose={toggleDrawer}
                  direction="bottom"
                  className="border rounded-t-2xl"
                  style={{
                    height: "80vh",
                    width: "80vw",
                    left: "10%",
                    transform: "translateX(-50%)", // Center horizontally
                  }}
                >
                  <div className="flex flex-col ">
                    <div className="flex justify-center flex-col items-center">
                      <div
                        className="bg-slate-400 mt-2 mb-2 sm:w-1/3 w-2/3 h-1 border rounded-lg cursor-pointer"
                        onClick={toggleDrawer}
                      ></div>
                      <h2
                        className="text-xl mb-10 cursor-pointer"
                        onClick={toggleDrawer}
                      >
                        Apply Filters <i className="pi pi-filter"></i>
                      </h2>
                      <div className="bg-slate-400 mt-2 w-full h-0.3 border rounded-lg"></div>
                    </div>
                    {/* dropdown menu to select multiple ingredients */}
                    <p className="text-black text-center mb-1 mt-2">
                      Select Ingredients
                    </p>
                    <div className="flex justify-center mb-5">
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[ingredientOptions[0]]}
                        isMulti
                        options={ingredientOptions}
                        className="w-11/12 sm:w-1/2"
                        onChange={(selectedOptions) =>
                          setSelectedIngredients(selectedOptions)
                        }
                      />
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                    </div>
                    {/* dropdown menu to select a single cuisine */}
                    <p className="text-black text-center mb-1">
                      Select Cuisine
                    </p>
                    <div className="flex justify-center mb-5">
                      <select
                        className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleCuisineChange}
                      >
                        <option value="">Select a cuisine</option>
                        {cuisineOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* dropdown menu to select a single dish type */}
                    <div className="flex justify-center">
                      <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                    </div>
                    <p className="text-black text-center mb-1">
                      Select Dish Type
                    </p>
                    <div className="flex justify-center mb-5">
                      <select
                        className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleDishTypeChange}
                      >
                        <option value="">Select a dish type</option>
                        {dishTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* dropdown menu to select a single meal type */}
                    <div className="flex justify-center">
                      <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                    </div>
                    <p className="text-black text-center mb-1">
                      Select Meal Type
                    </p>
                    <div className="flex justify-center mb-5">
                      <select
                        className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleMealTypeChange}
                      >
                        <option value="" className="text-gray-300">
                          Select a meal type
                        </option>
                        {mealTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-center">
                      {" "}
                      {/* Centering the button */}
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5"
                        onClick={toggleDrawer}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </Drawer>
              </div>
            </div>
            <div>
              {recipes.length === 0 ? (
                <>
                  <h2 className="text-white text-lg text-center mb-3 mt-3">
                    --- RANDOM RECIPES FOR YOU ---
                  </h2>
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                      {randomrecipes.map((randomRecipe) => (
                        <Card
                          key={randomRecipe.recipe.url}
                          className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                          style={{
                            width: "21rem",
                            height: "330px",
                            background: "white",
                            padding: "0px",
                            margin: "0px",
                            border: "2px solid #000",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            window.open(randomRecipe.recipe.url, "_blank")
                          }
                        >
                          <img
                            src={randomRecipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "100%",
                              height: "60%",
                              objectFit: "cover",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "35px",
                              height: "35px",
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

                          <CardContent>
                            <div className="flex items-center justify-center">
                              <CardHeader className="self-center">
                                <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                                  {randomRecipe.recipe.label}
                                </CardTitle>
                              </CardHeader>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-white text-lg text-center mb-3 mt-3">
                    --- RECIPES BASED ON YOUR SEARCH ---
                  </h2>
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                      {recipes.map((Recipe) => (
                        <Card
                          key={Recipe.recipe.url}
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
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            window.open(Recipe.recipe.url, "_blank")
                          }
                        >
                          <img
                            src={Recipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "100%",
                              height: "60%",
                              objectFit: "cover",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "35px",
                              height: "35px",
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

                          <CardContent>
                            <div className="flex items-center justify-center">
                              <CardHeader className="self-center">
                                <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                                  {Recipe.recipe.label}
                                </CardTitle>
                              </CardHeader>
                            </div>
                          </CardContent>
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
      {breakpointIndex === 2 && (
        <div className=" min-h-screen">
          <div>
            <Toaster />
          </div>
          <div className="max-w-full  mx-auto p-4 flex flex-col">
            <h1
              className="text-5xl text-white font-semibold text-center mb-6"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              Recipes
            </h1>
            <div className="flex justify-center mb-3">
              {" "}
              {/* Centering the button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto"
                onClick={toggleDrawer}
              >
                Browse Recipes &nbsp;<i className="pi pi-search"></i>
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Drawer
                  open={isOpen}
                  onClose={toggleDrawer}
                  direction="bottom"
                  className="border rounded-t-2xl"
                  style={{
                    height: "90vh",
                    width: "60vw",
                    left: "20%",
                    transform: "translateX(-50%)", // Center horizontally
                  }}
                >
                  <div className="flex flex-col ">
                    <div className="flex justify-center flex-col items-center">
                      <div
                        className="bg-slate-400 mt-2 mb-2 sm:w-1/3 w-2/3 h-1 border rounded-lg cursor-pointer"
                        onClick={toggleDrawer}
                      ></div>
                      <h2
                        className="text-xl mb-10 cursor-pointer"
                        onClick={toggleDrawer}
                      >
                        Apply Filters <i className="pi pi-filter"></i>
                      </h2>
                      <div className="bg-slate-400 mt-2 w-full h-0.3 border rounded-lg"></div>
                    </div>
                    {/* dropdown menu to select multiple ingredients */}
                    <p className="text-black text-center mb-1 mt-2">
                      Select Ingredients
                    </p>
                    <div className="flex justify-center mb-5">
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[ingredientOptions[0]]}
                        isMulti
                        options={ingredientOptions}
                        className="w-11/12 sm:w-1/2"
                        onChange={(selectedOptions) =>
                          setSelectedIngredients(selectedOptions)
                        }
                      />
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                    </div>
                    {/* dropdown menu to select a single cuisine */}
                    <p className="text-black text-center mb-1">
                      Select Cuisine
                    </p>
                    <div className="flex justify-center mb-5">
                      <select
                        className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleCuisineChange}
                      >
                        <option value="">Select a cuisine</option>
                        {cuisineOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* dropdown menu to select a single dish type */}
                    <div className="flex justify-center">
                      <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                    </div>
                    <p className="text-black text-center mb-1">
                      Select Dish Type
                    </p>
                    <div className="flex justify-center mb-5">
                      <select
                        className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleDishTypeChange}
                      >
                        <option value="">Select a dish type</option>
                        {dishTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* dropdown menu to select a single meal type */}
                    <div className="flex justify-center">
                      <div className="bg-slate-400 mt-2 mb-2 w-full sm:w-3/5 h-0.3 border rounded-lg"></div>
                    </div>
                    <p className="text-black text-center mb-1">
                      Select Meal Type
                    </p>
                    <div className="flex justify-center mb-5">
                      <select
                        className="w-3/4 sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleMealTypeChange}
                      >
                        <option value="" className="text-gray-300">
                          Select a meal type
                        </option>
                        {mealTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-center">
                      {" "}
                      {/* Centering the button */}
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5"
                        onClick={toggleDrawer}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </Drawer>
              </div>
            </div>
            <div>
              {recipes.length === 0 ? (
                <>
                  <h2 className="text-white text-lg text-center mb-3 mt-3">
                    --- RANDOM RECIPES FOR YOU ---
                  </h2>
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                      {randomrecipes.map((randomRecipe) => (
                        <Card
                          key={randomRecipe.recipe.url}
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
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            window.open(randomRecipe.recipe.url, "_blank")
                          }
                        >
                          <img
                            src={randomRecipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "100%",
                              height: "60%",
                              objectFit: "cover",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "35px",
                              height: "35px",
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

                          <CardContent>
                            <div className="flex items-center justify-center">
                              <CardHeader className="self-center">
                                <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                                  {randomRecipe.recipe.label}
                                </CardTitle>
                              </CardHeader>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-white text-lg text-center mb-3 mt-3">
                    --- RECIPES BASED ON YOUR SEARCH ---
                  </h2>
                  {loading ? ( // Step 3: Conditional rendering
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-5 p-5 justify-center w-full">
                      {recipes.map((Recipe) => (
                        <Card
                          key={Recipe.recipe.url}
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
                            position: "relative", // Added to make the heart image position absolute within the card
                          }}
                          onClick={() =>
                            window.open(Recipe.recipe.url, "_blank")
                          }
                        >
                          <img
                            src={Recipe.recipe.image}
                            alt="not found"
                            style={{
                              width: "100%",
                              height: "60%",
                              objectFit: "cover",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                            }}
                          />

                          {/* Heart Image Positioned Absolutely */}
                          <img
                            src={heartimg}
                            alt="not found"
                            style={{
                              width: "35px",
                              height: "35px",
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

                          <CardContent>
                            <div className="flex items-center justify-center">
                              <CardHeader className="self-center">
                                <CardTitle className="text-[#005D90] text-center overflow-clip h-24">
                                  {Recipe.recipe.label}
                                </CardTitle>
                              </CardHeader>
                            </div>
                          </CardContent>
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
