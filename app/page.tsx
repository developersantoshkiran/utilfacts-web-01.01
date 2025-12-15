'use client'

import Button from '@mui/material/Button';
import theme from './theme';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import styles from './page.module.scss';
import { HeroCard } from './_components/cards/herocard';
import { GET } from './utils/api';
import { SessionContext } from './_providers/sessionProvides';
import Logout from './_components/logout';


export default function Home() {
  
  const { push, replace } = useRouter();
   let session = useContext(SessionContext)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [{name: 'Profile'}, {name:'Account'}, {name:'Dashboard'}, {name: <Logout/>, onClick: async () => { 
    

  }}];
  const pages = ['Products', 'Pricing', 'Blog'];
  return <> <div style={{
    padding: '24px 65px',
    display: 'flex',
    justifyContent: 'space-between'
  }}>
    <Image width='191' height='30' src='/logo.svg' alt="logo">
    </Image>

    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={session?.name} src="/static/images/avatar/2.jpg" />

        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting, ind) => {
          return <MenuItem key={ind} onClick={handleCloseUserMenu}>
          <Typography textAlign="center" onClick={setting.onClick}>{setting.name}</Typography>
        </MenuItem>
        }
          
        )}
      </Menu>
    </Box>

    {/* <button onClick={() => push('/dashboard')}>go to dashbaord</button> */}
  </div>
    <div id='hero-section' className={styles.hero}>
      <div className={styles.hero_header}>BMS Pro</div>
      <div className={styles["hero_description"]}>One stop platform for all the Building management services.</div>
    </div>
    <div style={{
      paddingLeft: '67px',
      paddingRight: '67px',
    }}>
      <div className={styles.billing_menu}>
        <span className={styles.billing_menu_heading}>IBMS</span>

      </div>
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: "repeat(auto-fill, minmax(602px, 1fr))"
      }}>
        <HeroCard  onClick={() =>push('/dashboard') } title='UtilFacts' description='Utility management Systems'>
          <span>Water</span>
          <span>Gas</span>
          <span>Electricity</span>
        </HeroCard>
        <HeroCard title='Security' description='Security Systems'>
          <span>CCTV</span>
          <span>Access Control</span>
          <span>Boom Barrier</span>
        </HeroCard>
        <HeroCard title='Alaram' description='Life Safety Systems'>
          <span>Fire Alaram</span>
          <span>Public Addressable</span>
        </HeroCard>
        <HeroCard title='BMS' description='BUilding Management Systems'>
          <span>Heating</span>
          <span>Ventilation</span>
          <span>Air Conditioning</span>
        </HeroCard>

      </div>

      <div className={styles.PMS}>
        <span className={styles.PMS_heading}>PMS</span>

      </div>
      <div style={{
        display: 'grid',
        gap: '20px',
        paddingBottom: '70px',
        gridTemplateColumns: "repeat(auto-fill, minmax(607px, 1fr))"
      }}>
        <HeroCard title='Gate Management' description='Utility management System'>
          <span>Visitors</span>
          <span>Deliveries</span>

        </HeroCard>
        <HeroCard title='Complaints' description='Utility management System'>
          <span>Grieviences</span>
        </HeroCard>
        <HeroCard title='PMS' description='Utility management System'>
          <span>Accounting</span>
          <span>Approval</span>
          <span>Notices</span>
        </HeroCard>
      </div>
    </div>
  </>


}
