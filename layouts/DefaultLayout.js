import React, { useContext, useEffect } from 'react';
import Router from 'next/router';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import { MetamaskContext } from './../store/metamask';

const Header = ({ children }) => {
  const {
    selectedAccount,
    balance,
    getOwnBalance,
    isInitialized,
    isWrongChaingId,
  } = useContext(MetamaskContext);

  useEffect(() => {
    if (isInitialized && !isWrongChaingId) {
      getOwnBalance();
    }
  }, [selectedAccount, balance]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar color="transparent" position="static">
          <Toolbar
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
            }}>
            <Typography
              variant="h6"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                Router.push('/');
              }}>
              Quiz
            </Typography>
            <Box>
              <Typography variant="small" component="div">
                {selectedAccount}
              </Typography>
              <Typography variant="small" component="div">
                {balance} Quiz Token
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </>
  );
};

export default Header;
