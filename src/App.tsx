import React from "react";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes} from 'react-router-dom';
// import "./App.css";


function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
