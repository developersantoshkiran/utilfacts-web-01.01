
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
        if (e.cause.code === '404') {
            return NextResponse.json({ message: "User Not Found" }, { status: 404 })
        }
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};