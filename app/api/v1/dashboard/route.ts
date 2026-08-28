"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import {
  Entities,
  EntityConsumption,
  EntityServices,
  Groups,
} from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
export async function GET(
  req: NextRequest
) {
  try {
    let session = await getSession();
    const selectedProject = session?.selectedAdminProject
    if (!selectedProject) {
      return NextResponse.json({ message: "You dont have any projects assigned" })
    }
    let projectName = selectedProject.name;
    const searchParams = req.nextUrl.searchParams;
    const sub_service = searchParams.get('subService');
    
    const { rows } = await db.execute(sql`with bucketed as (select date_trunc('month', ec."created_At") AS month, ec.entity_service_id,
max(ec.units_consumed) as units_consumed from entity_consumption ec 
left join entity_services es on es.id = ec.entity_service_id 
left join services s on es.service_id = s.id 
left join projects p on s.project_id  = p.id 
where p."name" = ${projectName} and s.sub_service = ${sub_service} and s.active = true
group by month, ec.entity_service_id
order by month  desc),
aggregated as (select month, sum(units_consumed) as total_units  from  bucketed group by month)
select to_char(month, 'Mon YY') as shortMonth,
(CASE
      WHEN total_units >= lag(total_units)  OVER (ORDER BY month)
        THEN total_units - lag(total_units)  OVER (ORDER BY month)
      WHEN lag(total_units)  OVER (ORDER BY month) IS NULL THEN NULL
      ELSE total_units
    end)  as units_consumed from aggregated
`);

    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }
}
