"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import AppList from './List';
import ProjectDropDown from './projectSelection';

const drawerWidth = 240;

interface SidebarClientProps {
  children: React.ReactNode;
  list: Array<any>;
  session: any;
}

export default function SidebarClient({ children, list, session }: SidebarClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // While rendering server-side, render a clean, semantic HTML layout block.
  // This lets MUI's base engines inject styles safely without throwing hydration bugs.
  if (!isMounted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F9F9' }}>
        <aside style={{ width: drawerWidth, borderRight: '1px solid rgba(0, 0, 0, 0.12)' }} />
        <main style={{ flexGrow: 1, padding: '39px 24px' }}>{children}</main>
      </div>
    );
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
          paddingLeft: '0px !important',
          paddingTop: '42px',
          paddingBottom: '24px'
        }}>
          <Image alt='logo' src='/logo2.svg' width={190} height={62} priority />
        </Toolbar>
        <Divider />
        <ProjectDropDown projects={session.admin} selectedAdminProject={session.selectedAdminProject} />
        <Divider />
        <AppList list={list} />
      </Drawer>
      
      <Box
        component="main"
        sx={{ bgcolor: '#F9F9F9', overflowX: 'auto', flexGrow: 1, paddingTop: '39px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '39px' }}
      >
        {children}
      </Box>
    </Box>
  );
}
