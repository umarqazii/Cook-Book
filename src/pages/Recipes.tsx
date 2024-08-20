import React, { useEffect } from "react";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";

const Recipes = () => {
  const animatedComponents = makeAnimated();
  const [selectedIngredients, setSelectedIngredients] = React.useState<MultiValue<{ value: string; label: string; }>>([]);
  
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "mango", label: "Mango" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "lemon", label: "Lemon" },
    { value: "orange", label: "Orange" },
    { value: "peach", label: "Peach" },
    { value: "apple", label: "Apple" },
    { value: "pear", label: "Pear" },
    { value: "kiwi", label: "Kiwi" },
    { value: "raspberry", label: "Raspberry" },
    { value: "blackberry", label: "Blackberry" },
    { value: "pomegranate", label: "Pomegranate" },
    { value: "watermelon", label: "Watermelon" },
    { value: "grape", label: "Grape" },
    { value: "pineapple", label: "Pineapple" },
    { value: "coconut", label: "Coconut" },
    { value: "mango", label: "Mango" },
  ];

  useEffect(() => {
    console.log(selectedIngredients);
  }, [selectedIngredients]);

  useEffect(() => {
    axios.get("http://localhost:8080/recipes/all", {
      params: {
        ingredients: selectedIngredients.map((ingredient) => ingredient.value),
      },
    })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
    });
  }, [selectedIngredients]);


  return (
    <div className="bg-gray-700 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-3xl text-white font-semibold text-center mb-3">
          Recipes
        </h1>
        <div>
          {/* search bar */}
          <div className="flex justify-center mb-5">
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[options[4], options[5]]}
              isMulti
              options={options}
              className=" w-full sm:w-1/2" 
                onChange={(selectedOptions) => setSelectedIngredients(selectedOptions)}

            />
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
