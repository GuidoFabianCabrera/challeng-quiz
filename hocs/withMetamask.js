import { MetamaskProvider } from './../store/metamask';

const withQuiz = (Component) => (props) => {
  return (
    <MetamaskProvider>
      <Component {...props} />
    </MetamaskProvider>
  );
};

export default withQuiz;
