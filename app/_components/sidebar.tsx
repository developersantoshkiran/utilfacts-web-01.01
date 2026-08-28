import * as React from 'react';
import { getSession } from './auth';
import SidebarClient from './sidebarClient';

export default async function PermanentDrawerLeft({
    children,
    list = []
  }: Readonly<{
    children: React.ReactNode;
    list: Array<any>
  }>) {

    let session = await getSession();

    if (!session) {
        return <div style={{ padding: '24px', textAlign: 'center' }}>No active session found</div>;
    }

    // Pass data directly down into the client layout module
    return (
        <SidebarClient list={list} session={session}>
            {children}
        </SidebarClient>
    );
}
