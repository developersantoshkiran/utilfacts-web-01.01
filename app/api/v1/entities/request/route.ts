
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, UserEntitites } from "@/db/schema";
import { getSession, setSession } from "@/app/_components/auth";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest) {
    const { entity } = await req.json();
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'session doesnt exits' }, { status: 401 })
    }
    const { id } = session
    try {
        // 5. Redirect to /login if the user is not authenticated
        const results = await db.insert(UserEntitites).values({ userId: id, entityId: entity, statusId: 2, ownerShipTypeId: 1, primary: true }).returning({ id: UserEntitites.id });
        const entityDetails = await db.query.Entities.findFirst({
            where: eq(Entities.id, entity),
            with: {
                groups: {
                    with: {
                        project: true
                    }
                }
            }
        })
     
        if(entityDetails) {
            session.selectedUserEntity = {
                entity: entityDetails.entity,
                id: entityDetails.id,
                group: entityDetails.groups.name,
                status: 'Pending',
                projectid: entityDetails.groups.project.id,
                project:entityDetails.groups.project.name,
                primary: true,
                ownerShipType: 'Tenant'
            }
        }
     
        await setSession({ ...session, })
        return NextResponse.json(session)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};