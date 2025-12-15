
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { bills } from "@/db/schema";
import { and, eq, like, ilike, or, sql, SQL, desc, asc, inArray, getTableColumns } from "drizzle-orm";
import { getSession } from "@/app/_components/auth";

export async function GET(req: NextRequest) {
    let session = await getSession();
    const searchParams = req.nextUrl.searchParams;
    let selectedProjectName = '';
    let searchTerm = searchParams.get('searchTerm')
    if (session?.selectedUserEntity) {
        searchTerm = session.selectedUserEntity.entity;
        selectedProjectName = session.selectedUserEntity.project;
    }
    else if (session?.selectedAdminProject) {
        selectedProjectName = session.selectedAdminProject.name;
    }
    else {
        return NextResponse.json({ message: "You dont have any projects assigned" })
    }
   
    const status = searchParams.get('status')
    const dueDate = searchParams.get('dueDate')

    const subServices = searchParams.get('sub_services')
    const exportToCSV = searchParams.get('export')
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('page_size')) || 5;  
    let offset = (page - 1) * pageSize;

   
    try {
        const where: SQL[] = []
        if (status && status !== 'null') {
           
            where.push(inArray(bills.status,  status.split(',')))
        }
        if (dueDate && dueDate !== 'null') {
            where.push(like(bills.due_date, `%${dueDate}%`))
        }
        if (searchTerm && searchTerm !== 'null') {
            where.push(ilike(bills.entity, `%${searchTerm}%`))
        }

        if (selectedProjectName) {
            where.push(eq(bills.project, selectedProjectName))
        }

        if (subServices) {
            where.push(inArray(bills.service_subtype, subServices.split(',')))
        }
        if (exportToCSV) {
            const results = await db.select().from(bills).where(and(...where)).orderBy(desc(bills.due_date), asc(bills.entity))
            return NextResponse.json(results)
        }

        const results = await db.select({
            results: sql`jsonb_agg(bills)`,
            total_amount: sql`sum(amount::float)`,
            count: sql<number>`count(*) over()`
        }).from(bills)
            .where(and(...where))
            .orderBy(desc(bills.due_date), asc(bills.entity))
            .groupBy(() => [bills.due_date, bills.service, bills.entity])
            .limit(pageSize).offset(offset)
        return NextResponse.json(results)

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};