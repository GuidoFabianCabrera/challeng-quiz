import { createContext, useState } from 'react';
import Web3 from 'web3';
import { ABI, QUIZ_ADDRESS, CHAIND_ID } from './../data';

const MetamaskContext = createContext();

const MetamaskProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState('');

  const [isWrongChaingId, setIsWrongChaingId] = useState();

  const [isInitialized, setIsInitialized] = useState(false);

  const [quizContract, setQuizContract] = useState({});

  const [balance, setBalance] = useState(0);

  const [hasCooldownContract, setHasCooldownContract] = useState(false);

  const [cooldownContractMinutes, setCooldownContractMinutes] =
    useState(undefined);

  const init = async () => {
    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setSelectedAccount(accounts[0]);
        })
        .catch((err) => {
          setIsInitialized(false);
          return console.log(err);
        });

      if (CHAIND_ID == window.ethereum.chainId) {
        setIsWrongChaingId(false);
      } else {
        setIsWrongChaingId(true);
      }

      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== CHAIND_ID) {
          return setIsWrongChaingId(true);
        }
        setIsWrongChaingId(false);
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (!accounts.length) {
          setSelectedAccount('');
          return setIsInitialized(false);
        }
        setHasCooldownContract(false);
        setSelectedAccount(accounts[0]);
      });
    }

    const web3 = new Web3(provider);

    setQuizContract(new web3.eth.Contract(ABI, QUIZ_ADDRESS));

    setIsInitialized(true);
  };

  const getOwnBalance = async () => {
    try {
      if (selectedAccount == '') {
        return setBalance(0);
      }

      const decimals = await quizContract.methods.decimals().call();
      const response = await quizContract.methods
        .balanceOf(selectedAccount)
        .call();
      setBalance(response / 10 ** decimals);
    } catch (error) {
      console.log('error', error);
    }
  };

  const mintToken = async (quizAnswers) => {
    try {
      if (!isInitialized) {
        await init();
      }

      await quizContract.methods
        .submit(1, quizAnswers)
        .send({ from: selectedAccount });

      getOwnBalance();
    } catch (error) {
      console.log('error', error);
    }
  };

  const getCooldownContract = async () => {
    try {
      const lastSubmittal = await quizContract.methods
        .lastSubmittal(selectedAccount)
        .call();

      const cooldownSeconds = await quizContract.methods
        .cooldownSeconds()
        .call();

      const submitAvailableTime = new Date(
        (parseInt(lastSubmittal) + parseInt(cooldownSeconds)) * 1000
      ).getTime();

      const currentTime = new Date().getTime();
      const time = submitAvailableTime - currentTime;

      if (time > 0) {
        setCooldownContractMinutes(Math.floor(time / 1000 / 60));
      } else {
        setCooldownContractMinutes(undefined);
      }
      setHasCooldownContract(true);
    } catch (error) {
      console.log('error', error);
      setHasCooldownContract(false);
    }
  };

  return (
    <MetamaskContext.Provider
      value={{
        init,
        mintToken,
        getOwnBalance,
        selectedAccount,
        quizContract,
        isInitialized,
        balance,
        isWrongChaingId,
        cooldownContractMinutes,
        setCooldownContractMinutes,
        hasCooldownContract,
        getCooldownContract,
      }}>
      {children}
    </MetamaskContext.Provider>
  );
};

export { MetamaskProvider, MetamaskContext };
