"use client"

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import {useRouter} from "next/navigation";
import { loginUser } from "./api/users/loginUser";

export default function Home() {
  const router = useRouter();
  const [show, setShow] = useState(false)
  const [isloading, setIsloading] = useState(false)

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [errors, setErrors] = useState({}); 

  const validateForm = () => { 
      let errors = {}; 

      if (!password) { 
          errors.password = true; 
      }

      if (!email) { 
          errors.email = true; 
      }

      setErrors(errors);
      return (Object.keys(errors).length === 0);
  }; 

  const login = async () => {
    const isValid = validateForm()
    if (!isValid) {
      Toastify({
          text: "Pastikan Username Dan Password Ada.!",
          duration: 5000,
          close: true,
          gravity: "top",
          position: "right", 
          style: {
              background: "linear-gradient(to right, #201658, #1D24CA)",
          },
      }).showToast();
      return
    }

    setIsloading(true)
    try {
      const res = await loginUser({
        "email" : email,
        "password": password
      })
      setIsloading(false)
      if(res.data.status == 200){
        router.push("/home");
      }
    } catch (error) {
      Toastify({
          text: "Sedang Ada Gangguan.",
          duration: 5000,
          close: true,
          gravity: "top",
          position: "right", 
          style: {
              background: "linear-gradient(to right, #201658, #1D24CA)",
          },
      }).showToast();
      setIsloading(false)
    }
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex justify-center mb-6 text-2xl font-semibold text-gray-900">
                <img className="md:w-44 w-1/2 mr-2" src="./nazeateklogo.png" alt="logo"/>   
            </a>

            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Silahkan Masuk
                    </h1>
                    <form className="space-y-4 md:space-y-6">
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Masukan Email & Password</label>
                          <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className={`${errors.email ? 'border-red-700' : 'border-gray-300'} bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 `} placeholder="name@gmail.com" required=""/>
                      </div>

                      <div className="relative">
                          <input type={show ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} className={`${errors.password ? 'border-red-700' : 'border-gray-300'} bg-gray-50 border  text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 `} placeholder="*********"/>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">

                          <FontAwesomeIcon onClick={() => setShow(!show)} className={`h-5 text-gray-700 ${show ? 'block' : 'hidden'}`} icon={faEye} />

                          <FontAwesomeIcon onClick={() => setShow(!show)} className={`h-5 text-gray-700 ${show ? 'hidden' : 'block'}`} fill="none" icon={faEyeSlash}/>

                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                          <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-red-300 " required=""/>
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                              </div>
                          </div>
                          <a href="#" className="text-sm font-medium text-red-600 hover:underline dark:text-red-500">Forgot password?</a>
                      </div>
                      <button type="button" onClick={() => login()} className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">{isloading ? 'Processing ...' : 'Log In'}</button>
                        
                    </form>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}
