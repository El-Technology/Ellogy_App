import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { ReactComponent as Logo } from '../../assets/icons/logo-ellogy.svg';
import { ReactComponent as Avatar } from '../../assets/icons/avatar.svg';
import { ReactComponent as Notification } from '../../assets/icons/notification.svg';
import { useLocation, Link, } from 'react-router-dom';
import { ROUTES } from "../../core/constants/routes";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowDown } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as Settings } from '../../assets/icons/setting-2.svg';
import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import { ReactComponent as Profile } from '../../assets/icons/profile-settings.svg'
import { LogoutModal } from './LogoutModal';

export const AuthHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const open = Boolean(anchorEl);
  const handleClickOnMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const location = useLocation();
  const { i18n } = useTranslation();

  const handleClick = (lang: string = "en") => {
    i18n.changeLanguage(lang);
  };

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
 
  const logout = () => {
    setIsLogoutModalOpen(true);
    setAnchorEl(null)
  }

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false)
  }

  const goToProfile = () => {
    console.log('goToProfile')
    // navigate()
  }

  const goToSettings = () => {
    console.log('settings')
    // navigate() 
  }

  const renderButton = () => {
    if (location.pathname === ROUTES.LOGIN) {
      return (
        <Button
          component={Link}
          to="/sign-up"
          sx={{
            width: '150px',
            height: '45px',
            border: '1px solid #4786FF',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: '700',
          }}
        >
          Sign up
        </Button>
      );
    } else if (location.pathname === ROUTES.SIGNUP || location.pathname === ROUTES.RESET_PASSWORD) {
      return (
        <Button
          component={Link}
          to="/sign-in"
          sx={{
            width: '150px',
            height: '45px',
            border: '1px solid #4786FF',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: '700',
          }}
        >
          Log in
        </Button>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        {/*<Button sx={{minWidth: "20px"}} onClick={() => handleClick("ar")}>Ar</Button>*/}
        {/*<Button sx={{minWidth: "20px"}} onClick={() => handleClick("en")}>En</Button>*/}

        <Box sx={{marginRight: "15px"}}>
          <Notification />
        </Box>
        <Avatar />
        
        <Button onClick={handleClickOnMenu}>
          <Box sx={{
            textTransform: 'none',
            maxWidth: '150px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline'
          }}>
            <Typography>{user.firstName} {user.lastName}</Typography>
            <Typography sx={{
              color: "#9FA6B3", 
              maxWidth: '150px',
              overflow: 'hidden', 
              textOverflow: 'ellipsis'
            }}>
              {user.email}
            </Typography>
          </Box>
          <ArrowDown style={{ rotate: anchorEl ? '180deg': '0deg'}} />
        </Button>


        <Menu  
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={goToProfile}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Profile/>
              <Typography>Profile</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={goToSettings}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Settings/>
              <Typography>Settings</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={logout}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Logout/>
              <Typography sx={{ color: '#FB0B24'}}>Log Out</Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #E7E8EC',
        background: "#FBFBFB",
        boxShadow: '0px 4px 16px rgba(40, 103, 131, 0.06)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '12px 0',
          width: '60%',
        }}
      >
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Logo />

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                background: 'linear-gradient(90deg, #4786FF 0%, #3164C8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#000000',
                fontSize: '28px',
                fontWeight: '700',
              }}
            >
              Ellogy
            </Typography>

            <Typography sx={{ color: '#102142', fontSize: '10px' }}>Semantic Automation</Typography>
          </Box>
        </Box>

        {renderButton()}
      </Box>
      {isLogoutModalOpen && <LogoutModal handleCloseModal={handleCloseModal} />}
    </Box>
  );
};
