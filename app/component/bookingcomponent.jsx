"use client"

import { Radio } from 'antd';
import { faBook, faClock, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import {Html5Qrcode} from "html5-qrcode";
import "toastify-js/src/toastify.css"
import ListS from './skeleton/listS';
import { GetJadwalBooking } from '../api/pages/getJadwalBooking';
import { SimpanAbsen } from '../api/pages/simpanAbsen';

const Bookingcomponent = ({visible}) => {
    const [status, setStatus] = useState('pending');
    const [show, setShow] = useState(false)
    const [booking, setBooking] = useState([])
    
    const [listLoading, setListLoading] = useState(true)

    useEffect(() => {
        jadwalBooking()
    },[])

    function getToken() {
        return localStorage.getItem('token');
    }

    const qrRef = useRef(null);
    const scanQR = (id) => {
        setShow(!show)
        openKamera(id)
    }

    const openKamera = (id) => {
        const html5QrCode = new Html5Qrcode("readers");
       
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
            jadwalBooking()
            stopKamera()
        }
    }

    const jadwalBooking = async () => {
        setListLoading(true)
        try {
            const res = await GetJadwalBooking() 
            setListLoading(false)
            setBooking(res.data.booking)
        } catch (error) {
            setListLoading(false)
        }
    }

    useEffect(() => {
        window.socket = io("https://web-socket-server.fly.dev", {
            auth: {
                appId: "BOOKING_JADWAL",
            },
        });
    
        socket.on("connect", () => {
            // console.log("Connected to the socket.io server");
        });
    
        socket.on("event", function (e) {
            jadwalBooking()
        });
    
        return () => {
            socket.disconnect();
        }

    },[]);

    const tanggalIndo = (tanggal) => {
        const date = new Date(tanggal);
        const formatDate = date.toLocaleDateString('id');
        return formatDate
    }
    
    const onChange = (e) => {
        setStatus(e.target.value);
    }

    return (
        <div className={`${visible} scroll-smooth md:scroll-auto container mx-auto mt-3`}>
            <div className="mt-3 w-full">
                <nav className="m-2 flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <div className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                </svg>
                                Home
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <div className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Booking</div>
                            </div>
                        </li>
                    </ol>
                </nav>
                <div className="mt-5 flex justify-center">
                <Radio.Group
                    value={status}
                    onChange={onChange}
                    style={{
                    marginBottom: 16,
                    }}
                >
                    <Radio.Button value="pending">Pending</Radio.Button>
                    <Radio.Button value="diterima">Diterima</Radio.Button>
                    <Radio.Button value="ditolak">Ditolak</Radio.Button>
                    <Radio.Button value="dibatalkan">Dibatalkan</Radio.Button>
                </Radio.Group>
                </div>
                <div className="grid md:grid-cols-5 grid-cols-2 gap-3 p-3">
                {
                    listLoading ? 
                    <ListS/>
                    :
                    booking.map((val, i) => (
                        <div key={i} className="p-3 shadow-md border rounded-md bg-white">
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
                                <span className='md:text-lg font-bold text-sm mt-2 text-blue-700'>{val.status}</span>
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
                        <div id='readers'></div>
                    </div>
                    <div onClick={() => stopKamera()} className="flex justify-center bg-blue-700 rounded-b-md">
                        <button className="p-2 flex item-center rounded-full mt-3 text-white">TUTUP</button>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Bookingcomponent