import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styling/navbar.css";

const Navbar = () => {
  let logo = "/logo192.png";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="bg-gradient-to-b from-pink-500 to ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-10" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              CookBook
            </span>
          </NavLink>
          <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
          <button
  onClick={toggleMenu}
  type="button"
  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-white border border-white custom-shine"
  aria-controls="navbar-cta"
  aria-expanded={isMenuOpen}
>
  <span className="sr-only">Open main menu</span>
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 17 14"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 1h15M1 7h15M1 13h15"
    />
  </svg>
</button>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 transition-all duration-500 ease-in-out ${
              isMenuOpen ? "block" : "hidden"
            }`}
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-700 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 px-3 md:p-0 rounded ${
                      isActive
                        ? "text-white text-lg lg:underline underline-offset-8 bg-blue-800 md:bg-transparent"
                        : "text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                    }`
                  }
                  aria-current="page"
                  onClick={toggleMenu}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/recipes"
                  className={({ isActive }) =>
                    `block py-2 px-3 md:p-0 rounded ${
                      isActive
                        ? "text-white text-lg lg:underline underline-offset-8 bg-blue-800 md:bg-transparent"
                        : "text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                    }`
                  }
                  onClick={toggleMenu}
                >
                  Recipes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `block py-2 px-3 md:p-0 rounded ${
                      isActive
                        ? "text-white text-lg lg:underline underline-offset-8 bg-blue-800 md:bg-transparent"
                        : "text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                    }`
                  }
                  onClick={toggleMenu}
                >
                  Favorites
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tools"
                  className={({ isActive }) =>
                    `block py-2 px-3 md:p-0 rounded ${
                      isActive
                        ? "text-white text-lg lg:underline underline-offset-8 bg-blue-800 md:bg-transparent"
                        : "text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                    }`
                  }
                  onClick={toggleMenu}
                >
                  Tools
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
