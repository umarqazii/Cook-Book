import React from 'react';
import Navbar from '../components/navbar';  
import img from '../assets/foodplate.png';

const Home = () => {
  return (
    <div className='bg-gray-800 min-h-screen flex flex-col'>

      {/* Main */}
      <div className='flex flex-1 items-center justify-between px-4 lg:px-8 flex-wrap lg:flex-nowrap'>
        
        {/* Image on the right side */}
        <div className='flex justify-center lg:w-1/2'>
          <img className='w-4/5 sm:w-3/4 lg:w-full max-w-md sm:max-w-lg lg:max-w-2xl mb-2 sm:mb-8 lg:mb-0' src={img} alt="hand holding plate" />
        </div>
        
        {/* Text on the left side */}
        <div className='text-white max-w-lg lg:ml-12 mt-2 sm:mt--1 lg:mt-0 lg:w-1/2'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4'>
            Welcome to your CookBook!
          </h1>
          <p className='text-lg sm:text-xl'>
            Millions of Recipes at your fingertips
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
