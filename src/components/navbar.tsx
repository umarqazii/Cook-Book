import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  let logo = "/logo192.png";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="bg-gray-900 border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src={logo}
              className="h-10"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              CookBook
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Get started
            </button>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "block" : "hidden"}`}
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-900">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 md:p-0 text-white bg-blue-600 rounded md:bg-transparent md:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="block py-2 px-3 md:p-0 text-gray-400 rounded hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="block py-2 px-3 md:p-0 text-gray-400 rounded hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="block py-2 px-3 md:p-0 text-gray-400 rounded hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-500"
                >
                  Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
