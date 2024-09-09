import React from 'react';
import {NavLink} from 'react-router-dom';
import { CiMenuFries } from "react-icons/ci";

const Nav = () => {
    const [toggle, setToggle] = React.useState(false);
    let logo = "/logo192.png";
  return (
    <>
      <div className='bg-gradient-to-b from-black to text-white p-5 flex justify-between'>
        <div className="left-div px-5">
        <NavLink
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-10" alt="Flowbite Logo" />
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
                <NavLink to="/addrecipe" className='px-7 py-2 rounded-full'>Add Recipes</NavLink>
                <NavLink to="/displaymyrecipes" className='px-7 py-2 rounded-full'>My Recipes</NavLink>
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
                    >My Recipes</NavLink>
                </ul>
            </div>
        </div>
      </div>
    </>
  );
};

export default Nav;