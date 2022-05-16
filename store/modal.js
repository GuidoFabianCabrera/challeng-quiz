import React, { createContext, useState } from 'react';

const ModalContext = createContext();

function ModalProvider() {
  const [isModal, setIsModal] = useState(false);

  const handleOpen = () => setIsModal(true);
  const handleClose = () => setIsModal(false);

  return (
    <ModalContext.Provider
      value={{ isModal, setIsModal, handleOpen, handleClose }}>
      {children}
    </ModalContext.Provider>
  );
}

export { ModalProvider, ModalContext };
