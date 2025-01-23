import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageModal = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <img
        src={image}
        alt="Thumbnail"
        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
        onClick={openModal}
      />

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            width: '50%',
            height: '50%',
            maxWidth: '1000px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          },
        }}
      >
        <img
          src={image}
          alt="Large"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
        <button
          onClick={closeModal}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </Modal>
    </>
  );
};

export default ImageModal;
