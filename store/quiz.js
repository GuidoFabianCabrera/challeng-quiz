import Router from 'next/router';
import { createContext, useState, useEffect } from 'react';
import { QUIZ } from './../data';

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [optionSelected, setOptionSelected] = useState({
    index: questionIndex,
    option: '999999',
  });

  const [timer, setTimer] = useState(
    QUIZ.questions[questionIndex].lifetimeSeconds
  );

  const [timerInterval, setTimerInterval] = useState(null);

  const handleChange = (event) => {
    const option =
      event.target.value == null ? '999999' : parseInt(event.target.value);

    setOptionSelected({ index: questionIndex, option });
  };

  const resetTimer = () => {
    setTimer(QUIZ.questions[questionIndex + 1].lifetimeSeconds);
  };

  const handleChangeQuestion = (e) => {
    const valores = [...answers, optionSelected];

    if (questionIndex + 1 < QUIZ.questions.length) {
      setAnswers(valores);
      setOptionSelected({ index: questionIndex + 1, option: '999999' });
      resetTimer();
    }

    if (questionIndex + 1 >= QUIZ.questions.length) {
      setAnswers(valores);
      Router.push('/resume');
      return;
    }

    return setQuestionIndex(questionIndex + 1);
  };

  const resetQuiz = (e) => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setAnswers([]);
    setQuestionIndex(0);
    setTimer(QUIZ.questions[questionIndex].lifetimeSeconds);
  };

  return (
    <QuizContext.Provider
      value={{
        answers,
        setAnswers,
        questionIndex,
        setQuestionIndex,
        optionSelected,
        setOptionSelected,
        timer,
        setTimer,
        timerInterval,
        setTimerInterval,
        handleChange,
        resetTimer,
        handleChangeQuestion,
        resetQuiz,
      }}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizProvider, QuizContext };
