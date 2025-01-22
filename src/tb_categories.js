import withAuth from '@/lib/middleware/withAuth';
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
import moment from 'moment'; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formType, setFormType] = useState('create'); // 'create', 'update', 'delete'

  useEffect(() => {
    // Fetch data kategori dari API
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        console.log('Fetched categories:', data); // Debugging data
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      // Cek apakah DataTable sudah terinisialisasi
      if ($.fn.dataTable.isDataTable('#categoriesTable')) {
        // Jika sudah terinisialisasi, destroy dan inisialisasi ulang
        $('#categoriesTable').DataTable().destroy(true);
      }
      // Inisialisasi DataTable
      $('#categoriesTable').DataTable();
    }

    return () => {
      if ($.fn.dataTable.isDataTable('#categoriesTable')) {
        $('#categoriesTable').DataTable().destroy(true);
      }
    };
  }, [categories]);

  // Fungsi untuk membuka modal dan mengatur form type
  const openModal = (type, category = null) => {
    setFormType(type);
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory({ id_kategori: '', nama_kategori: '' });
    }
  };

  // Fungsi untuk menangani form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { id_kategori, nama_kategori } = selectedCategory;
    
    let url = '/api/admin/categories/create';
    let method = 'POST'; 

    if (formType === 'update') {
      url = `/api/admin/categories/${id_kategori}`;
      method = 'PUT';
    } else if (formType === 'delete') {
      url = `/api/admin/categories/${id_kategori}`;
      method = 'DELETE';
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: formType !== 'delete' ? JSON.stringify({ nama_kategori }) : null,
      });
      if (response.ok) {
        fetchCategories(); // Refresh data setelah submita
      } else {
        console.error('Failed to submit:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <h4 className="page-title">Categories</h4>
        {/* Button to open Create modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#categoryModal"
          onClick={() => openModal('create')}
        >
          Create Category
        </button>

        {/* Tabel kategori */}
        <div className="card p-3">
          <div className="row">
            <div className="col-md-12">
              <table id="categoriesTable" className="display">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>No</th>
                    <th style={{ textAlign: 'left' }}>ID Kategori</th>
                    <th style={{ textAlign: 'left' }}>Nama Kategori</th>
                    <th style={{ textAlign: 'left' }}>Created At</th>
                    <th style={{ textAlign: 'left' }}>Updated At</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id_kategori}>
                      <td style={{ textAlign: 'left' }}>{index + 1}</td>
                      <td style={{ textAlign: 'left' }}>{category.id_kategori}</td>
                      <td style={{ textAlign: 'left' }}>{category.nama_kategori}</td>
                      <td style={{ textAlign: 'left' }}>
                        {category.createdAt ? moment(category.createdAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        {category.updatedAt ? moment(category.updatedAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {/* Update and Delete buttons */}
                        <button
                          className="btn btn-warning btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#categoryModal"
                          onClick={() => openModal('update', category)}
                        >
                          <FaEdit/>
                        </button>
                        <button
                          className="btn btn-danger btn-sm ml-5"
                          data-bs-toggle="modal"
                          data-bs-target="#categoryModal"
                          onClick={() => openModal('delete', category)}
                        >
                          <FaTrashAlt/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal untuk Create, Update, Delete */}
        <div className="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="categoryModalLabel">
                  {formType === 'create' ? 'Create Category' : formType === 'update' ? 'Update Category' : 'Delete Category'}
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {formType !== 'delete' ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>ID Kategori</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedCategory?.id_kategori}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Nama Kategori</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedCategory?.nama_kategori}
                        onChange={(e) =>
                          setSelectedCategory({ ...selectedCategory, nama_kategori: e.target.value })
                        }
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      {formType === 'create' ? 'Create' : 'Update'}
                    </button>
                  </form>
                ) : (
                  <p>Are you sure you want to delete this category?</p>
                )}
              </div>
              <div className="modal-footer">        
                {formType === 'delete' ? (
                  <button type="button" className="btn btn-danger" onClick={handleSubmit}>
                    Delete
                  </button>
                ) : (
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminCategories);
