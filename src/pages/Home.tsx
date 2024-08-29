import React, { useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import gsap from 'gsap'; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Typed from "typed.js";
import { useResponsive } from "./useResponsive";
import img1 from "../assets/foodplate.png";
import img2 from "../assets/handholdingplate1.png";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const breakpoints = [640, 768, 1600]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SplitType and GSAP animations
    const splitTypes = document.querySelectorAll<HTMLElement>(".reveal-type");

    splitTypes.forEach((char) => {
      const text = new SplitType(char, { types: "words" });

      gsap.from(text.words, {
        duration: 2,
        x: 100,
        opacity: 0,
        stagger: 0.5,
        ease: "expo",
        
      });
    });

    // GSAP animations for images
    gsap.from('.plate-img', {
      x: -300,
      duration: 3,
      ease: "anticipate",
      opacity: 0,
    });
    gsap.from('.circle-plate-img', {x: -300, duration: 3, ease: "anticipate", opacity: 0});
    gsap.to('.circle-plate-img', { rotation: 100, duration: 3, repeat:0 });

  }, [breakpointIndex]); // This ensures that the animation triggers every time the breakpoint changes

  useEffect(() => {
    // Typed.js animations
    const typedSkillOptions = {
      strings: ["Millions of Recipes on your Fingertips"],
      typeSpeed: 70,
    };

    let typedSkill: Typed | null = null;

    if (breakpointIndex === 0) {
      typedSkill = new Typed(".typedSkillSmall", typedSkillOptions);
    } else if (breakpointIndex === 1) {
      typedSkill = new Typed(".typedSkillMedium", typedSkillOptions);
    } else if (breakpointIndex === 2) {
      typedSkill = new Typed(".typedSkillLarge", typedSkillOptions);
    }

    return () => {
      // Cleanup Typed.js instance
      if (typedSkill) {
        typedSkill.destroy();
      }
    };
  }, [breakpointIndex]); // This will re-run the Typed.js effect on every breakpoint change

  return (
    <>
      {breakpointIndex === 0 && (
        <div className="flex flex-wrap min-h-screen" style={{ minHeight: "calc(100vh - 72px)" }}>
          <div ref={container} className="w-full bg-gray-700 flex flex-col items-center">
            <img src={img2} alt="foodimg" className="object-cover pr-5 pl-5 pb-10 plate-img w-5/6" />
            <h1
              className="text-5xl text-white mb-3 text-center reveal-type"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              Welcome to your Cook Book!
            </h1>
            <div className="text-2xl text-white text-center pl-5 pr-5 mt-10">
              <span
                className="typedSkillSmall text-xl "
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
        <div className="flex flex-wrap min-h-screen" style={{ minHeight: "calc(100vh - 72px)" }}>
          <div className="w-full sm:w-1/2 bg-gray-700 flex items-center justify-center">
            <img src={img1} alt="hospital" className="ml-3 w-1/1 sm: object-cover circle-plate-img" />
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-gray-700">
            <h1
              className="text-5xl text-white mb-3 text-center reveal-type"
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
