import React from "react";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Tools from "./pages/Tools";
import Favorites from "./pages/Favorites";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  let bgvid = "/assets/bgvid.mp4";
  return (
    <BrowserRouter>
      <div>
        <Toaster />
      </div>
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
