
import { db } from "@/app/_components/services/dbconnection";
import { sql, eq } from "drizzle-orm";
import dayjs from 'dayjs'
import { Projects, Services } from '../../../../db/schema';


export async function generateBills() {
    //seed roles
    try {
        let projectsInfo = await db.select().from(Projects).innerJoin(Services, eq(Services.projectId, Projects.id));

        for (let { projects, services } of projectsInfo) {
            let { name, id } = projects;
            let { subService, bill_generation_date } = services;
            if (!bill_generation_date) {
                continue;
            } 

            if (bill_generation_date !== Number(dayjs().format('D'))) {
                continue;
            }

            const statement = sql`
                insert into bills (with rankedbills as (select *, ROW_NUMBER() OVER (PARTITION BY entity, project, group_name order by to_date desc) as rank from bills where service_subtype=${subService} and project = ${name}),
                pastbills as (select * from rankedbills where rank=1),
                entity_consumption_latest as (select *, ROW_NUMBER() OVER (PARTITION BY entity_service_id order by date desc) as rank from entity_consumption ec left join entity_services es  on es.id = ec.entity_service_id left join services s on s.id = es.service_id where s.sub_service = ${subService} and project_id=${id})
                select  
                (select generated_bill_id from bills order by generated_bill_id desc limit 1)::Numeric + row_number() over () as  generated_bill_id,
                CONCAT(p.project_code,TO_CHAR(NOW() :: DATE, 'DDMMYYYY'), replace(e.entity,' ', ''), '-E001') as bill_no,
                CURRENT_DATE as bill_date,
                CURRENT_DATE + concat(s.due_date,' day')::interval as due_date,
                NULL as project_group_name,
                e.entity,
                s.service,
                s.sub_service as  service_subtype,
                pb.to_date as from_date,
                current_date as to_date,
                coalesce(pb.present_reading::numeric, 0) as past_reading,
                ec.units_consumed as present_reading,
                (ec.units_consumed - coalesce(pb.present_reading::numeric, 0)) as consumption,
                s.unit_cost,
                s.unit_cost * (ec.units_consumed - coalesce(pb.present_reading::numeric,0)) as amount,
                'Auto' as bill_mode,
                'Due' as status,
                p.name as project,
                g."name"  as group_name,
                '' as created_date
                from entity_consumption_latest ec 
                inner join entity_services es on es.id = ec.entity_service_id 
                inner join services s on s.id = es.service_id  
                inner join devices d on es.device_id = d.id 
                inner join entities e on es.entity_id = e.id
                inner join "groups" g on e.group_id = g.id
                inner join projects p on p.id = g.project_id
                left join pastbills pb on (e.entity = pb.entity) and (pb.service_subtype = s.sub_service) where p.name = ${name} and ec.rank=1 and s.sub_service=${subService})`;
            await db.execute(statement);


        }

    } catch (e) {
        console.log(e)
    }
}

