
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, EntityApprovalStatuses, Groups, Projects, UserEntitites, Users } from "@/db/schema";
import { and, eq, like, sql, SQL } from "drizzle-orm";
export async function GET(req: NextRequest) {
    try {
        const searchparams= req.nextUrl.searchParams;
        const entity = searchparams.get('entity');
        const group = searchparams.get('group');

        let session = await getSession();
        if (!session?.selectedAdminProject) {
            return NextResponse.json({ message: "You dont have any projects assigned" })
        }
        if (!entity || !group) {
            return NextResponse.json({ message: "Entity is mandatory" })
        }
        const results = await db.selectDistinct({name: Users.name, phoneNumber: Users.mobile, email: Users.email}).from(Users)
            .innerJoin(UserEntitites, eq(Users.id, UserEntitites.userId))
            .innerJoin(Entities, eq(Entities.id, UserEntitites.entityId))
            .innerJoin(Groups, eq(Groups.id, Entities.groupId))
            .innerJoin(Projects, eq(Projects.id, Groups.projectId))
            .where(and(eq(Projects.id, session?.selectedAdminProject.id), eq(Groups.name, group), eq(Entities.entity, entity)))

        return NextResponse.json(results[0] || {})

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};