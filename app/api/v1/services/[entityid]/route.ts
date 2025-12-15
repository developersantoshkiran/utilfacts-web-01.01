
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, EntityServices, Groups } from "@/db/schema";
import { and, eq } from "drizzle-orm";
export async function GET(req: NextRequest, { params }: { params: Promise<{ entityid: string }> }) {
    try {
        const results = await db.query.EntityServices.findMany({
            where: eq(EntityServices.entityId, (await params).entityid),
            with: {
                service: true
            }
        })
        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};