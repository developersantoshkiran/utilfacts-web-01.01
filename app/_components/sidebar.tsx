

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import AppList from './List';
import Image from 'next/image';
import ProjectDropDown from './projectSelection';
import { getSession } from './auth';


const drawerWidth = 240;

export default async function PermanentDrawerLeft({
    children,
    list = []
  }: Readonly<{
    children: React.ReactNode;
    list: Array<any>
  }>) {

    let session = await getSession();

    if (!session) {
        return <div>no projects</div>
    }
    return (
        <Box sx={{ display: 'flex' }}>
         
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar sx={{
                    paddingLeft:'0px !important',
                    paddingTop: '42px',
                    paddingBottom: '24px'
                }}>
                        <Image alt='logo' src='/logo2.svg' width='190' height='62'></Image>
                </Toolbar>
                <Divider />
                <ProjectDropDown projects={session.admin} selectedAdminProject={session.selectedAdminProject}></ProjectDropDown>
                <Divider />
                <AppList list={list}></AppList>
            </Drawer>
            <Box
                component="main"
                sx={{ bgcolor: '#F9F9F9',overflowX:'auto',  flexGrow: 1, paddingTop: '39px', paddingLeft: '24px', paddingRight:'24px', paddingBottom: '39px'}}
            >
                {children}
            </Box>
        </Box>
    );
}


