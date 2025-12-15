
"use server";

import { NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
export async function GET() {
    try {

        // 5. Redirect to /login if the user is not authenticated
        const results = await db.query.Groups.findMany()

        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};