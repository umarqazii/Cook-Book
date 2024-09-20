import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Tools from "./pages/Tools";
import Favorites from "./pages/Favorites";
import DisplayRecipe from "./pages/DisplayRecipe";
import DisplayMyRecipes from "./pages/DisplayMyRecipes";
import AddRecipe from "./pages/AddRecipe";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoutes";
import Test from "./pages/BackgroundTest";
import {Toaster} from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (token) {
          await axios.get('https://cook-book-api-rho.vercel.app/auth/protected', {
          //await axios.get('http://localhost:8080/auth/protected', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch {
        setToken(null);
        localStorage.removeItem('token');
      }
    };

    if (token) {
      checkToken();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/favorites" element={<PrivateRoute component={Favorites} />} />
        <Route path="/displayrecipe/:uri/" element={<DisplayRecipe />}/>
        <Route path="/addrecipe" element={<PrivateRoute component={AddRecipe} />}/>
        <Route path="/displaymyrecipes" element={<PrivateRoute component={DisplayMyRecipes} />}/>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/test" element={<Test/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
