'use client';

import { Button } from "@mui/material"
import { GET } from "../utils/api"
import { useRouter } from "next/navigation";

export default function Logout() {
    const { replace } = useRouter()
    async function logoutHandler() {

        try {
            await GET('/logout');
            replace('/')
        } catch (e) {
            console.log(e)
        }
    } 
    return <Button onClick={logoutHandler} variant="contained">Logout</Button>
}
