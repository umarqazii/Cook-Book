import React from "react";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Tools from "./pages/Tools";
import Favorites from "./pages/Favorites";
import DisplayRecipe from "./pages/DisplayRecipe";
import toast, { Toaster } from "react-hot-toast";
import DisplayMyRecipes from "./pages/DisplayMyRecipes";
import AddRecipe from "./pages/AddRecipe";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  
  return (
    <BrowserRouter>
      <div>
        <Toaster />
      </div>
      
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/displayrecipe/:uri/" element={<DisplayRecipe />}/>
        <Route path="/addrecipe" element={<AddRecipe/>}/>
        <Route path="/displaymyrecipes" element={<DisplayMyRecipes/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
