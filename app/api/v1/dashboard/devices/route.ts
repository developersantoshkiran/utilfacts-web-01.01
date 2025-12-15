
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/_components/auth";
import { db } from "@/app/_components/services/dbconnection";
import { sql } from "drizzle-orm";
export async function GET(req: NextRequest) {
       let session = await getSession();
        const selectedProject = session?.selectedAdminProject
    if (!selectedProject) {
        return NextResponse.json({ message: "You dont have any projects assigned" })
    }
    let projectName = selectedProject.name;
    
    try {
        const { rows } = await db.execute(sql`
with q1 as (select
	service,
	count(distinct e.entity) as no_of_entity_services,
	count(distinct es.device_id) as no_of_DCUs,
	array_agg(distinct e.entity) as entities
from
	services s
left join projects p on
	s.project_id = p.id
left join entity_services es on
	es.service_id = s.id
	left join entities e on
	es.entity_id = e.id
where
	p."name" =${projectName} and s.active = true
group by
	service),

q2 as (select
	service, 
	count(distinct e.entity) as no_of_entity_services,
	array_agg(distinct e.entity) as entities,
	count(distinct es.device_id) as no_of_DCUs
from
	services s
left join projects p on
	s.project_id = p.id
left join entity_services es on
	es.service_id = s.id
left join entity_consumption ec on
	ec.entity_service_id = es.id
left join entities e on
	es.entity_id = e.id
where
	p."name" =${projectName} and s.active = true
	and ec."created_At" >= date_trunc('hour',
	now()) - interval '1 hour'
group by
	service)
	select jsonb_agg(jsonb_build_object('service',
	q1.service,
	'configured_services',
	 q1.no_of_entity_services,
	'active_services',q2.no_of_entity_services, 'downentities',  (
          SELECT ARRAY_AGG(entity)
          FROM UNNEST(q1.entities) entity
          WHERE entity NOT IN (SELECT UNNEST(q2.entities))
        ))) as service_data, 
	sum(q1.no_of_DCUs) as configured_DCUs, sum(q2.no_of_DCUs) as  active_DCUs ,
	(select sum(no_of_services) as total_sids from (
select device_id, count(distinct sid) as no_of_services from entity_services es 
left join entities e on es.entity_id = e.id 
left join "groups" g on e.group_id = g.id 
left join projects p on g.project_id = p.id 
where p."name" =${projectName} group by device_id)) as devices
from q1 left join q2 on q1.service = q2.service
	
	
`);
        return NextResponse.json(rows[0])

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};