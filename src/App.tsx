import React from "react";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";  
import { BrowserRouter, Route, Routes} from 'react-router-dom';
// import "./App.css";


function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<Recipes />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
