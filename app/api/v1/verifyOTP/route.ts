
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { OTP, Projects, UserEntitites, Users } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { setSession } from "@/app/_components/auth/index"
import type { entity, Session } from "@/app/_types/types";


export async function POST(req: NextRequest) {
    try {
        const isDevice = req.headers.get('device');
        let { otp, reference } = await req.json();
        let results = await db.select({
            otp: OTP.otp,
            validTill: OTP.validTill,
            mobile: OTP.mobile
        }).from(OTP).where(and(eq(OTP.id, reference), eq(OTP.otp, otp), gt(OTP.validTill, new Date())))

        if (!results.length) {
            return NextResponse.json({ message: 'Incorrect OTP' }, { status: 400 })
        }
        // let users = (await db.select().from(Users).where(eq(Users.mobile, results[0].mobile)))
        let user = await db.query.Users.findFirst({
            where: eq(Users.mobile, results[0].mobile),

            with: {
                UserEntities: {
                    with: {
                        entity: {
                            with: {
                                services: {
                                    with: {
                                        service: true
                                    }
                                }, groups: {
                                    with: {
                                        project: true
                                    }
                                }
                            }
                        },
                        OwnerShipType: true,
                        status: true,
                    }
                },
                projectAdmins: {
                    with: { project: true }
                }
            }
        });

        if (user) {
            let adminProjects = user.projectAdmins.map(({ project }) => project);
            let userEntities = user.UserEntities.map(({ entity, status, OwnerShipType, primary }) => ({
                "entity": entity.entity,
                "group": entity.groups.name,
                "project": entity.groups.project.name,
                "projectid": entity.groups.project.id,
                "id": entity.id,
                // "serviceIds": entity.services.map(({ id, service }) => ({ id, name: service.subService })),
                "status": status.status,
                "primary": primary,
                "ownerShipType": OwnerShipType.ownershipType
            }))
            user.projectAdmins = []
            user.UserEntities = []
            // Create the session
            let sessionObject = {
                ...user,
                admin: isDevice ? [] : adminProjects,
                selectedAdminProject: isDevice? null: adminProjects[0],
                selectedUserEntity: isDevice? userEntities[0]: null,
                // entities:isDevice? userEntities :[]
            }
            await setSession(sessionObject as any as Session)
            return NextResponse.json(sessionObject)
        }
        return NextResponse.json({ message: 'User not found' }, { status: 400 })

    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'something went wrong' }, { status: 500 })
    }



};