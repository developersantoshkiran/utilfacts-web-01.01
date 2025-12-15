
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession, setSession } from "@/app/_components/auth";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const projectId = searchParams.get('project');
        let session = await getSession();
        let adminProjects = session?.admin;
        if (!adminProjects?.length || !session) {

            return NextResponse.json({ message: 'user doesnt exists' }, { status: 401 })
        }
        let isUserProject = adminProjects.find(({ id }) => id === projectId);
        // 5. Redirect to /login if the user is not authenticated
        if (isUserProject) {
            session.selectedAdminProject = isUserProject;
        }
        await setSession(session)

        return NextResponse.json({ message: "project reset succesfull" });

    } catch (e: any) {
        return NextResponse.json({ message: e?.message }, { status: 500 });
    }
};