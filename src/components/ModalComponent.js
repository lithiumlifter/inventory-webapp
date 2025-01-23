import React from 'react';
import { Modal, Button } from 'react-bootstrap';

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
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isDeleteModal ? (
          <>
            <p>Are you sure you want to delete this item?</p>
          </>
        ) : (
          fields.map((field, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={field.name}>{field.label}</label>

              {/* Custom rendering based on input type */}
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
                <input
                  type="file"
                  id={field.name}
                  className="form-control"
                  onChange={(e) => onChange(field.name, e.target.files[0])}
                />
              ) : field.type === 'number' ? (
                <>
                  <input
                    type="number"
                    id={field.name}
                    className="form-control"
                    value={field.value ?? 0}
                    onChange={(e) => onChange(field.name, parseInt(e.target.value))}
                  />
                </>
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
