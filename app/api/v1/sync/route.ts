
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_components/services/dbconnection";
import { devices, EntityConsumption, EntityServices } from "@/db/schema";
import { eq, sql, and, or } from "drizzle-orm";
import dayjs from 'dayjs'
import { generateBills } from "./util";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'

export async function POST(req: NextRequest) {
    try {

        let data: any[] = await req.json();
        dayjs.extend(utc);
        dayjs.extend(timezone);
        let whereCondition = data.map((record) =>
            and(
                eq(EntityServices.parameter_name, record.parameter),
                eq(EntityServices.sid, record.sid),
                eq(devices.macaddress, record.mac)
            )
        );
        const matched = await db.select({
            parameter: EntityServices.parameter_name,
            sid: EntityServices.sid,
            mac: devices.macaddress,
            id: EntityServices.id
        }).from(EntityServices)
            .leftJoin(devices, eq(EntityServices.deviceId, devices.id))
            .where(
                or(...whereCondition)
            );
       
        let map: any = {};
        let values = [];
        let devicesNotConfigured = []
        for (let { parameter, sid, mac, id } of matched) {
            let key = `${parameter}-${sid}-${mac}`;
            map[key] = id
        }

        for (let { parameter, sid, mac, value, dtm } of data) {
            let key = `${parameter}-${sid}-${mac}`;
            let id = map[key];
            if (id) {
                values.push({
                     entityServiceId: id,
                    units_consumed: value,
                    date: dayjs(dtm, 'YYYYMMDDHHmmss').tz('Asia/Kolkata', true).toDate()
                });
                continue;
            };
            devicesNotConfigured.push({ parameter, sid, mac });
        };

        const result = await db.insert(EntityConsumption).values(values).returning({id: EntityConsumption.id});
        return NextResponse.json({ inserted: result, notInserted: devicesNotConfigured });

    } catch (e: any) {
        console.log(e)
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
};

export async function GET(req: NextRequest) {
    try {
        // const res = await generateBills();

        const res = await generateBills();
        return NextResponse.json({ message: 'executed cron' })
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({ message: e?.message }, { status: 500 })
    }
}





