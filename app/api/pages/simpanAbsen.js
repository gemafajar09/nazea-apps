"use server"

import { API_ABSEN, API_BANNER, API_JADWAL_BOOKING } from "@/lib/apiEndpoint"
import axios from "axios"
import { cookies } from 'next/headers'

export const SimpanAbsen = async (id) => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    try {
        const res = await axios.get(`${API_ABSEN}/`+id,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return {code: 200, data: res.data}
    } catch (error) {
        return {code: 400, error: error}
    }
}