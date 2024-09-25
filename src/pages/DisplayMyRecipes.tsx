import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Nav from "../components/NavbarRes";
import { useResponsive } from "../styling/useResponsive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/cards";
import heartimg from "../assets/redheart.png";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../lib/Config";

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const breakpoints = [480, 768, 1279];
  const breakpointIndex = useResponsive(breakpoints);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({}); // Image URLs state
  let logo = "/logo192.png";

  const fetchImageUrl = async (fileEncodedName: string) => {
    try {
      const imgRef = ref(imageDB, `files/${fileEncodedName}`);
      const url = await getDownloadURL(imgRef);
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        [fileEncodedName]: url,
      }));
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

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

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios.post(
          "https://cook-book-api-rho.vercel.app/recipes/get-all-recipes",{
            userid: getIdFromToken(),
          }
        );
        // const response = await axios.post(
        //   "http://localhost:8080/recipes/get-all-recipes",{
        //     userid: getIdFromToken(),
        //   }
        // );
        const fetchedRecipes = response.data.recipes;
        setRecipes(fetchedRecipes);

        // Fetch image URLs for each recipe
        fetchedRecipes.forEach((recipe: Recipe) => {
          fetchImageUrl(recipe.imageName);
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getRecipes();
  }, []);

  return (
    <>
      <Nav />
      {breakpointIndex === 0 && (
        <div className=" min-h-screen p-4">
          <div
            className="flex justify-center text-white text-5xl mb-10"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            <h1>My Recipes</h1>
          </div>
          {recipes.length === 0 ? (
            <div className="flex justify-center text-white text-2xl">
              <h1>No Recipes Found</h1>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5 justify-center w-full">
              {recipes.map((Recipe) => (
                <Card
                  key={Recipe.imageName}
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
                    position: "relative",
                  }}
                >
                  <img
                    src={imageUrls[Recipe.imageName] || logo} // Fetch image dynamically
                    alt="Recipe"
                    style={{
                      width: "70%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderBottomLeftRadius: "15px",
                    }}
                  />

                  <img
                    src={heartimg}
                    alt="not found"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  />

                  <div className="flex items-center justify-around flex-col  w-full  h-full">
                    <div>
                      <CardHeader className="flex items-center p-1 ">
                        <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                          <b>{Recipe.recipeName}</b>
                        </CardTitle>
                      </CardHeader>
                    </div>
                    <div>
                      <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">
                        {Recipe.dateOfPosting.slice(0, 10)}
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      {breakpointIndex === 1 && (
        <div className=" min-h-screen p-4">
          <div
            className="flex justify-center text-white text-5xl mb-10"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            <h1>My Recipes</h1>
          </div>
          {recipes.length === 0 ? (
            <div className="flex justify-center text-white text-2xl">
              <h1>No Recipes Found</h1>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5 justify-center w-full">
              {recipes.map((Recipe) => (
                <Card
                  key={Recipe.imageName}
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
                    position: "relative",
                  }}
                >
                  <img
                    src={imageUrls[Recipe.imageName] || logo} // Fetch image dynamically
                    alt="Recipe"
                    style={{
                      width: "70%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderBottomLeftRadius: "15px",
                    }}
                  />

                  <img
                    src={heartimg}
                    alt="not found"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  />

                  <div className="flex items-center justify-around flex-col  w-full  h-full">
                    <div>
                      <CardHeader className="flex items-center p-1 ">
                        <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                          <b>{Recipe.recipeName}</b>
                        </CardTitle>
                      </CardHeader>
                    </div>
                    <div>
                      <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">
                        {Recipe.dateOfPosting.slice(0, 10)}
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      {breakpointIndex === 2 && (
        <div className=" min-h-screen p-4">
          <div
            className="flex justify-center text-white text-5xl mb-10"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            <h1>My Recipes</h1>
          </div>
          {recipes.length === 0 ? (
            <div className="flex justify-center text-white text-2xl">
              <h1>No Recipes Found</h1>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5 justify-center w-full">
              {recipes.map((Recipe) => (
                <Card
                  key={Recipe.imageName}
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
                    position: "relative",
                  }}
                >
                  <img
                    src={imageUrls[Recipe.imageName] || logo} // Fetch image dynamically
                    alt="Recipe"
                    style={{
                      width: "70%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderBottomLeftRadius: "15px",
                    }}
                  />

                  <img
                    src={heartimg}
                    alt="not found"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  />

                  <div className="flex items-center justify-around flex-col  w-full  h-full">
                    <div>
                      <CardHeader className="flex items-center p-1 ">
                        <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                          <b>{Recipe.recipeName}</b>
                        </CardTitle>
                      </CardHeader>
                    </div>
                    <div>
                      <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">
                        {Recipe.dateOfPosting.slice(0, 10)}
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      {breakpointIndex === 3 && (
        <div className=" min-h-screen p-4">
          <div
            className="flex justify-center text-white text-5xl mb-10"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            <h1>My Recipes</h1>
          </div>
          {recipes.length === 0 ? (
            <div className="flex justify-center text-white text-2xl">
              <h1>No Recipes Found</h1>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5 justify-center w-full">
              {recipes.map((Recipe) => (
                <Card
                  key={Recipe.imageName}
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
                    position: "relative",
                  }}
                >
                  <img
                    src={imageUrls[Recipe.imageName] || logo} // Fetch image dynamically
                    alt="Recipe"
                    style={{
                      width: "300px",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderBottomLeftRadius: "15px",
                    }}
                  />

                  <img
                    src={heartimg}
                    alt="not found"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  />

                  <div className="flex items-center justify-around flex-col  w-full  h-full">
                    <div>
                      <CardHeader className="flex items-center p-1 ">
                        <CardTitle className="flex items-center justify-center text-[#333333] text-lg overflow-clip h-40 w-full  font-sans">
                          <b>{Recipe.recipeName}</b>
                        </CardTitle>
                      </CardHeader>
                    </div>
                    <div>
                      <CardDescription className="flex items-center p-1 text-gray-600 text-sm ">
                        {Recipe.dateOfPosting.slice(0, 10)}
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DisplayMyRecipes;
