
"use server";

import { NextRequest, NextResponse } from "next/server";
import { OTPService } from '@/app/_components/services/otpservice';
import { db } from "@/app/_components/services/dbconnection";
import { Users } from "@/db/schema";

export async function POST(req: NextRequest) {
    try {
        let { mobileNumber: mobile, emailId: email, fullName: name } = await req.json();
        let results = await OTPService(mobile, email);
        if (results && results[0] && results[0].id) {
            await db.insert(Users).values({
                name,
                mobile,
                email,
                roleId: 2,
                email_verified: true
            }).onConflictDoNothing()
            return NextResponse.json({ id: results[0].id, expiresInSeconds: Number(process.env.OTP_RESEND_TIME_IN_SECONDS) })
        } else {
            return NextResponse.json({ message: 'Couldnt send OTP' }, { status: 500 })
        }
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }



};