
'use client'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { usePathname, useRouter } from 'next/navigation';
import { GET } from '../utils/api';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../_providers/sessionProvides';
import { CircularProgress } from '@mui/material';



export default function ProjectDropDown({ projects = [], onClick, selectedAdminProject }: any) {


    async function onProjectChange(project: string) {
        await GET(`/projects/change?project=${project}`).then(() => {
            window.location.reload();
        }).catch(e => console.log(e))
    }

    return <FormControl sx={{
        margin: '20px'
    }}>
        <InputLabel id="project-select-label">Project</InputLabel>

        <Select
            labelId="project-select-label"
            id="project-select-select"
            label={"Project"}
            value={selectedAdminProject.id}
            onChange={(e) => onProjectChange(e.target.value)}

        >

            {(projects as any[]).map(({ id, name }, ind) => {
                return <MenuItem key={id} value={id}>{name}</MenuItem>
            })}

            {/* <MenuItem value={20}>Risnia Skyon 1</MenuItem>
            <MenuItem value={30}>Risnia Skyon 2</MenuItem> */}
        </Select>
    </FormControl>
}