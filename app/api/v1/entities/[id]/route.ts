
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, Groups } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const results = await db.query.Entities.findMany({
            where: eq(Entities.groupId, (await params).id)
        })

        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};