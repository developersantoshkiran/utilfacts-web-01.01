
"use server";

import { NextRequest, NextResponse } from "next/server";
import { OTPService } from '@/app/_components/services/otpservice';

export async function POST(req: NextRequest) {
    try {
        let { mobileNumber } = await req.json();
        let results = await OTPService(mobileNumber);
        if (results && results[0] && results[0].id) {
            return NextResponse.json({ reference: results[0].id, expiresInSeconds: Number(process.env.OTP_RESEND_TIME_IN_SECONDS) })
        }
        return NextResponse.json({ message: 'Couldnt send OTP' }, { status: 500 })

    } catch (e: any) {
<<<<<<< HEAD
        if (e.cause.code === '404') {
            return NextResponse.json({ message: "User Not Found" }, { status: 404 })
        }
        return NextResponse.json({ message: e?.message }, { status: 500 })
=======
    //     if (e.cause.code === '404') {
    //         return NextResponse.json({ message: "User Not Found" }, { status: 404 })
    //     }
    //     return NextResponse.json({ message: e?.message }, { status: 500 })
    // }

    console.error("LOGIN ERROR:", e);

    // Case 1: explicit 404 from DB or service
    if (e?.cause?.code === '404' || e?.code === '404') {
        return NextResponse.json(
            { message: "User Not Found" },
            { status: 404 }
        );
    }

    // Case 2: known error message
    if (e?.message) {
        return NextResponse.json(
            { message: e.message },
            { status: 500 }
        );
    }

    // Case 3: unknown crash
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    )
>>>>>>> 58a85e8 (Working code utilfactswebportalv1.0)
    }
};