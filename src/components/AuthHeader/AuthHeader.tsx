import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ReactComponent as Logo } from '../../assets/icons/logo-ellogy.svg';
import { useLocation, Link } from 'react-router-dom';
import {ROUTES} from "../../core/constants/routes";

export const AuthHeader = () => {
  const location = useLocation();

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

    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #E7E8EC',
        boxShadow: '0px 4px 16px rgba(40, 103, 131, 0.06)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '12px 0',
          width: '80%',
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
