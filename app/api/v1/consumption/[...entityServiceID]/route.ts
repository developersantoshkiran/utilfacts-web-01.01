
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, EntityConsumption, EntityServices, Groups } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
export async function GET(req: NextRequest, { params }: { params: Promise<{ entityServiceID: Array<string> }> }) {
    try {
        let entityServiceIds = (await params).entityServiceID;
        const results = await Promise.all(entityServiceIds.map(entityServiceId => db.query.EntityConsumption.findFirst({
            where: eq(EntityConsumption.entityServiceId, entityServiceId),
            orderBy: desc(EntityConsumption.date),
            with: {
                entityService: {
                    with: {
                        service: true
                    }
                }
            }
        })));
        return NextResponse.json(results || []);

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};