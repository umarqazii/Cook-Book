import React, { useEffect } from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import { CiMenuFries } from "react-icons/ci";

const Nav = () => {
    const navigate = useNavigate();
    const [toggle, setToggle] = React.useState(false);
    const [dropdown, setDropdown] = React.useState(false);
    const [displayLogout, setDisplayLogout] = React.useState(false);
    let logo = "/logo192.png";

    const handleLogout = () => {
      localStorage.removeItem("token");  // Remove the token
      window.location.href = "/";                     // Navigate to home screen
    };

    const handleLogin = () => {
      navigate("/login");
    };

    const handleDropdown = () => {
      setDropdown(!dropdown);  // Toggle the dropdown visibility
    };

    useEffect(()=>{
      const token = localStorage.getItem("token")
      if(token){
        setDisplayLogout(true)
      }
    },[NavLink])

  return (
    <>
      <div className='bg-gradient-to-b from-black to text-white p-5 flex justify-between'>
        <div className="left-div px-5">
        <NavLink
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-10" alt="CookBook Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              CookBook
            </span>
          </NavLink>
        </div>
        <div className="right-div px-5">
            <ul className='md:flex justify-center items-center hidden'>
                <NavLink to="/" className='px-7 py-2 rounded-full'>Home</NavLink>
                <NavLink to="/recipes" className='px-7 py-2 rounded-full'>Recipes</NavLink>
                <NavLink to="/favorites" className='px-7 py-2 rounded-full'>Favorites</NavLink>
                <NavLink to="/tools" className='px-7 py-2 rounded-full'>Tools</NavLink>
                {/* My Recipes Dropdown */}
          <div className="relative">
            <button
              className="px-7 py-2 rounded-full"
              onClick={handleDropdown}
            >
              My Recipes
            </button>

            {dropdown && (
              <div className="absolute bg-white rounded-lg shadow-lg mt-2">
                <NavLink
                  to="/addrecipe"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                >
                  Add Recipes
                </NavLink>
                <NavLink
                  to="/displaymyrecipes"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                >
                  Display My Recipes
                </NavLink>
              </div>
            )}
          </div>
          {displayLogout ? (
            <button  className='px-7 py-2 rounded-full' onClick={handleLogout}>Logout</button>
          ):(
            <></>
          )

          }
                
            </ul>
            <CiMenuFries className='text-xl md:hidden block text-white cursor-pointer' onClick={() => setToggle(!toggle)} />
        </div>
        {/* sidebar */}
        <div className={`sidebar-main-container transition-all w-full h-screen bg-black bg-opacity-30 fixed top-0 z-30 ${toggle ? "right-0 duration-500 ease-in" : "right-[-100%] duration-300 ease-in-out"} flex justify-end`}
        onClick={() => setToggle(!toggle)}
        >
            <div className="child w-48 h-full bg-black flex justify-center items-center">
                <ul className='flex flex-col gap-4'>
                    <NavLink to="/" className='text-xl px-7 py-2 rounded-full'
                    onClick={() => setToggle(!toggle)}
                    
                    >Home</NavLink>
                    <NavLink to="/recipes" className='text-xl px-7 py-2 rounded-full'
                    onClick={() => setToggle(!toggle)}
                    >Recipes</NavLink>
                    <NavLink to="/favorites" className='text-xl px-7 py-2 rounded-full '
                    onClick={() => setToggle(!toggle)}
                    >Favorites</NavLink>
                    <NavLink to="/tools" className='text-xl px-7 py-2 rounded-full'
                    onClick={() => setToggle(!toggle)}
                    >Tools</NavLink>
                    <NavLink to="/addrecipe" className='text-xl px-7 py-2 rounded-full'
                    onClick={() => setToggle(!toggle)}
                    >Add Recipes</NavLink>
                    <NavLink to="/displaymyrecipes" className='text-xl px-7 py-2 rounded-full'
                    onClick={() => setToggle(!toggle)}
                    >Display My Recipes</NavLink>
                </ul>
            </div>
        </div>
      </div>
    </>
  );
};

export default Nav;