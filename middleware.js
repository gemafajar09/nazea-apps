"use server"

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export function middleware(request, response) {

    const path = request.nextUrl.pathname
    const isPublicPath = path === '/'

    const cookieStore = cookies()
    const token = cookieStore.has('token')
    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/home', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    
}

export const config = {
    matcher: "/((?!.*\\.).*)",
}