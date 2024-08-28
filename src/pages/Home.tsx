import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import Typed from "typed.js";
import { useResponsive } from "./useResponsive";
import img1 from "../assets/foodplate.png";
import img2 from "../assets/handholdingplate1.png";

const Home = () => {
  const breakpoints = [640, 768, 1600]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  
  useEffect(() => {
    let typedSkillOptions = {
      strings: ["Millions of Recipes on your Fingertips"],
      typeSpeed: 70,
    };

    // Conditionally create Typed.js instances based on screen size
    let typedSkill: Typed;
    if (breakpointIndex === 0) {
      typedSkill = new Typed(".typedSkillSmall", typedSkillOptions);
    } else if (breakpointIndex === 1) {
      typedSkill = new Typed(".typedSkillMedium", typedSkillOptions);
    }else if (breakpointIndex === 2) {
      typedSkill = new Typed(".typedSkillLarge", typedSkillOptions);
    }

    return () => {
      if (typedSkill) {
        typedSkill.destroy();
      }
    };
  }, [breakpointIndex]);

  return (
    <>
      {breakpointIndex === 0 && (
        <div className="flex flex-wrap min-h-screen">
          <div className="w-full bg-gray-700 flex flex-col items-center">
            <img src={img2} alt="hospital" className="object-cover pr-5 pl-5 pb-5" />
            <h1
              className="text-5xl text-white mb-3 text-center"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              Welcome to your Cook Book!
            </h1>
            <div className="text-2xl text-white text-center">
              <span
                className="typedSkillSmall text-xl"
                style={{ fontFamily: '"Cedarville Cursive", cursive' }}
              ></span>
            </div>
          </div>
        </div>
      )}
      {breakpointIndex === 1 && (
        <div className="flex flex-wrap min-h-screen">
          <div className="w-full sm:w-1/2 bg-gray-700 flex items-center justify-center">
            <img src={img1} alt="hospital" className="ml-3 w-1/1 sm: object-cover" />
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-gray-700">
            <h1
              className="text-5xl text-white mb-3 text-center"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              Welcome to your Cook Book!
            </h1>
            <div className="text-2xl text-white text-center">
              <span
                className="typedSkillMedium text-2xl"
                style={{ fontFamily: '"Cedarville Cursive", cursive' }}
              ></span>
            </div>
          </div>
        </div>
      )}

      {breakpointIndex === 2 && (
        <div className="flex flex-wrap min-h-screen">
          <div className="w-full sm:w-1/2 bg-gray-700 flex items-center justify-center">
            <img src={img1} alt="hospital" className="ml-3 w-1/1 sm: object-cover" />
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-gray-700">
            <h1
              className="text-5xl text-white mb-3 text-center"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              Welcome to your Cook Book!
            </h1>
            <div className="text-2xl text-white text-center">
              <span
                className="typedSkillLarge text-2xl"
                style={{ fontFamily: '"Cedarville Cursive", cursive' }}
              ></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
