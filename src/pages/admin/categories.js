import withAuth from '@/lib/middleware/withAuth';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const AdminCategories = () => {
  // State for categories and search
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for modal and form data
  const [modalShow, setModalShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id_kategori: '', nama_kategori: '' });

  // State for delete confirmation modal
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // State for success message and popup
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        console.log('Categories:', data); 
        setCategories(data);
        setFilteredCategories(data); // Set initial data to filtered categories
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on search input
  useEffect(() => {
    if (search === '') {
      setFilteredCategories(categories);
    } else {
      const filteredData = categories.filter(category =>
        category.nama_kategori.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filteredData);
    }
  }, [search, categories]);

  // Columns configuration for the data table
  const columns = [
    {
      name: 'ID Kategori',
      selector: row => row.id_kategori,
      sortable: true,
    },
    {
      name: 'Nama Kategori',
      selector: row => row.nama_kategori,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Updated At',
      selector: row => new Date(row.updatedAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div>
          {/* Edit and Delete buttons */}
          <Button variant="primary" onClick={() => handleEdit(row)}><FaEdit /></Button>
          <Button variant="danger" onClick={() => handleDelete(row)} className="ml-2"><FaTrashAlt /></Button>
        </div>
      ),
    },
  ];

  // Handle Edit functionality
  const handleEdit = (category) => {
    setIsEdit(true);
    setCurrentCategory(category);
    setModalShow(true);
  };

  // Handle Delete functionality
  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalShow(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/categories/delete/${categoryToDelete.id_kategori}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload categories after delete
        setCategories(categories.filter(cat => cat.id_kategori !== categoryToDelete.id_kategori));
        setFilteredCategories(filteredCategories.filter(cat => cat.id_kategori !== categoryToDelete.id_kategori));
        setDeleteModalShow(false);

        // Show success popup
        setSuccessMessage('Category deleted successfully!');
        setShowSuccessModal(true);
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Handle Create New Category
  const handleCreate = () => {
    setIsEdit(false);
    setCurrentCategory({ id_kategori: '', nama_kategori: '' });
    setModalShow(true);
  };

  // Save Category (Create or Edit)
  const handleSave = async () => {
    const url = isEdit ? `/api/admin/categories/update/${currentCategory.id_kategori}` : '/api/admin/categories/create';
    const method = isEdit ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCategory),
      });
  
      if (response.ok) {
        // Reload categories after save
        const updatedCategories = await fetch('/api/admin/categories').then(res => res.json()); // Ambil data terbaru
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories); // Pastikan untuk memperbarui data yang difilter juga
        setModalShow(false);
  
        // Show success popup
        setSuccessMessage(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
        setShowSuccessModal(true);
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };
  

  return (
    <div className="content">
      <div className="container-fluid">
        <h4 className="page-title">Categories</h4>
        <div className="row">
          {/* Data Table */}
          <div className="col-md-12">
            <div className="table-responsive" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
              <DataTable
                columns={columns}
                data={filteredCategories}
                progressPending={loading}
                pagination
                subHeader
                subHeaderComponent={
                  <div className="d-flex justify-content-between align-items-center w-100 mt-4">
                    <h5>List of Categories</h5>
                    <input
                      type="text"
                      placeholder="Search categories"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="form-control w-25"
                    />
                    <Button variant="success" onClick={handleCreate}>Create New Category</Button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit Category */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Category' : 'Create Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="category-name">Category Name</label>
            <input
              type="text"
              id="category-name"
              className="form-control"
              value={currentCategory.nama_kategori}
              onChange={(e) => setCurrentCategory({ ...currentCategory, nama_kategori: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default withAuth(AdminCategories);
