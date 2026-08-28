import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/_components/auth';
import { Session } from './app/_types/types';

// 1. Specify protected and public routes

const publicRoutes = ['/login', '/signup', '/verifyOTP', '/api/v1/login', '/api/v1/signup', '/api/v1/verifyOTP'];
const basicAuthRoutes = ['/api/v1/sync']

export default async function proxy(req: NextRequest) {

    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const basicAuth = req.headers.get('authorization');
    const isDevice = req.headers.get('device');
    const isBasicAuthRoute = basicAuthRoutes.includes(path);
    if (isBasicAuthRoute && basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')
        if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
            return NextResponse.next()
        }
    }


    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    const session: Session = await decrypt(cookie);

    // 5. Redirect to /login if the user is not authenticated
    if (!isPublicRoute && !session?.id) {
        if (isDevice) {
            return NextResponse.json({ message: 'Session Expired' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 6. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute &&
        session?.id
    ) {
        if (isDevice) {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    const res = NextResponse.next()
    return res
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!_next/static|public|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)'],
}




