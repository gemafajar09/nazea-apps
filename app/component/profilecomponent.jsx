"use client"

import { useEffect, useState } from "react"
import { Timeline } from 'antd';
import { GetUsers } from "../api/users/getUser"
import { Empty } from 'antd'

const Profilecomponent = ({visible}) => {
    const [user, setUser] = useState({
        nama : "none",
        email: "example@gmail.com"
    }) 

    const [windowSize, setWindowSize] = useState(230);
  
    // useEffect(() => {
    //     const handleWindowResize = () => {
    //         var screen = window.innerWidth
    //         if(screen > 900 && screen < 2600){
    //             setWindowSize(230);
    //         } else if (screen > 600 && screen < 900) {
    //             setWindowSize(180);
    //         } else {
    //             setWindowSize(130);
    //         }
    //             // setWindowSize(window.innerWidth);
    //     };
    
    //     window.addEventListener('resize', handleWindowResize);
    
    //     return () => {
    //       window.removeEventListener('resize', handleWindowResize);
    //     };
    // }, []);

    useEffect(() => {
        getUser()
    },[])

    const getUser = async () => {
        try {
            const res = await GetUsers()
            setUser({
                nama: res.data.nama_pengguna,
                email: res.data.email,
            })
        } catch (error) {
            
        }
    }

    return (
        <div className={`${visible} scroll-smooth md:scroll-auto container mx-auto`}>
            
            <img src="./banner.jpg" className="w-full h-[150px] " alt="" />
            
            <div className="absolute z-1 md:left-64 left-7 top-40">
                <img src="./user.png" className="w-32 h-32 rounded-full ring-2 ring-gray-300"/>
            </div>
                
            <div className="pt-[80px] md:pt-[100px] flex flex-col">
                <span className="text-2xl pl-6 font-bold capitalize ">
                    {user.nama}
                </span>
                <span className="pl-6">
                    {user.email}
                </span>

                <div className="mt-10 bg-white p-5 w-full">
                    <div className="flex justify-center mb-5">
                        <span className="text-center font-bold text-lg">Activity</span>
                    </div>
                    {/* <Timeline
                        mode="right"
                        items={[
                        // {
                        //     label: '2015-09-01',
                        //     children: 'Create a services',
                        // },
                        ]}
                    /> */}
                    <Empty />
                </div>
            </div>

        </div>
    )
}

export default Profilecomponent