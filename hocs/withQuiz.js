import { QuizProvider } from './../store/quiz';

const withQuiz = (Component) => (props) => {
  return (
    <QuizProvider>
      <Component {...props} />
    </QuizProvider>
  );
};

export default withQuiz;
