
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { projectAdmins } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function GET(req: NextRequest) {
    try {
        let session = await getSession();
        let user_id = session?.id;
        if (!user_id) {
            return NextResponse.json({ message: 'user doesnt exists' }, { status: 401 })
        }
        // 5. Redirect to /login if the user is not authenticated
        const results = await db.query.projectAdmins.findMany({
            where: eq(projectAdmins.userId , user_id),
            with: { project: true }
        })

        return NextResponse.json(results.map(({ project }) => project))

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};