import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const ModalComponent = ({
  show,
  onHide,
  onSave,
  title,
  fields,
  onChange,
  isEdit,
  onDelete,
  confirmDelete,
  isDeleteModal,
  currentProduct
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (currentProduct && !isEdit && currentProduct.foto_produk) {
      // Hanya tampilkan log jika dalam mode create
      console.log("Current Product foto_produk:", currentProduct.foto_produk);
      setExistingImages([]);
    }

    if (isEdit && currentProduct && currentProduct.foto_produk) {
      console.log("Current Product foto_produk:", currentProduct.foto_produk);
      if (Array.isArray(currentProduct.foto_produk)) {
        setExistingImages(currentProduct.foto_produk);
      } else if (typeof currentProduct.foto_produk === 'string') {
        try {
          const photos = JSON.parse(currentProduct.foto_produk);
          setExistingImages(photos);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setExistingImages([]);
        }
      } else {
        console.error("foto_produk is not a valid type:", currentProduct.foto_produk);
        setExistingImages([]);
      }
    } 
  }, [isEdit, currentProduct]);

  const handleClose = () => {
    setSelectedImages([]);
    setExistingImages([]);
    onHide();
  };

  const handleDrop = (acceptedFiles) => {
    console.log("Accepted Files:", acceptedFiles);
    // Jika mode edit, gabungkan foto baru dengan foto lama
    if (isEdit) {
      setSelectedImages((prevImages) => [...prevImages, ...acceptedFiles]);
      onChange('foto_produk', [...existingImages, ...acceptedFiles]); // Gabungkan foto lama dan baru
    } else {
      // Jika mode create, cukup tambahkan foto baru
      // const newImages = acceptedFiles.map((file) => URL.createObjectURL(file));
      // setSelectedImages(newImages); // Simpan foto baru yang diupload
      // onChange('foto_produk', newImages); // Kirimkan hanya foto baru

      // Menggabungkan gambar yang ada dengan gambar baru
      const newImages = acceptedFiles.map(file => (file));
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
      onChange('foto_produk', [...selectedImages, ...newImages]);
    }
  };

  // React Dropzone hook to handle file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: handleDrop
    // onDrop: (acceptedFiles) => {
    //   // Menggabungkan gambar yang ada dengan gambar baru
    //   const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
    //   setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    //   onChange('foto_produk', [...existingImages, ...newImages]); // Update onChange dengan gambar yang sudah diperbarui
    // },
    // onDrop: (acceptedFiles) => {
    //   console.log("Accepted Files:", acceptedFiles);  
    //   setSelectedImages((prevImages) => [...prevImages, ...acceptedFiles]);
    //   onChange('foto_produk', [...existingImages, ...selectedImages, ...acceptedFiles]);
    // },
  });

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedImages);
      onChange('foto_produk', updatedImages);
    } else {
      setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const renderImagesPreview = () => {
    if (isEdit) {
      // Untuk mode edit, tampilkan gambar yang sudah ada
      return existingImages.map((photo, index) => (
        <div key={index} className="image-preview" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
          <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt={`Existing Image ${index}`} width="100" height="100" />
          <button
            type="button"
            onClick={() => handleRemoveImage(index, true)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '5px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      ));
    } else {
      // Untuk mode create, tampilkan gambar yang baru dipilih
      return selectedImages.map((file, index) => (
        <div key={index} className="image-preview" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
          <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} width="100" height="100" />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '5px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      ));
    }
  };
  

  const renderExistingImages = () => {
    console.log('selectedImages:', selectedImages); 
    return existingImages.map((photo, index) => (
      <div key={index} className="image-preview" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
        <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt={`Existing Image ${index}`} width="100" height="100" />
        <button
          type="button"
          onClick={() => handleRemoveImage(index, true)}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            padding: '5px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
    ));
  };
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isDeleteModal ? (
          <p>Are you sure you want to delete this item?</p>
        ) : (
          fields.map((field, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={field.name}>{field.label}</label>

              {field.type === 'select' ? (
                <select
                  id={field.name}
                  className="form-control"
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'file' ? (
                <>
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>Drag and drop some images here, or click to select images</p>
                  </div>
                  <div className="mt-2">
                    {isEdit ? renderExistingImages() : renderImagesPreview() }
                  </div>
                </>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  id={field.name}
                  className="form-control"
                  value={field.value ?? 0}
                  onChange={(e) => onChange(field.name, parseInt(e.target.value))}
                />
              ) : (
                <input
                  type="text"
                  id={field.name}
                  className="form-control"
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        {isDeleteModal ? (
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        ) : (
          <Button variant="primary" onClick={onSave}>Save</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;