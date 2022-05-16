import React, { useState, useContext, useEffect } from 'react';
import Router from 'next/router';
import { QuizContext } from '../store/quiz';
import { MetamaskContext } from '../store/metamask';

import { makeStyles } from '@mui/styles';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  CircularProgress,
  Typography,
  Button,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';

import withDefaultLayout from './../hocs/withDefaultLayout';
import { QUIZ } from './../data';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    background: '#00000022',
    borderRadius: '15px',
  },
  accordion: {
    backgroundColor: 'transparent',
  },
}));

const Resume = () => {
  const classes = useStyles();
  const { answers } = useContext(QuizContext);
  const { mintToken } = useContext(MetamaskContext);
  const [isLoading, setIsLoading] = useState(false);

  const submitQuiz = () => {
    setIsLoading(true);
    mintToken(answers.map((item) => item.option))
      .then(() => {
        setIsLoading(false);
        Router.push('/');
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <Container maxWidth="sm">
      <Grid
        container
        className={classes.gridContainer}
        padding={2}
        marginY={4}
        alignItems="center"
        justifyContent="center"
        spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Answers</Typography>
        </Grid>
        {answers.length == 0 && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
        {answers.length !== 0 && (
          <>
            <Grid item xs={12}>
              {QUIZ.questions.map((item, index) => (
                <Accordion
                  className={classes.accordion}
                  key={item.text}
                  defaultExpanded={true}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <div>{item.text}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {item.options.map((optionData, optionIndex) => (
                      <Typography
                        sx={{
                          color:
                            optionIndex == answers[index].option ? 'green' : '',
                        }}
                        key={optionData.text}>
                        {optionData.text}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Button
                onClick={() => {
                  Router.push('/quiz');
                }}>
                Restart
              </Button>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <LoadingButton
                variant="contained"
                onClick={() => {
                  submitQuiz();
                }}
                loading={isLoading}>
                Send
              </LoadingButton>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default withDefaultLayout(Resume);
