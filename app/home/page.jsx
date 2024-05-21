"use client"
import 'flowbite';
import "toastify-js/src/toastify.css"
import Homecomponent from '@/app/component/homecomponent';
import Bookingcomponent from '@/app/component/bookingcomponent';
import Profilecomponent from '@/app/component/profilecomponent';
import Lokercomponent from '@/app/component/lokercomponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheckCircle, faFileAlt, faHome, faNetworkWired, faPersonCircleCheck, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { GetKelasUser } from '../api/pages/getKelasUser';
import { SimpanBooking } from '../api/pages/simpanBooking';
import { LogoutUser } from '../api/users/logoutUser';
import Toastify from 'toastify-js'
import Swal from 'sweetalert2'
import { motion } from "framer-motion"

export default function Home() {
    const router = useRouter();
    const [menu, setMenu] = useState("home")
    const [show, setShow] = useState(false)
    const [kelas, setKelas] = useState([])
    const [loading, setLoading] = useState(false)

    const [idKelas, setIdKelas] = useState()
    const [tanggal, setTanggal] = useState()
    const [jam, setJam] = useState()

    const jambooking = [
        '09:00',
        '09:30',
        '10:00',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
    ]
    
    const [errors, setErrors] = useState({}); 

    const validateForm = () => { 
        let errors = {}; 

        if (!idKelas) { 
            errors.idKelas = true; 
        } 

        if (!jam) { 
            errors.jam = true; 
        }

        if (!tanggal) { 
            errors.tanggal = true; 
        }

        setErrors(errors);
        return (Object.keys(errors).length === 0);
    }; 

    const getKelasUser = async () => {
        try {
            const res = await GetKelasUser()
            setKelas(res.data.kelas)
        } catch (error) {
            console.log(error);
        }
    }

    const simpanBooking = async () => {
        const isValid = validateForm()
        if (!isValid) return
        setLoading(true)
        try {
            const res = await SimpanBooking({
                'kelas' : idKelas,
                'tanggal' : tanggal,
                'jam' : jam
            })
            if(res.data.status == 200){
                setShow(!show)
                setLoading(false)
                socket.emit("event", {
                    name: "BOOKING_JADWAL",
                    payload: true,
                });
            }
            Toastify({
                text: res.data.pesan,
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right", 
                style: {
                    background: "linear-gradient(to right, #201658, #1D24CA)",
                },
            }).showToast();
        } catch (error) {
            setLoading(false)
        }
        
    }

    const logOut = () => {
        Swal.fire({
            title: "Apakah Ingin Keluar?",
            text: "Silahakn tentuakn Jika Ingin Keluar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Tidak Jadi.",
            confirmButtonText: "LogOut Sekarang"
        }).then( async (result) => {
            if (result.isConfirmed) {
                const res = await LogoutUser()
                if(res){
                    router.push("/");
                    Swal.fire({
                        title: "LogOut!",
                        text: "Sampai Jumpa Kembali.",
                        icon: "success",
                        timer: 2000
                    });
                }
            }
        });
    }

    useEffect(() => {
        getKelasUser()
    },[])

    return (
        <div className='flex flex-col h-screen justify-between bg-gray-100'>

            {/* navbar */}
            <nav className="bg-white border-gray-200 dark:bg-gray-900 border fixed w-full z-10">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="./nazeateklogo.png" className="h-10" alt="Flowbite Logo" />
                    </a>
                    <button onClick={() => logOut()} className='md:hidden p-2 border rounded-full ring-2 bg-gray-400 w-8 h-8' type="button">
                        <FontAwesomeIcon className='text-white text-sm flex justify-center' icon={faPowerOff}/>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-11 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ">
                            <li onClick={() => setMenu('home')}>
                                
                                <span className={`${menu == 'home' ? 'text-red-700' : 'text-gray-900'} cursor-pointer block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 `}>
                                    <FontAwesomeIcon icon={faHome} className={`${menu == 'home' ? 'text-red-700' : 'text-gray-900'}`}/>  
                                    Home
                                </span>
                            </li>
                            <li onClick={() => setMenu('booking')}>
                                <span className={`${menu == 'booking' ? 'text-red-700' : 'text-gray-900'} cursor-pointer block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 `}>
                                    <FontAwesomeIcon icon={faBook} className={`${menu == 'booking' ? 'text-red-700' : 'text-gray-900'}`}/>
                                    Booking
                                </span>
                            </li>
                            <li onClick={() => setMenu('loker')}>
                                <span className={`${menu == 'loker' ? 'text-red-700' : 'text-gray-900'} cursor-pointer block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 `}>
                                    <FontAwesomeIcon icon={faNetworkWired} className={`${menu == 'loker' ? 'text-red-700' : 'text-gray-900'}`}/>
                                    Loker
                                </span>
                            </li>
                            <li onClick={() => setMenu('profile')}>
                                <span className={`${menu == 'profile' ? 'text-red-700' : 'text-gray-900'} cursor-pointer block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 `}>
                                    <FontAwesomeIcon icon={faPersonCircleCheck} className={`${menu == 'profile' ? 'text-red-700' : 'text-gray-900'}`}/>
                                    Profile
                                </span>
                            </li>
                            <li onClick={() => logOut()}>
                                <span className="cursor-pointer block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 ">
                                    <FontAwesomeIcon icon={faPowerOff}/>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* content */}
            <NextUIProvider>
                <div className="mb-auto mt-20">

                    <Homecomponent visible={`${menu == 'home' ? 'block' : 'hidden'} mb-20`} />
                    <Bookingcomponent visible={`${menu == 'booking' ? 'block' : 'hidden'} mb-20`}/>
                    <Lokercomponent visible={`${menu == 'loker' ? 'block' : 'hidden'} mb-20`}/>
                    <Profilecomponent visible={`${menu == 'profile' ? 'block' : 'hidden'} mb-20`}/>

                </div>
            </NextUIProvider>

            {/* bottom navigator */}
            <div className="md:hidden fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 bottom-0 left-1/2">
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                    <button onClick={() => setMenu('home')} data-tooltip-target="tooltip-home" type="button" className="inline-flex flex-col items-center justify-center px-5  hover:bg-gray-50">
                        <FontAwesomeIcon icon={faHome} className={`${menu == 'home' ? 'text-red-600' : 'text-gray-500'} w-5 h-5 mb-1`}/>
                        <span className="sr-only">Home</span>
                    </button>
                    <div id="tooltip-home" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                        Home
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                    <button onClick={() => setMenu('booking')} data-tooltip-target="tooltip-wallet" type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50">
                        <FontAwesomeIcon icon={faCheckCircle} className={`${menu == 'booking' ? 'text-red-600' : 'text-gray-500'} w-5 h-5 mb-1`}/>
                        <span className="sr-only">Booking</span>
                    </button>
                    <div id="tooltip-wallet" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                        Booking
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button onClick={(_) => setShow(!show)} data-tooltip-target="tooltip-new" type="button" className="inline-flex items-center justify-center w-10 h-10 font-medium bg-red-800 rounded-full hover:bg-red-700 group focus:ring-4 focus:ring-red-300 focus:outline-none">
                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                            <span className="sr-only">Buat Jadwal Les</span>
                        </button>
                    </div>
                    <div id="tooltip-new" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                        Buat Jadwal Les
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>

                    <button onClick={() => setMenu('loker')} data-tooltip-target="tooltip-settings" type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50">
                        <FontAwesomeIcon icon={faFileAlt} className={`${menu == 'loker' ? 'text-red-600' : 'text-gray-500'} w-5 h-5 mb-1`}/>
                        <span className="sr-only">Loker</span>
                    </button>
                    <div id="tooltip-settings" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                        Loker
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>

                    <button onClick={() => setMenu('profile')} data-tooltip-target="tooltip-profile" type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50">
                        <FontAwesomeIcon icon={faPersonCircleCheck} className={`${menu == 'profile' ? 'text-red-600' : 'text-gray-500'} w-5 h-5 mb-1`}/>
                        <span className="sr-only">Profile</span>
                    </button>
                    <div id="tooltip-profile" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        Profile
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <footer className="md:block hidden bg-red-700 shadow fixed w-full bottom-0">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-white sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">NAZEA TEKNOLOGI</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Contact</a>
                    </li>
                </ul>
                </div>
            </footer>

            {/* modal */}
            <div className={`${show ? 'block' : 'hidden'} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Booking Jadwal Les
                            </h3>
                            <button onClick={(_) => setShow(!show)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form className="p-4 md:p-5">
                            <div className='mb-3'>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kelas</label>
                                <select onChange={(e) => setIdKelas(e.target.value)} className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${errors.idKelas ? 'border-red-700' : 'border-gray-300'}`}>
                                    <option value="">Pilih Kelas</option>
                                    {
                                        kelas.map((val, i) => (
                                            <option key={i} value={val.id_kelas}>{val.materi}</option>
                                        ))
                                    }
                                    
                                </select>
                            </div>
                            <div className="grid gap-2 mb-4 grid-cols-2">
                                
                                <div className="col-span-1">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal</label>
                                    <input onChange={(e) => setTanggal(e.target.value)} type="date" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${errors.tanggal ? 'border-red-700' : 'border-gray-300'}`} required=""/>
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jam</label>
                                    <select onChange={(e) => setJam(e.target.value)} className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${errors.jam ? 'border-red-700' : 'border-gray-300'}`} required="">
                                        {
                                            jambooking.map((val,i) => (
                                                <option key={i} value={val}>{val}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => simpanBooking()} type="button" disabled={loading} className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                    {loading ? "Proccess ..." : "Simpan Jadwal"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> 

        </div>
    )
}