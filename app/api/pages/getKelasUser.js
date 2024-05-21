"use server"

import { API_KELAS_USER } from "@/lib/apiEndpoint"
import axios from "axios"
import { cookies } from 'next/headers'

export const GetKelasUser = async () => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    try {
        const res = await axios.get(API_KELAS_USER,{
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