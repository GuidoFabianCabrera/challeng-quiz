import { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import { MetamaskContext } from './../store/metamask';

import { CHAIND_ID } from './../data';

const useStyles = makeStyles((theme) => ({
  text: { color: 'white' },
}));

const withDialogChainId = (Component) => {
  const DialogChainId = (props) => {
    const classes = useStyles();
    const { isInitialized, isWrongChaingId } = useContext(MetamaskContext);

    const [isModal, setIsModal] = useState(true);

    const handleOpen = () => setIsModal(true);
    const handleClose = () => setIsModal(false);

    useEffect(() => {
      if (isWrongChaingId && isInitialized) {
        handleOpen();
      } else {
        handleClose();
      }
    }, [isWrongChaingId]);

    const changeChain = async () => {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIND_ID }],
      });
    };

    return (
      <>
        <Dialog
          open={isModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundColor: '#101b35ee',
              color: 'white',
            },
          }}>
          <DialogTitle id="alert-dialog-title">{'Wrong network'}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className={classes.text}>
              You must change the network to continue
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={changeChain}>
              Change network
            </Button>
          </DialogActions>
        </Dialog>
        <Component {...props} />
      </>
    );
  };

  return DialogChainId;
};

export default withDialogChainId;
