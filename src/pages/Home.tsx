import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import gsap from 'gsap'; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Typed from "typed.js";
import { useResponsive } from "../styling/useResponsive";
import Navbar from "../components/navbar";
import Nav from "../components/NavbarRes";
import img1 from "../assets/foodplate.png";
import img2 from "../assets/handholdingplate1.png";
import bgimg from "../assets/low-poly-grid-haikei.png";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const breakpoints = [640, 768, 1600]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const container = useRef<HTMLDivElement>(null);
  const [displayUsername, setDisplayUsername] = React.useState(false);
  const [username, setUsername] = React.useState<string | null>(null);

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token){
      setDisplayUsername(true)
      setUsername(getUsernameFromToken())
    }
  },[])

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
  function getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token'); // Retrieve the JWT from local storage
    if (!token) {
      console.log("No token found in local storage");
      return null;
    }
  
    const decodedToken = parseJwt(token); // Manually decode the JWT
    if (decodedToken && decodedToken.Username) {
      return decodedToken.Username; // Extract and return the _id
    } else {
      console.log("Invalid or missing username in token");
      return null;
    }
  }

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


    gsap.from('.login-btn', {scale:2, y:300 , duration: 3, ease: "anticipate", opacity: 0});

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
    <Nav />
      {breakpointIndex === 0 && (
        <div className="flex flex-wrap min-h-screen" style={{ minHeight: "calc(100vh - 86px)" }}>
          <div ref={container} className="w-full  flex flex-col items-center" >
            <img src={img2} alt="foodimg" className="object-cover pr-5 pl-5 pb-10 plate-img w-5/6"style={{
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1)10%)",  // Safari compatibility
        maskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1)10%)"  // For other browsers
      }} />
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
        <div className="flex flex-wrap min-h-screen" style={{ minHeight: "calc(100vh - 86px)" }}>
          <div className="w-full sm:w-1/2  flex items-center justify-center">
            <img src={img1} alt="hospital" className="ml-3 w-1/1 sm: object-cover circle-plate-img" />
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center ">
            <h1
              className="text-5xl text-white mb-3 text-center reveal-type"
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
        <div className="flex flex-wrap min-h-screen" style={{ minHeight: "calc(100vh - 86px)" }}>
          <div className="w-full sm:w-1/2 flex items-center justify-center">
            <img src={img1} alt="hospital" className="ml-3 w-1/1 sm: object-cover circle-plate-img" />
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center ">
            
          {displayUsername && (
            <h1
            className="text-2xl text-white mb-3 text-center reveal-type"
            style={{ fontFamily: '"Matemasie", cursive' }}
          >
            Hello {username}
          </h1>
          )

          }
            
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
            {displayUsername ? (
            <></>
          ) : (
            <div className="mt-5 login-btn">
              <button className="text-white border-2 border-white rounded-full p-4 hover:bg-orange-700" onClick={()=>navigate("/login")}>Login / Signup</button>
            </div>
          )

          }
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
