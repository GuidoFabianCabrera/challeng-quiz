import { useContext, useEffect } from 'react';
import { QuizContext } from '../store/quiz';
import { makeStyles } from '@mui/styles';

import {
  Container,
  Grid,
  LinearProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Button,
  Typography,
} from '@mui/material';

import withDefaultLayout from './../hocs/withDefaultLayout';
import { QUIZ } from './../data';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    background: '#0002',
    borderRadius: '15px',
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
  },
}));

const Quiz = () => {
  const classes = useStyles();
  const {
    questionIndex,
    optionSelected,
    timer,
    handleChange,
    resetQuiz,
    handleChangeQuestion,
    setTimer,
    setTimerInterval,
    timerInterval,
  } = useContext(QuizContext);

  useEffect(() => {
    resetQuiz();
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    setTimerInterval(interval);
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (timer !== -1) {
      return;
    }
    handleChangeQuestion();
  }, [timer]);

  return (
    <Container maxWidth="sm">
      <Grid
        container
        className={classes.gridContainer}
        padding={2}
        marginY={4}
        spacing={1}
        alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h6">{QUIZ.title}</Typography>
        </Grid>
        <Grid item xs={6} textAlign="end">
          <Typography variant="h6">
            Question {questionIndex + 1} of {QUIZ.questions.length}
          </Typography>
        </Grid>
        <Grid item xs={12} paddingBottom={2}>
          <LinearProgress
            variant="determinate"
            value={((questionIndex + 1) / QUIZ.questions.length) * 100}
          />
        </Grid>
        <Grid item xs={12}>
          <Box width="100%">
            <img
              className={classes.image}
              src={QUIZ.questions[questionIndex].image}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">
            {QUIZ.questions[questionIndex].text}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="end">
          <Typography variant="h6">Timer : {timer ? timer : '--'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <ToggleButtonGroup
            orientation="vertical"
            value={optionSelected.option}
            exclusive
            onChange={handleChange}
            fullWidth>
            {QUIZ.questions[questionIndex].options.map((item, index) => (
              <ToggleButton
                value={index}
                aria-label={item.text}
                key={item.text}
                sx={{
                  justifyContent: 'flex-start',
                  gap: '15px',
                  paddingLeft: '15px',
                }}>
                {index}
                <Divider orientation="vertical" flexItem />
                {item.text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} textAlign="end" marginTop={2}>
          <Button variant="contained" onClick={handleChangeQuestion}>
            {questionIndex + 1 >= QUIZ.questions.length ? 'Finish' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withDefaultLayout(Quiz);
