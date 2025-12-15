
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, EntityConsumption, EntityServices, Groups } from "@/db/schema";
import { and, desc, eq, SQL, gte, lte, inArray } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ entityServiceID: Array<string> }> }) {
    const searchparams= req.nextUrl.searchParams;
    const startDate = searchparams.get('startDate');
    const endDate = searchparams.get('endDate');
    const where: SQL[] = []
    const prams = (await params)
    const entityServiceIds = prams.entityServiceID;
    console.log(entityServiceIds)
    if(startDate && startDate !=='null') {
        where.push(gte(EntityConsumption.date, new Date(startDate)))
    }
    if(endDate && endDate !=='null') {
        where.push(lte(EntityConsumption.date, new Date(endDate)))
    }
    try {
        const results = await db.query.EntityConsumption.findMany({
            where: and(inArray(EntityConsumption.entityServiceId, entityServiceIds), ...where),
            orderBy: desc(EntityConsumption.date)
        })
        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};