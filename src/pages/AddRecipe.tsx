import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar";
import "primeicons/primeicons.css";
import { useResponsive } from "../styling/useResponsive";

const AddRecipe = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const breakpoints = [480, 768, 1279]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const [pictureurl, setPictureURL] = useState<string | null>();
  const [file, setFile] = useState<File | null>();

  const fileSelect = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger the hidden file input click
      }
    };
  
    // Function to handle the file change event
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]; // Access the first selected file
      if (file) {
        // Handle the file
        setFile(file)
        console.log(file);
        toast.success('Upload Successful')
      }
    };


  const upload = () => {
    console.log("inside the upload function")
    const formData = new FormData();
    if (file) {
    
      formData.append("file", file);
      axios
        .post("http://localhost:8080/upload/image", formData)
        .then((res) => {
          console.log(res);
          toast.success('Upload Successful')
          const filename = res.data.filename;
          setPictureURL(`http://localhost:8080/uploads/images/${filename}`);
          console.log(pictureurl);
        })
        .catch((err) => {
          console.error(err);
          toast.error('Upload Failed')
        });
    }
  };

  return (
    <>
      <Navbar />
      {breakpointIndex === 0 && (
                <>
                <div className="min-h-screen p-4">
                  <div
                    className="flex justify-center text-white text-5xl mb-10"
                    style={{ fontFamily: '"Matemasie", cursive' }}
                  >
                    <h1>Add Recipe</h1>
                  </div>
      
                  <div className=" rounded-xl border-2 border-white h-auto w-[80vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
                    <h1 className=" text-white"><i className="pi pi-image " style={{ fontSize: "1000%" }}></i></h1><b></b>
                    <h2 className="text-2xl text-white">Upload Image</h2>
                    <div>
                      <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
                      onClick={fileSelect}
                      >Choose File</button>
                      <button className="text-white bg-orange-500 p-2 rounded-md m-1"
                      onClick={upload}
                      >Upload</button>
                    </div>
                    <p>{file?.name}</p>
                  </div>
                      <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange} // Handle file changes
            />
                </div>
              </>
      )}
      {breakpointIndex === 1 && (
                <>
                <div className="min-h-screen p-4">
                  <div
                    className="flex justify-center text-white text-5xl mb-10"
                    style={{ fontFamily: '"Matemasie", cursive' }}
                  >
                    <h1>Add Recipe</h1>
                  </div>
      
                  <div className=" rounded-xl border-2 border-white h-auto w-[70vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
                    <h1 className=" text-white"><i className="pi pi-image " style={{ fontSize: "1000%" }}></i></h1><b></b>
                    <h2 className="text-2xl text-white">Upload Image</h2>
                    <div>
                      <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
                      onClick={fileSelect}
                      >Choose File</button>
                      <button className="text-white bg-orange-500 p-2 rounded-md m-1"
                      onClick={upload}
                      >Upload</button>
                    </div>
                    <p>{file?.name}</p>
                  </div>
                      <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange} // Handle file changes
            />
                </div>
              </>
      )}
      {breakpointIndex === 2 && (
                <>
                <div className="min-h-screen p-4">
                  <div
                    className="flex justify-center text-white text-5xl mb-10"
                    style={{ fontFamily: '"Matemasie", cursive' }}
                  >
                    <h1>Add Recipe</h1>
                  </div>
      
                  <div className=" rounded-xl border-2 border-white h-auto w-[60vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
                    <h1 className=" text-white"><i className="pi pi-image " style={{ fontSize: "1000%" }}></i></h1><b></b>
                    <h2 className="text-2xl text-white">Upload Image</h2>
                    <div>
                      <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
                      onClick={fileSelect}
                      >Choose File</button>
                      <button className="text-white bg-orange-500 p-2 rounded-md m-1"
                      onClick={upload}
                      >Upload</button>
                    </div>
                    <p>{file?.name}</p>
                  </div>
                      <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange} // Handle file changes
            />
                </div>
              </>
      )}
      {breakpointIndex === 3 && (
        <>
          <div className="min-h-screen p-4">
            <div
              className="flex justify-center text-white text-5xl mb-10"
              style={{ fontFamily: '"Matemasie", cursive' }}
            >
              <h1>Add Recipe</h1>
            </div>

            <div className=" rounded-xl border-2 border-white h-auto w-[50vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
              <h1 className=" text-white"><i className="pi pi-image " style={{ fontSize: "1000%" }}></i></h1><b></b>
              <h2 className="text-2xl text-white">Upload Image</h2>
              <div>
                <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
                onClick={fileSelect}
                >Choose File</button>
                <button className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={upload}
                >Upload</button>
              </div>
              <p>{file?.name}</p>
            </div>
                <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange} // Handle file changes
      />
          </div>
        </>
      )}
    </>
  );
};

export default AddRecipe;
