import React from 'react';
import styles from '../../../styles/components/Modal/Modal.module.scss';

interface ModalProps {
    message: string;
    type: 'success' | 'error' | 'confirm';
    onClose: () => void;
    onConfirm?: () => void;
  }
  
  const Modal: React.FC<ModalProps> = ({ message, type, onClose, onConfirm }) => {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={`${styles.modal} ${styles[type]}`} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          <p>{message}</p>
          {type === 'confirm' && (
            <div className={styles.buttonGroup}>
              <button className={styles.confirmButton} onClick={onConfirm}>Confirm</button>
              <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Modal;