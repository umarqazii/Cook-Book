import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar";
import "primeicons/primeicons.css";
import { imageDB } from "../lib/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useResponsive } from "../styling/useResponsive";

const AddRecipe = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const breakpoints = [480, 768, 1279]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const [img, setImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>();
  const [selectedFilename, setSelectedFilename] = useState<string>("");
  const [fileEncodedName, setFileEncodedName] = useState<string>("");

  // to get the image using it's name
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchImageUrl = async () => {
    try {
      const imgRef = ref(imageDB, `files/${fileEncodedName}`); // Construct the reference to the image
      const url = await getDownloadURL(imgRef); // Get the download URL
      setImageUrl(url); // Set the URL in state to display the image
      console.log(url);
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

  const fileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle the file change event
  // Handle file change event and generate UUID-encoded file name
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const encodedName = v4(); // Generate UUID for the file
      setFileEncodedName(encodedName); // Store UUID in the state
      console.log(`Encoded Name: ${encodedName}`);
      setFile(selectedFile); // Store the selected file
      setImg(URL.createObjectURL(selectedFile)); // Create a preview image URL
      console.log(`File Name: ${selectedFile.name}`);
      setSelectedFilename(selectedFile.name);
      toast.success("Upload Successful");
    }
  };

  // Upload file to Firebase using the UUID-encoded name
  const handleUpload = () => {
    if (file) {
      const imgRef = ref(imageDB, `files/${fileEncodedName}`); // Use the UUID-encoded name for Firebase reference
      uploadBytes(imgRef, file)
        .then(() => {
          toast.success("Image uploaded successfully!");
        })
        .catch((error) => {
          toast.error(`Upload failed: ${error.message}`);
        });
    } else {
      toast.error("No file selected.");
    }
  };

  const sendImgInfoToBackend = () => {};

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
              <h1 className=" text-white">
                <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
              </h1>
              <b></b>
              <h2 className="text-2xl text-white">Upload Image</h2>
              <div>
                <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={fileSelect}
                >
                  Choose File
                </button>
                <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
              <div className="flex items-center w-fit justify-between ">
                <p>{selectedFilename}</p>
                {img && (
                  <img
                    className="h-[50px] w-[50px] rounded-xl ml-3"
                    src={img}
                    alt="selected image"
                  />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange} // Handle file changes
            />
            <div className="flex items-center justify-center flex-col">
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="w-1/2" />
              ) : (
                <></>
              )}

              <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
              onClick={fetchImageUrl}
              >Get Image</button>
            </div>
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

          <div className=" rounded-xl border-2 border-white h-auto w-[80vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
            <h1 className=" text-white">
              <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
            </h1>
            <b></b>
            <h2 className="text-2xl text-white">Upload Image</h2>
            <div>
              <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={fileSelect}
              >
                Choose File
              </button>
              <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
            <div className="flex items-center w-fit justify-between ">
              <p>{selectedFilename}</p>
              {img && (
                <img
                  className="h-[50px] w-[50px] rounded-xl ml-3"
                  src={img}
                  alt="selected image"
                />
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange} // Handle file changes
          />
          <div className="flex items-center justify-center flex-col">
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" className="w-1/2" />
            ) : (
              <></>
            )}

            <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
            onClick={fetchImageUrl}
            >Get Image</button>
          </div>
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

          <div className=" rounded-xl border-2 border-white h-auto w-[50vw] pt-5 pb-5 mx-auto flex items-center justify-center flex-col">
            <h1 className=" text-white">
              <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
            </h1>
            <b></b>
            <h2 className="text-2xl text-white">Upload Image</h2>
            {/* selected image preview */}

            <div>
              <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={fileSelect}
              >
                Choose File
              </button>
              <button
                className="text-white bg-orange-500 p-2 rounded-md m-1"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
            <div className="flex items-center w-fit justify-between ">
              <p>{selectedFilename}</p>
              {img && (
                <img
                  className="h-[50px] w-[50px] rounded-xl ml-3"
                  src={img}
                  alt="selected image"
                />
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange} // Handle file changes
          />

          <div className="flex items-center justify-center flex-col">
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" className="w-1/2" />
            ) : (
              <></>
            )}

            <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
            onClick={fetchImageUrl}
            >Get Image</button>
          </div>
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
              <h1 className=" text-white">
                <i className="pi pi-image " style={{ fontSize: "1000%" }}></i>
              </h1>
              <b></b>
              <h2 className="text-2xl text-white">Upload Image</h2>
              {/* selected image preview */}

              <div>
                <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={fileSelect}
                >
                  Choose File
                </button>
                <button
                  className="text-white bg-orange-500 p-2 rounded-md m-1"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
              <div className="flex items-center w-fit justify-between ">
                <p>{selectedFilename}</p>
                {img && (
                  <img
                    className="h-[50px] w-[50px] rounded-xl ml-3"
                    src={img}
                    alt="selected image"
                  />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange} // Handle file changes
            />

            <div className="flex items-center justify-center flex-col">
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="w-1/2" />
              ) : (
                <></>
              )}

              <button className="text-white bg-orange-500 p-2 rounded-md m-1" 
              onClick={fetchImageUrl}
              >Get Image</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddRecipe;
