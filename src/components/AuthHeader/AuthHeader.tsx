import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ReactComponent as Logo } from '../../assets/icons/logo-ellogy.svg';
import { ReactComponent as Avatar } from '../../assets/icons/avatar.svg';
import { ReactComponent as Notification } from '../../assets/icons/notification.svg';
import { useLocation, Link } from 'react-router-dom';
import {ROUTES} from "../../core/constants/routes";
import {useTranslation} from "react-i18next";

export const AuthHeader = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const handleClick = (lang: string = "en") => {
    i18n.changeLanguage(lang);
  };

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

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

        <Box>
          <Typography>{user.firstName} {user.lastName}</Typography>
          <Typography sx={{color: "#9FA6B3"}}>{user.email}</Typography>
        </Box>
      </Box>
    )
  };

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
    </Box>
  );
};
