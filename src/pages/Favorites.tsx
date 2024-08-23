import React from 'react';
import img from "../assets/wip.gif";

const Favorites = () => {
  return (
    <div className='bg-gray-700 min-h-screen'>
        {/* horizontally and vertically centered div */}
        <div className='flex items-center justify-center h-screen flex-col'>
            <h1 className='text-5xl text-white font-semibold text-center mb-5' style={{fontFamily: '"Matemasie", cursive'}}>
                Work in Progress
            </h1>
            <img src={img} className='w-96 rounded-2xl'>

            </img>
            
        </div>
      
    </div>
  );
};

export default Favorites;