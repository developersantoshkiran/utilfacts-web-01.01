
'use client'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter, usePathname } from 'next/navigation';

export default function AppList({ list }: { list: Array<any> }) {
    const path = usePathname()
    const {push} = useRouter()

    return <List>
        {list.map(({ name, redirectTo, disabled }, index) => (
            <ListItem key={name} disablePadding>
                <ListItemButton  
                    disabled = {disabled}
                    sx={{backgroundColor:path ===redirectTo?'#EEECFF':""}}
                    selected={path ===redirectTo}
                    onClick={() => { push(redirectTo) }}>
                    <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps ={{fontWeight:'bold', color: path ===redirectTo?'#6E5DE7':''}} sx={{fontWeight:'extraBold'}} primary={name} />
                </ListItemButton>
            </ListItem>
        ))}
    </List>
}