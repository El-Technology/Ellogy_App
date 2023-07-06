import React, {useState} from 'react';
import {Box, Button, Divider, Menu, MenuItem, Typography} from '@mui/material';
import {useLocation, Link,} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {LogoutModal} from './LogoutModal';

// assets
import {ReactComponent as Logo} from '../../assets/icons/logo-ellogy.svg';
import {ReactComponent as Avatar} from '../../assets/icons/avatar.svg';
import {ReactComponent as Notification} from '../../assets/icons/notification.svg';
import {ReactComponent as ArrowDown} from '../../assets/icons/arrow-down.svg';
import {ReactComponent as Settings} from '../../assets/icons/setting-2.svg';
import {ReactComponent as Logout} from '../../assets/icons/logout.svg';
import {ReactComponent as Profile} from '../../assets/icons/profile-settings.svg'

// core
import {ROUTES} from "../../core/constants/routes";

export const Header = () => {
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
  const {i18n} = useTranslation();

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
    } else if (location.pathname === ROUTES.SIGNUP || location.pathname === ROUTES.RESET_PASSWORD || location.pathname === ROUTES.CREATE_NEW_PASSWORD) {
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
          gap: "12px",
        }}
      >
        <Box sx={{
          marginRight: "15px",
          padding: "10px",
          background: "#F3F4F5",
          borderRadius: "50%"
        }}
        >
          <Notification/>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "212px",
            gap: "12px"
          }}
        >
          <Avatar />

          <Button
            sx={{
              padding: "0",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px"
            }}
            onClick={handleClickOnMenu}
          >
            <Box sx={{
              textTransform: 'none',
              maxWidth: '128px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'baseline'
            }}>
              <Typography sx={{fontSize: "14px"}}>{user.firstName} {user.lastName}</Typography>
              <Typography sx={{
                color: "#9FA6B3",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: "14px"
              }}>
                {user.email}
              </Typography>
            </Box>
            <ArrowDown style={{rotate: anchorEl ? '180deg' : '0deg'}}/>
          </Button>


          <Menu
            PaperProps={{
              style: {
                width: 212,
                marginTop: "12px"
              },
            }}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
            <Divider
              sx={{
                margin: 0,
                borderColor: "#F3F4F5",
              }}
            />
            <MenuItem
              onClick={logout}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Logout/>
                <Typography sx={{color: '#FB0B24'}}>Log Out</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    )
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
          padding: '12px 30px',
          maxWidth: '1370px',
          width: '100%'
        }}
      >
        <Box sx={{display: 'flex', gap: '10px'}}>
          <Logo/>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>
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

            <Typography sx={{color: '#102142', fontSize: '10px'}}>Semantic Automation</Typography>
          </Box>
        </Box>

        {renderButton()}
      </Box>
      {isLogoutModalOpen && <LogoutModal handleCloseModal={handleCloseModal}/>}
    </Box>
  );
};
