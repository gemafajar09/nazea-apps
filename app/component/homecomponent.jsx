"use client"
import { faBook, faClock, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Carousel } from 'antd';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import {Html5Qrcode} from "html5-qrcode";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import BannerS from '@/app/component/skeleton/bannerS';
import Lists from '@/app/component/skeleton/listS';
import { GetBanner } from '../api/pages/getBanner';
import { GetJadwalBooking } from '../api/pages/getJadwalBooking';
import { SimpanAbsen } from '../api/pages/simpanAbsen';
import { Player } from '@lottiefiles/react-lottie-player';
import anim1 from "../../public/animasi/anim1.json"

const Homecomponent = ({visible}) => {
    const [show, setShow] = useState(false)
    const [banner, setBanner] = useState([])
    const [booking, setBooking] = useState([])
    const [loading, setLoading] = useState(true)
    const [listLoading, setListLoading] = useState(true)
  
    const qrRef = useRef(null);
    const scanQR = (id) => {
        setShow(!show)
        openKamera(id)
    }

    const openKamera = (id) => {
        const html5QrCode = new Html5Qrcode("reader");
       
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            absenKelas(id, decodedText)
            html5QrCode.stop()
            stopKamera()
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
        qrRef.current = html5QrCode;
    }

    const stopKamera = () => {
        setShow(false)
        qrRef.current.stop()
    }

    useEffect(() => {
        window.socket = io("https://web-socket-server.fly.dev", {
            auth: {
                appId: "BOOKING_JADWAL",
            },
        });
    
        socket.on("connect", () => {
            console.log("Connected to the socket.io server");
        });
    
        socket.on("event", function (e) {
            getBooking()
        });
    
        return () => {
            socket.disconnect();
        }

    },[]);

    const getBanner = async () => {
        try {
            setLoading(true)
            const res = await GetBanner()

            setLoading(false)
            setBanner(res.data.banner)
        } catch (error) {
            setLoading(false)
        }
        
    }

    const getBooking = async () => {
        setListLoading(true)
        try {
            const res = await GetJadwalBooking()
            setBooking(res.data.booking)
            setListLoading(false)
        } catch (error) {
            setListLoading(false)
        }
    }

    const tanggalIndo = (tanggal) => {
        const date = new Date(tanggal);
        const formatDate = date.toLocaleDateString('id');
        return formatDate
    }

    const absenKelas = async (id, decodedText) => {
        if(decodedText != process.env.NEXT_PUBLIC_TOKEN) {
            Toastify({
                text: "Kode QrCode Tidak Memiliki Izin!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right", 
                style: {
                    background: "linear-gradient(to right, #201658, #1D24CA)",
                },
            }).showToast();
        } else {
            const res = await SimpanAbsen(id)
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
            getBooking()
            stopKamera()
        }
    }

    useEffect(() => {
        getBanner()
        getBooking()
    },[])

    // kamera

    return (
        <div className={`${visible} scroll-smooth md:scroll-auto container mx-auto mt-3`}>
            {
                loading ? 
                    <BannerS/>
                    :
                    <Carousel autoplay autoplaySpeed={3000} draggable={true}>
                        {
                            banner.map((val, i) => (
                                <div key={i} className="rounded-md">
                                <img className='rounded-md' src={`${process.env.NEXT_PUBLIC_IMAGE}/${val.gambar}`} alt='gambar'/>
                                </div>
                            ))
                        }
                    </Carousel>    
            }

            <div className="mt-3 w-full">
                <div className="md:flex md:justify-between md:items-center grid mt-2 bg-slate-300 md:m-0 m-3 rounded-md p-2">
                      
                    <div className="flex flex-col">
                        <span className='pl-3 font-bold text-xl text-white'>Booking Hari Ini</span>
                        <span className='pl-3 mt-2 text-white'>Silahkan cek booking jadwal secara berkala agar tidak ketinggalan informasi kelas.</span>
                    </div>
                    <div className='md:w-1/3 w-full'>
                        {/* <Player
                            autoplay
                            loop
                            src={anim1}
                            style={{ height: '30%', width: '30%' }}
                        >
                        </Player> */}

                    </div>
                </div>
                <hr className="mt-2" />
                
                <div className="grid md:grid-cols-5 grid-cols-2 gap-3 p-3">
                {
                    listLoading ? 
                    <Lists/>
                    :
                    booking.map((val, i) => (
                        <div key={i} className="p-3 border rounded-md shadow-md bg-white">
                            <div className="flex gap-3 justify-between">
                                <div className="rounded-md p-2 shadow-md">
                                    <FontAwesomeIcon icon={faBook} className='w-4 h-4 text-gray-700'/>
                                </div>
                            </div>
                            <div className="flex justify-between mt-10">
                                <span className='md:text-lg text-xs'>{val.materi}</span>
                                <span className='md:text-lg text-xs'><FontAwesomeIcon icon={faClock} className='text-gray-700'/> {val.jam}</span>
                            </div>
                            <div className="border-b-2 mt-6 border-gray-700"></div>
                            <div className="flex justify-between">
                                <span className='md:text-lg text-xs'>Tanggal</span>
                                <span className='md:text-lg text-xs'>{tanggalIndo(val.tanggal)}</span>
                            </div>

                            <div className="flex justify-between mt-10">
                                <span className={`md:text-lg font-bold text-sm mt-2 text-black`}>{val.status}</span>
                                <div onClick={() => scanQR(val.id)} className={`${val.status == 'diterima' ? 'block' : 'hidden'} w-8 h-8 p-2 hover:bg-gray-400 cursor-pointer bg-gray-700 text-white rounded-md md:mt-0 mt-2`}>
                                    <FontAwesomeIcon className='flex justify-center' icon={faQrcode}/>
                                </div>
                            </div>
                        </div>
                    ))
                }

                </div>
            </div>

            <div className={`${show ? 'block' : 'hidden'} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div id='reader'></div>
                    </div>
                    <div onClick={() => stopKamera()} className="flex justify-center bg-blue-700 rounded-b-md">
                        <button className="p-2 flex item-center rounded-full mt-3 text-white">TUTUP</button>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Homecomponent