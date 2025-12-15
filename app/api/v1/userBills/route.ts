
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { bills } from "@/db/schema";
import { and, eq, like,ilike, or, sql, SQL, desc, asc, inArray } from "drizzle-orm";
import { getSession } from "@/app/_components/auth";

export async function GET(req: NextRequest) {
    let session = await getSession();
    if (!session?.selectedUserEntity) {
        return NextResponse.json({ message: "You dont have any entities assigned" })
    }

    let entity = session.selectedUserEntity;

    try {
        const results = await db.select().from(bills).where(eq(bills.entity, entity.entity)).orderBy(desc(bills.due_date))
        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};