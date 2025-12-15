
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ entityid: string }> }) {
    try {
        let session = await getSession();
        const searchParams = req.nextUrl.searchParams;
        let includeInactive = searchParams.get('includeInactive')
        let entityId = searchParams.get('entityId');
        let projectID = '';
        const selectedProject = session?.selectedAdminProject;
        
        if (selectedProject) {
            projectID = selectedProject.id;
        }
        else if (session?.selectedUserEntity) {
            entityId = session.selectedUserEntity.id;
            projectID = session.selectedUserEntity.projectid
        }
        else {
            return NextResponse.json({ message: "You dont have any projects assigned" })
        }

        const finalSql = sql.empty();

        finalSql.append(sql`select service, json_arrayagg (jsonb_build_object('id',s.id, 'name', sub_service, 'unit',unit, 'color', color, 'paymentType', "paymentType", 'active', active, 'bill_generation_date', s.bill_generation_date, 'due_date', s.due_date`);
        if (entityId)
            finalSql.append(sql`,'entity_service_id', es.id`)

        finalSql.append(sql` )) AS sub_services FROM services s left join projects p on s.project_id = p.id`)
        if (entityId) {
            finalSql.append(sql` left join entity_services es on es.service_id = s.id`);
        }

        finalSql.append(sql` where s.project_id = ${projectID}`);

        if (entityId) {
            finalSql.append(sql` and es.entity_id = ${entityId}`);
        }

        if (!includeInactive) {
            finalSql.append(sql` and s.active = true`);
        }
        finalSql.append(sql` GROUP BY s.service`);

        const { rows } = await db.execute(finalSql)

        return NextResponse.json(rows);

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};