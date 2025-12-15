
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
export async function POST(req: NextRequest) {
    let services = await req.json();
    try {
        const results = await Promise.all(services.map(({ entityServiceId, project, entity, group, sub_service, service, unit }: any) =>
            db.execute(` with consumption as (select * from entity_consumption ec  where ec.entity_service_id = '${entityServiceId}' order by ec."date" desc limit 1),
 latestbill as (select * from bills b where b.entity = '${entity}' and b.project='${project}' and b.service='${service}' and b.group_name='${group}' and b.service_subtype='${sub_service}'  order by bill_date desc limit 1)
select (consumption.units_consumed -latestbill.present_reading::decimal) as consumed_since_last_bill, '${unit}' as unit, * from latestbill, consumption
                `)
        ));   
        return NextResponse.json(results.map(({rows}) => rows[0]) || []);

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};