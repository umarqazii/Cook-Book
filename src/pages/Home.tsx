import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import Typed from "typed.js";
import img from "../assets/foodplate.png";

const Home = () => {
  useEffect(() => {

    var typedSkill = new Typed(".typedSkill", {
      strings: ["Millions of Recipes on your Fingertips"],
      typeSpeed: 70,
    });

    return () => {
      typedSkill.destroy();
    };
  }, []);

  return (
<div className="flex flex-wrap min-h-screen">

{/* Image Section */}
<div className="w-full sm:w-1/2 bg-gray-700 flex items-center justify-center">
  <img src={img} alt="hospital" className="ml-3 w-1/1 sm: object-cover" />
</div>

{/* Text Section */}
<div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-gray-700">
  <h1 className="text-5xl text-white mb-3 text-center" style={{ fontFamily: '"Matemasie", cursive' }}>Welcome to your Cook Book!</h1>
  <div className="text-2xl text-white text-center">
    <span className="typedSkill text-xl" style={{ fontFamily: '"Cedarville Cursive", cursive' }}></span>
  </div>
</div>

</div>
  );
};

export default Home;
