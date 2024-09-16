import React, { useState, useEffect } from "react";
import axios from "axios";
import img1 from "../assets/lolo.png";
import { useResponsive } from "../styling/useResponsive";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login: React.FC <LoginProps> = ({ setToken }) => {
  const breakpoints = [480, 768, 1279]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const [toggle, setToggle] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] =useState("");
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("")
  const [reenterPassword, setReenterPassword] = useState("")

  const handleLogin = (event: React.FormEvent) => {
    event?.preventDefault();
    axios.post('http://localhost:8080/auth/login',{
      loginEmail,
      loginPassword
    })
    .then((res)=>{
      console.log(res)
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    })
    .catch((err)=>{
      alert(err)
    })
  }

  const handleSignup = (event: React.FormEvent) =>{
    event.preventDefault();
    console.log(fullName, signupEmail, signupPassword)
    axios.post('http://localhost:8080/auth/signup', {
      fullName,
      signupEmail,
      signupPassword
    })
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      alert(err)
    })
  }

  return (
    <>
      {breakpointIndex === 0 && <></>}
      {breakpointIndex === 1 && <></>}
      {breakpointIndex === 2 && <></>}
      {breakpointIndex === 3 && (
        <div className="flex items-center justify-center min-h-screen">
          <div
            className={` bg-orange-900 h-3/4 flex items-center w-3/4 fixed rounded-full transition-all duration-500 ease-linear border-2 border-white`}
          >
            {/* Login form positioned on the right inside the outer div */}
            <div
              className={`absolute right-0 w-1/2 h-full flex items-center justify-center flex-col ${
                toggle ? "hidden" : "block"
              } `}
            >
              <h1 className="text-white text-3xl font-bold mb-8">Log in</h1>
              <form className="space-y-6 w-1/2">
                <div>
                  <label className="text-white block text-sm font-medium leading-6">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="eg. abc@gmail.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-white">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="eg. nkdP@45"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                      }}
                      required
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleLogin}
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-300">
                Not a member?
                <span
                  className="font-semibold leading-6 text-orange-300 hover:text-orange-500 cursor-pointer"
                  onClick={() => setToggle(!toggle)}
                >
                  &nbsp; Sign up Now
                </span>
              </p>
            </div>

            {/* Signup form positioned on the left inside the outer div */}
            <div
              className={`absolute left-0 w-1/2 h-full flex items-center justify-center flex-col ${
                toggle ? "block" : "hidden"
              }`}
            >
              <h1 className="text-white text-3xl font-bold mb-3">Sign up</h1>
              <form className="space-y-4 w-1/2">
              <div>
                  <label className="block text-sm font-medium leading-6 text-white">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="eg. John Doe"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-white">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="eg. abc@gmail.com"
                      required
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-white">
                      Password
                    </label>
                  </div>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="eg. nkdP@45"
                      required
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-white">
                      Re-Enter Password &nbsp;
                      {signupPassword ? (
                        signupPassword === reenterPassword ? (
                          <span className="text-green-300 text-xs">
                            Passwords match!
                          </span>
                        ) : (
                          <span className="text-red-300 text-xs">
                            Does not match
                          </span>
                        )
                      ) : null}
                    </label>
                  </div>
                  <div className="mt-1">
                    <input
                      id="reenterpassword"
                      name="reenterpassword"
                      type="password"
                      placeholder="eg. nkdP@45"
                      required
                      value={reenterPassword}
                      onChange={(e) => {
                        setReenterPassword(e.target.value);
                      }}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                      signupPassword === reenterPassword &&
                      signupPassword !== ""
                        ? "bg-orange-600 hover:bg-orange-500"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleSignup}
                    disabled={
                      signupPassword !== reenterPassword ||
                      signupPassword === ""
                    }
                  >
                    Sign up
                  </button>
                </div>
              </form>

              <p className="mt-2 text-center text-sm text-gray-300">
                Already have an account?
                <span
                  className="font-semibold leading-6 text-orange-300 hover:text-orange-500 cursor-pointer"
                  onClick={() => setToggle(!toggle)}
                >
                  &nbsp; Login
                </span>
              </p>
            </div>

            {/* div that moves */}
            <div
              className={`h-full w-1/2 rounded-full transition-transform duration-500 ease-in-out z-30`}
              style={{
                transform: toggle ? "translateX(100%)" : "translateX(0)",
              }}
            >
              <img
                src={img1}
                alt="login"
                className="h-full w-full z-30 cursor-move"
                onClick={() => setToggle(!toggle)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
