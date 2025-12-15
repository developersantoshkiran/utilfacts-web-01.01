
"use server";

import { getSession } from "@/app/_components/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'session expired' }, { status: 401 })
    }

    const { id, admin } = session;
    try {
        return NextResponse.json(admin);
    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};