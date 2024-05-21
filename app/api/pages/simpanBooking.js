"use server"

import { API_SIMPAN_BOOKING } from "@/lib/apiEndpoint"
import axios from "axios"
import { cookies } from 'next/headers'

export const SimpanBooking = async (req) => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    try {
        const res = await axios.post(API_SIMPAN_BOOKING,{
            'kelas' : req.kelas,
            'tanggal' : req.tanggal,
            'jam' : req.jam
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return {code: 200, data: res.data}
    } catch (error) {
        
    }
}