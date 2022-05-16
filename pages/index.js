import { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import withDefaultLayout from './../hocs/withDefaultLayout';
import { makeStyles } from '@mui/styles';

import {
  Container,
  Grid,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MetamaskContext } from '../store/metamask';
import { QUIZ } from './../data';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    background: '#00000022',
    borderRadius: '15px',
  },
  title: {
    marginBottom: '0',
  },
  image: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
    objectFit: 'cover',
  },
}));

const Home = () => {
  const classes = useStyles();
  const {
    init,
    selectedAccount,
    isInitialized,
    getCooldownContract,
    cooldownContractMinutes,
    hasCooldownContract,
  } = useContext(MetamaskContext);
  const [isLoading, setIsLoading] = useState(false);

  const signInAccount = async () => {
    await init();
    setIsLoading(true);
  };

  useEffect(() => {
    if (!selectedAccount && !isInitialized) {
      return setIsLoading(false);
    }
  }, [selectedAccount, isInitialized]);

  useEffect(() => {
    if (selectedAccount && isInitialized) {
      return getCooldownContract();
    }
  }, [selectedAccount, isInitialized]);

  return (
    <Container maxWidth="sm">
      <Grid
        container
        className={classes.gridContainer}
        padding={2}
        marginY={4}
        justifyContent="center"
        alignItems="center">
        {!selectedAccount && (
          <Grid item>
            <LoadingButton
              variant="contained"
              onClick={signInAccount}
              loading={isLoading}>
              Sign in
            </LoadingButton>
          </Grid>
        )}
        {selectedAccount && !hasCooldownContract && (
          <Grid item>
            <CircularProgress
              onClick={() => {
                Router.push('/quiz');
              }}
            />
          </Grid>
        )}
        {selectedAccount && hasCooldownContract && cooldownContractMinutes && (
          <Grid item>
            <Typography variant="h6">
              You must wait {cooldownContractMinutes} minutes to complete the
              survey again
            </Typography>
          </Grid>
        )}
        {selectedAccount && hasCooldownContract && !cooldownContractMinutes && (
          <>
            <Grid item xs={7}>
              <Typography variant="h6">{QUIZ.title}</Typography>
            </Grid>
            <Grid item xs={5} textAlign="end">
              <Button
                variant="contained"
                onClick={() => {
                  Router.push('/quiz');
                }}>
                Start Quiz
              </Button>
            </Grid>
            <Grid item xs={12}>
              <img className={classes.image} src={QUIZ.image} />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default withDefaultLayout(Home);
