import React from "react";

const Recipes = () => {
  return (
    <div className="bg-gray-700 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-4">
            <h1 className="text-3xl text-white font-semibold text-center mb-3">Recipes</h1>
            <div>
                    {/* search bar */}
                    <div className="flex justify-center mb-5">
                        <input type="text" placeholder="Search for recipes" className="w-1/2 p-2 rounded-lg" />
                        <button className="bg-blue-600 text-white p-2 rounded-lg ml-2">Search</button>
                    </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl text-white font-semibold">Recipe 1</h2>
                <p className="text-gray-400">Description of Recipe 1</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl text-white font-semibold">Recipe 2</h2>
                <p className="text-gray-400">Description of Recipe 2</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl text-white font-semibold">Recipe 3</h2>
                <p className="text-gray-400">Description of Recipe 3</p>
            </div>
            
            </div>
        </div>
    </div>
  );
};

export default Recipes;
