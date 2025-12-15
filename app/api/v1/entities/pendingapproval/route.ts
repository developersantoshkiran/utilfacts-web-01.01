
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { Entities, EntityApprovalStatuses, Groups, OwnerShipTypes, Projects, UserEntitites, Users } from "@/db/schema";
import { getSession } from "@/app/_components/auth";
import { and, eq, like, ilike, or, SQL } from "drizzle-orm";
export async function GET(req: NextRequest) {

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'User Session Expired' }, { status: 500 })
    }
    try {
        const { selectedAdminProject } = session;
        if (!selectedAdminProject) {
            return NextResponse.json({ message: 'User Session Expired' }, { status: 500 })
        }

        const searchParams = req.nextUrl.searchParams
        const ownerShipType = searchParams.get('ownerShipType')
        const status = searchParams.get('status')
        const createdOn = searchParams.get('dueDate')
        const searchTerm = searchParams.get('searchTerm')

        const where: SQL[] = []
        if (status && status !== 'null') {
            where.push(eq(EntityApprovalStatuses.status, status))
        }
        if (createdOn && createdOn !== 'null') {
            where.push(like(UserEntitites.createdAt, `%${createdOn}%`))
        }
        if (searchTerm && searchTerm !== 'null') {
            where.push(or(
                ilike(Users.name, `%${searchTerm}%`) as any,
                ilike(Entities.entity, `%${searchTerm}%`) as any
            ) as any)
        }
        if (ownerShipType && ownerShipType !== 'null') {
            where.push(eq(OwnerShipTypes.ownershipType, ownerShipType))
        }

        const results = await db.select().from(UserEntitites)
            .innerJoin(Users, eq(Users.id, UserEntitites.userId))
            .innerJoin(Entities, eq(Entities.id, UserEntitites.entityId))
            .innerJoin(Groups, eq(Groups.id, Entities.groupId))
            .innerJoin(Projects, eq(Projects.id, Groups.projectId))
            .innerJoin(OwnerShipTypes, eq(OwnerShipTypes.id, UserEntitites.ownerShipTypeId))
            .innerJoin(EntityApprovalStatuses, eq(EntityApprovalStatuses.id, UserEntitites.statusId))
            .where(and(eq(Projects.id, selectedAdminProject.id), ...where))

        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
}