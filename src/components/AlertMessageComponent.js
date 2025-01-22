import React from 'react';
import { Alert } from 'react-bootstrap';

const AlertMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <Alert variant={type} onClose={onClose} dismissible className="mb-4">
      {message}
    </Alert>
  );
};

export default AlertMessage;
