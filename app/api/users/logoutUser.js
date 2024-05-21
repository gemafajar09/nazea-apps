'use server'
 
import { cookies } from 'next/headers'
 
export const LogoutUser = async () => {
    await cookies().delete('token')

    return true
}