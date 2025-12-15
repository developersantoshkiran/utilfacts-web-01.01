
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, Groups, Projects, UserEntitites } from "@/db/schema";
import { getSession, setSession } from "@/app/_components/auth";
import { and, eq, sql } from "drizzle-orm";
export async function POST(req: NextRequest) {
    const { userEntityId, projectId, entityId } = await req.json();
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'session doesnt exits' }, { status: 401 })
    }

    // check if project belongs to admin
    if (session.selectedAdminProject?.id !== projectId) {
        return NextResponse.json({ message: "you are not authorized" }, { status: 401 })
    }
    try {
        //if project belongs to admin, then check if entity belongs to admin
        const entites = await db.select({ id: Entities.id }).from(Entities)
            .innerJoin(Groups, eq(Groups.id, Entities.groupId))
            .innerJoin(Projects, eq(Projects.id, Groups.projectId))
            .where(and(eq(Entities.id, entityId), eq(Projects.id, projectId)))
       // check if there is a userentity and entity has relation, if exits update as approved.
        const results = await db.update(UserEntitites)
            .set({ statusId: sql`(select id from entity_approval_statuses where status= 'Approved')` })
            .where(and(eq(UserEntitites.id, userEntityId),
                eq(UserEntitites.entityId, entites[0].id))).returning();

        return NextResponse.json(results)
    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};