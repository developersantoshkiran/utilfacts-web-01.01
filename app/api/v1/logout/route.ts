
"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
export async function GET(req: NextRequest) {
    try {
        (await cookies()).delete('session')
        return NextResponse.json({message: "deleted succesfully"})

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};