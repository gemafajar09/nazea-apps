"use server"

import { API_LOGIN } from "@/lib/apiEndpoint"
import axios from "axios"
import { cookies } from 'next/headers'

export const loginUser = async (req) => {
    try {
        const data = await axios.post(API_LOGIN,{
            "email" : req.email,
            "password" : req.password
        })

        if(data.data.status != 400){
            cookies().set({
                name: 'token',
                value: data.data.token,
                httpOnly: true,
                path: '/',
            })
        }

        return {data: data.data}
    } catch (error) {
        return {code : 400, error: error}
    }
}