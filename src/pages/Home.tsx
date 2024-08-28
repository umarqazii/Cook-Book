import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import Typed from "typed.js";
import { useResponsive } from "./useResponsive";
import img1 from "../assets/foodplate.png";
import img2 from "../assets/handholdingplate2.png";

const Home = () => {
  const breakpoints = [480, 768, 1600]; // Example breakpoints: small, medium, large screens
    const breakpointIndex = useResponsive(breakpoints);
  
  //   useEffect(() => {
  //   var typedSkill = new Typed(".typedSkill", {
  //     strings: ["Millions of Recipes on your Fingertips"],
  //     typeSpeed: 70,
  //   });

  //   return () => {
  //     typedSkill.destroy();
  //   };
  // }, []);

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
    <>
    {breakpointIndex === 0 && 
      <div className="flex flex-wrap min-h-screen">
        {/* Image Section */}
        <div className="w-full bg-gray-700 flex flex-col items-center">
          <img
            src={img2}
            alt="hospital"
            className="w-full"
          />
          <h1
            className="text-5xl text-white mb-3 text-center"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            Welcome to your Cook Book!
          </h1>
          <div className="text-2xl text-white text-center">
            <span
              className="typedSkill text-xl"
              style={{ fontFamily: '"Cedarville Cursive", cursive' }}
            ></span>
            </div>
        </div>

      </div>
    }
    {breakpointIndex === 1 && 
      <div className="flex flex-wrap min-h-screen">
      {/* Image Section */}
      <div className="w-full sm:w-1/2 bg-gray-700 flex items-center justify-center">
        <img
          src={img1}
          alt="hospital"
          className="ml-3 w-1/1 sm: object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-gray-700">
        <h1
          className="text-5xl text-white mb-3 text-center"
          style={{ fontFamily: '"Matemasie", cursive' }}
        >
          Welcome to your Cook Book!
        </h1>
        <div className="text-2xl text-white text-center">
          <span
            className="typedSkill text-xl"
            style={{ fontFamily: '"Cedarville Cursive", cursive' }}
          ></span>
        </div>
      </div>
    </div>
    }
    {breakpointIndex === 2 && 
      <div className="flex flex-wrap min-h-screen">
      {/* Image Section */}
      <div className="w-full sm:w-1/2 bg-gray-700 flex items-center justify-center">
        <img
          src={img1}
          alt="hospital"
          className="ml-3 w-1/1 sm: object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-gray-700">
        <h1
          className="text-5xl text-white mb-3 text-center"
          style={{ fontFamily: '"Matemasie", cursive' }}
        >
          Welcome to your Cook Book!
        </h1>
        <div className="text-2xl text-white text-center">
            <span
              className="typedSkill text-xl"
              style={{ fontFamily: '"Cedarville Cursive", cursive' }}
            ></span>
            </div>
      </div>
    </div>
    }

    </>
  );
};

export default Home;
