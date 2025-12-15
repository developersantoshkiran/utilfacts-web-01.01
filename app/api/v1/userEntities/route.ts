
"use server";

import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { UserEntitites, Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'session expired' }, { status: 401 })
    }

    const { id } = session;
    try {
        let enitities = await db.query.UserEntitites.findMany({
            where: eq(UserEntitites.userId, id),
            with: {
                
                entity: {

                    with: {
                        services: {
                            with: {
                                service: true
                            }
                        },
                        groups: {
                            with: {
                                project: true
                            }
                        },
                        
                    }
                },
                OwnerShipType: true,
                status: true,
                
            }
        })
        let userEntities = enitities.map(({ entity, status, OwnerShipType }) => ({
            "entity": entity.entity,
            "project": entity.groups.project.name,
            "group": entity.groups.name,
            "status": status.status,
            "services": entity.services.map(({ service }) => service),
            "ownerShipType": OwnerShipType.ownershipType
        }));


        return NextResponse.json(userEntities);
    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};