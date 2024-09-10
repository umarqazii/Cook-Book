import React from "react";
import img1 from "../assets/lolo.png";
import { useResponsive } from "../styling/useResponsive";

const Login = () => {
  const breakpoints = [480, 768, 1279]; // Example breakpoints: small, medium, large screens
  const breakpointIndex = useResponsive(breakpoints);
  const [toggle, setToggle] = React.useState(false);

  return (
    <>
      {breakpointIndex === 0 && <></>}
      {breakpointIndex === 1 && <></>}
      {breakpointIndex === 2 && <></>}
      {breakpointIndex === 3 && (
        <div className="flex items-center justify-center min-h-screen">
          <div
            className={` bg-slate-300 h-3/4 flex items-center w-3/4 fixed rounded-full transition-all duration-500 ease-linear border-2 border-white`}
          >
            {/* Login form positioned on the right inside the outer div */}
            <div className="absolute right-0 w-1/2 h-full flex items-center justify-center flex-col">
              <h1 className="text-3xl font-bold mb-8">Log in</h1>
              <form className="space-y-6 w-1/2" action="#" method="POST">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?
                <a
                  href="#"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  &nbsp; Sign up Now
                </a>
              </p>
            </div>

            {/* Signup form positioned on the left inside the outer div */}
            <div className="absolute left-0 w-1/2 h-full flex items-center justify-center flex-col">
            <h1 className="text-3xl font-bold mb-8">Sign up</h1>
              <form className="space-y-6 w-1/2" action="#" method="POST">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                <a
                  href="#"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  &nbsp; Login
                </a>
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
                className="h-full w-full z-30"
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
