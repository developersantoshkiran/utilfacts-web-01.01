
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { bills, Entities, EntityServices, Groups } from "@/db/schema";
import { and, eq } from "drizzle-orm";
export async function PUT(req: NextRequest, { params }: { params: Promise<{ generatedBillId: string }> }) {
    const { remarks = null } = await req.json();
    const session = await getSession();
    const selectedProject = session?.selectedAdminProject;
    if (!selectedProject) {
        return NextResponse.json({ message: "not authorized" }, { status: 401 })
    }
    try {
        const { generatedBillId } = await params;
        const results = await db.update(bills).set({ status: 'Paid', remarks })
            .where(and(eq(bills.generated_bill_id, generatedBillId), eq(bills.project, selectedProject.name))).returning();

        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};