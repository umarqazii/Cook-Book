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
import { imgArray } from "../data/ArrayExports";
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

const staticRecipe1: Hit = {
  recipe: {
    label: "Pakistani-style White Lentils with a Sizzling Oil Garnish",
      image: "https://edamam-product-images.s3.amazonaws.com/web-img/8fe/8feb16b4e6232823518712e5ee490e4e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIElfjtIXwTQkT%2BpSQFHFrTbdw5aDgi6xnBJMIIvBy4GaAiAbeRbwP0LEl6AC9zLNrjr%2FOQ1mQGu8R82QHBd2SoBxQyq4BQhsEAAaDDE4NzAxNzE1MDk4NiIMwz3KQt4lXMJCwtKAKpUFU7x0cnJPRp%2BOCii1kHlPEGOGcznXnj%2Br4RalhXCtF5LdM56hH07UmhAyTnJ59ynRjnNQPL8%2FqjnC3OIUAqFimZGtUFU%2Bt0SW%2FQ%2Bi2BRtAwqzyDqmBE8XOwEYdQtFFTXAChls4fS%2FNzoyIjSFGum7kbXfRMPpMgOTPy981D9jeaA5I2Sj6xrJtTasiOkKOxdtOjn6c14OHeO6ITwj3Ur2jkyfKe2jpI5z1YAn7ZtT38nElAU%2B%2FwJHSxMT34iVA7Z1jWzSYz368BKZWPxrEA37aSJij%2F6oONBeIhQuqowOUZ3ot53tRBI2qZCTQijBfg%2F2GY5cY2qSlZZX484E5y9ZXJVN2SEDlmc3jEdXTc0dwkBdhQPLumtaCwsAj7XgDx6BwNS9%2ByniM2RLh4ilY9fKtgCCYjNebTvN%2FZF1qeUjJgZ9%2FWVDmy1zIvnYpoU0QQqZ9kMvc76qcC5aom%2FbvEdwy7Hj5Uhna5F9%2BV7DHa0znJziY4hTL%2FgcQ7%2BDBScQGBqhT5gNDg7NS5ur6LCWw9Ev0YmAIPKAyn%2FSN5JDfpxDXqV1p1KSvpQsgZmxHn%2FteSrpe3tbB3JpGs0dfYcJyyZ7W3VzZfLdS%2BDZfXtSbb%2BkyycYoNDBXR0q%2FeygyZl0opwSbO3sLQoS62YMZqRObhsn8T2%2FcYgHgzseZv6cSKpTnJBkeyXHSrEiUwTvInGJunmGSHaiiPhq2AU3omTKbDfXH8vldyLRIdmb0NLxWojuSNfSI1Ib5MdMU0PLEXNN75uZJShUYq5zVf5u%2B%2BuSG1nkpeaSHKiSjLUIckaHcCe8zO8dlcMdH85Gox5bl8ty2ddQ%2FzVsHiXtF4qC720PUeM3TFFkZl3qTmDEPWOzEOYB7Kd8E3euuTCxgMq2BjqyAfQSIW23umRmu7O%2BY5%2Bw2USsjJ3VntdzptmBIqeor5N58y19t3ukmFghu6vRVoFInuz1soVU8YI21%2BFXHSIqX%2BsLjy4La%2FtIZ1byx9AVITCXlUmdy%2FmqtUUcTsTtP1S9i0E29Kmv%2BNwgTjcWRjscboGa0nqEoVuVH11%2FjDR5AfaYhYzCxYNREcSMLZRWgckNiMVpjdDeALQ0Bpp9udNUiGsttzqhREOajgKNo3AG0UHWwuw%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240831T030450Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFM26ZNCR4%2F20240831%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2f2f169195d8caf6bbc3bf950f47b87f96da260145aaba1d8e4587197fe9eec5",
      url: "https://food52.com/recipes/8539-pakistani-style-white-lentils-with-a-sizzling-oil-garnish",
      uri: "http://www.edamam.com/ontologies/edamam.owl#recipe_1e38243afa522e6775a99d917fd2d5c3",
  },
};

const staticRecipe2: Hit = {
  recipe: {
    label: "Labneh And Roasted Carrots Grain Bowl recipes",
      image: "https://edamam-product-images.s3.amazonaws.com/web-img/c23/c23c0b69806670cb72ddcbc70db1ee1c?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJIMEYCIQCaeSMwkohNuoaLtYM5cJJeK70szH%2F0huEMNh4O9KPPPwIhANSsZb3fXArs35Dh8ZitFgQoEMozDsR0GvnaqvIdusVeKrkFCGsQABoMMTg3MDE3MTUwOTg2Igx7O1G%2FTmwjFc5o6ekqlgUXi%2F5Xs7FXgj09dkSa5bHwWn6GW4vpVvesdzl9ER2Gz2j6fvEwdjhefJoqQKTasm5%2FnL1MB9ZSqJGHhp9oghQOcujgdiyoiwNuChcoGQ12udl0WhRLpv6pV021sG%2FJmRLBpx9ciNv%2BQ8femondadVfF5zfougAqsQAGOJOlcXWu%2Bs8zVHxwEdElrcL8BV5DpEfoN%2FJ2otNQ54SfLxNo2qRgOqb46KPqsVlWSY2kyl6%2FkYpaRRsxgBw0sEbt4aLIUNkeXZqk%2FEQ5e2Td2HomSrepoSbB7osCfdth4tYz5w7g3cONyIyBvtXLOTGqR0aowfy8jmVM4%2BKRanh3ftBc%2FoUw%2FHBJOfeTYj0AmqdWtIjVcB3eimf77nZUORifaKTfapl8D%2BR0%2B9hBAlKxhUOHxsDsVtMoz151JjEBNDPQqUc3IK7b%2B1dEJUuT1yta%2FTMivWH8s3%2F6xunxgSDszXaig2Gz%2F6OaDYSOJxyqT25FAArJYFgV%2FWaMFloRoiBQYzFM1oghNRxdLVb1A%2BWMKXmaXU0riqlu8o5UE%2BOVf%2B4%2FWU7NSi%2BwKXmBYAvkRRaTf%2BCbpAOYGBayQyWFRekB7qzTqa93%2BPiVQcASgIohMKOtKWBDkblseUTZ99MkxXCMASQ9efUay9HBRVL5lKnUF6fFTyjLzxNbIDiyunXN6nK3hOQLm1GKgIqmqBpMjk807EIhzEX4waxPTk5zznPojqaJq65jPQVBnOVixqquM9%2FwVHJEqHqfnHFqnn2589ZVeS19NYpEW%2FbjZBdqYhLiiGIMOM2%2BXnb8ajTGpSoeN4p0%2FeKLX16hT0gSZPITmtWii0FF%2BkFmKL3u%2BSVaSwMgtFnIm2BRdGcj3VCeon1hgbwxhtIkEKlnnhpQzDi98m2BjqwAWi4RB7CcHTMxNim38S0ddib2njGD8EAtX%2FzGoU9FnFzPb8LINSiitzuCi9PmqiDhtYpEW0WSd1WapyZIAJkJC%2B8b1QITSW3UMP5WM5MhWE0%2FELKH7AVTQ1OCtSeANgBIoAqYksBeritKvKfS%2FlBPNZbAkxDSXFtktOb1PeS5FUTyJzsApHtYQgLLI8wVKm5O3rcGHjTkhynQBuexUGM5pWRatApoay7oH%2BsRVnqbP%2Bd&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240831T031008Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFP724GHGW%2F20240831%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bae07ee9e439c66465dd1c217167cbc8b976c2c7aa013a282466705609062f62",
      url: "http://www.foodrepublic.com/recipes/labneh-and-roasted-carrots-grain-bowl/",
      uri: "http://www.edamam.com/ontologies/edamam.owl#recipe_2652c7766f1ca026afb1a777f0307f35",
  },
};
///////////////////////////////////////////////////////////////////////////

const Recipes = () => {
  /////////////////////////// state declarations  //////////////////////////
  let toastid="";
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
  const [myStaticRecipes, setMyStaticRecipes] = useState<Hit[]>([staticRecipe1, staticRecipe2]);
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to favorites");
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

  // fetching random recipes
  useEffect(() => {
    const fetchAndSetRandomRecipes = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching
      const hits = await fetchRandomRecipes();
      setRandomRecipes(hits); // Update the recipes state with the fetched hits
      setLoading(false); // Step 2: Set loading to false after fetching
    };

    fetchAndSetRandomRecipes();
  }, []);

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
      if(hits.length===0){
        toast.remove(toastid);
        toast.error("No recipes found");
      }
      else{
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

  //////////////////////////////////////////////////////////////////////////

  /////////////////////////// return statement //////////////////////////
  return (
    <>
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}
      {/* ---------------------------Mobile Screen Diplay-------------------------- */}

      {breakpointIndex === 0 && (
        <div className=" min-h-screen">
          <div>
            <Toaster />
          </div>
          <div className="max-w-full  mx-auto p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3  w-full">
              <button className="text-white mr" onClick={goBack}>
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
            </div>

            <div>
              {/* ------------While there are no recipes (Give options to search for recipes and in the meanwhile displaying random)----------------- */}
              {recipes.length === 0 ? (
                <>
                  {/* -----------------------------Selecting Cuisine (Mobile View)-------------------------------- */}
                  <details className="mt-5" open={true}>
                  <summary className="text-black text-lg"><b>Select Cuisine</b> <span className="text-gray-600 text-xs">(click to view/hide)</span></summary>
                  <div className=" mb-5">
                    
                      <span className="text-gray-600 text-sm">
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
                      { value: "british", label: "British", img: imgArray[2] },
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
                      { value: "chinese", label: "Chinese", img: imgArray[5] },
                      {
                        value: "eastern+europe",
                        label: "Eastern Europe",
                        img: imgArray[6],
                      },
                      { value: "french", label: "French", img: imgArray[7] },
                      { value: "indian", label: "Indian", img: imgArray[8] },
                      { value: "italian", label: "Italian", img: imgArray[9] },
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
                      { value: "mexican", label: "Mexican", img: imgArray[13] },
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
                        <div className="text-black text-center">
                          {cuisine.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                  </details>
                  {/* -----------------------------End of Selecting Cuisine-------------------------------- */}


                  {/* -----------------------------Selecting MealType (Mobile View)-------------------------------- */}
                  <details className="mt-5" open={true}>
                  <summary className="text-black text-lg"><b>Select Meal Type</b> <span className="text-gray-600 text-xs">(click to view/hide)</span></summary>
                  <div className=" mb-5">
                    
                      <span className="text-gray-600 text-sm">
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
                      { value: "teatime", label: "Teatime", img: imgArray[21] },
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
                        <div className="text-black text-center">
                          {mealType.label}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                  </details>
                  {/* -----------------------------End of Selecting MealType-------------------------------- */}


                    {/* -----------------------------Selecting DishType (Mobile View)-------------------------------- */}
                    <details className="mt-5" open={false}>
                    <summary className="text-black text-lg"><b>Select Dish Type</b> <span className="text-gray-600 text-xs">(click to view/hide)</span></summary>
                    <div className=" mb-5">

                      <span className="text-gray-600 text-sm">
                        {"  "}
                        {selectedDishType
                          ? "Chosen Option: (" + selectedDishType.label + ")"
                          : "Pick any one (Optional)"}{" "}
                      </span>
                    
                  </div>
                  {/* -----------------------------DishType Carousel-------------------------------- */}
                  <Carousel
                    infinite={true}
                    responsive={responsive}
                  >
                    {[
                      {
                        value: "biscuits+and+cookies",
                        label: "Biscuits and Cookies",
                        img: imgArray[22],
                      },
                      {value: "bread", label: "Bread", img: imgArray[23]},
                      {value: "desserts", label: "Desserts", img: imgArray[24]},
                      {value: "salad", label: "Salads", img: imgArray[25]},
                      {value: "sandwiches", label: "Sandwiches", img: imgArray[26]},
                      {value: "soup", label: "Soup", img: imgArray[27]},
                      {value: "sweets", label: "Sweets", img: imgArray[28]},
                      {value: "drinks", label: "Drinks", img: imgArray[29]},
                      {value: "main+course", label: "Main Course", img: imgArray[30]},
                      {value: "starter", label: "Starter", img: imgArray[31]},
                      {value: "pancake", label: "Pancake", img: imgArray[32]},
                      {value: "pasta", label: "Pasta", img: imgArray[33]},
                      {value: "seafood", label: "Seafood", img: imgArray[34]},
                      {value: "pizza", label: "Pizza", img: imgArray[35]},
                      {value: "side+dish", label: "Side Dish", img: imgArray[36]},
                      
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


                  <h2 className="text-black text-lg text-center mb-3 mt-5" style={{ fontFamily: '"Matemasie", cursive'}}>
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
                          width: "100%",
                          height: "200px",
                          background: "white",
                          padding: "0px",
                          margin: "0px",
                          border: "none",
                          borderRadius: "15px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
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
                            width: "60%",
                            height: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "15px",
                            borderBottomLeftRadius: "15px",
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
                            borderRadius: "100%",
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(randomRecipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />

                        <div className="flex items-center justify-around  w-full">
                          <CardHeader className="flex items-center p-1 ">
                            <CardTitle className="flex items-center justify-center text-[#005D90] text-base overflow-clip h-40 w-full">
                              <b>{randomRecipe.recipe.label}</b>
                            </CardTitle>
                          </CardHeader>
                        </div>
                      </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // -----------------------------Displaying Based on Search After options are selected--------------------------------
                <>
                  <h2 className="text-black text-lg text-center mb-3 mt-5" style={{ fontFamily: "Matemasie"}}>
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
                        className="Card transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                        style={{
                          width: "100%",
                          height: "200px",
                          background: "white",
                          padding: "0px",
                          margin: "0px",
                          border: "none",
                          borderRadius: "15px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
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
                            width: "60%",
                            height: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "15px",
                            borderBottomLeftRadius: "15px",
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
                            borderRadius: "100%",
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick event from firing
                            handleFavoriteButtonToast();
                            handleFavorite(Recipe.recipe.uri);
                            console.log("Added to Favorites");
                          }}
                        />

                        <div className="flex items-center justify-around  w-full">
                          <CardHeader className="flex items-center p-1 ">
                            <CardTitle className="flex items-center justify-center text-[#005D90] text-base overflow-clip h-40 w-full">
                              <b>{Recipe.recipe.label}</b>
                            </CardTitle>
                          </CardHeader>
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

      {/* -----------------------------Large Screen Display--------------------------------------- */}
      {/* -----------------------------Large Screen Display--------------------------------------- */}
      {/* -----------------------------Large Screen Display--------------------------------------- */}

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
