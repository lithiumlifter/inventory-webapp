import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import TableComponent from '../../components/TabelComponent';
import ModalComponent from '../../components/ModalComponent';
import AlertMessage from '../../components/AlertMessageComponent'; 

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalShow, setModalShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id_kategori: '', nama_kategori: '' });
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // State for success message and alert
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
      setFilteredCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // Filter categories
  useEffect(() => {
    if (search === '') {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(categories.filter(category =>
        category.nama_kategori.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, categories]);

  // Handle Edit
  const handleEdit = (category) => {
    setIsEdit(true);
    setCurrentCategory(category);
    setModalShow(true);
  };

  // Handle Delete
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
        setCategories(categories.filter(cat => cat.id_kategori !== categoryToDelete.id_kategori));
        setFilteredCategories(filteredCategories.filter(cat => cat.id_kategori !== categoryToDelete.id_kategori));
        setDeleteModalShow(false);
        setAlertMessage('Category deleted successfully!');
        setAlertType('success');
      } else {
        setAlertMessage('Failed to delete category');
        setAlertType('danger');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlertMessage('Error occurred while deleting category');
      setAlertType('danger');
    }
  };

  // Handle Save (Create or Edit)
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
        const updatedCategories = await fetch('/api/admin/categories').then(res => res.json());
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories);
        setModalShow(false);
        setAlertMessage(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
        setAlertType('success');
      } else {
        setAlertMessage('Failed to save category');
        setAlertType('danger');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setAlertMessage('Error occurred while saving category');
      setAlertType('danger');
    }
  };

  const categoryFields = [
    { name: 'nama_kategori', label: 'Category Name', value: currentCategory.nama_kategori },
  ];

  return (
    <div className="content">
      <AlertMessage message={alertMessage} type={alertType} onClose={() => setAlertMessage('')} />

      <TableComponent
        columns={[
          { name: 'ID Kategori', selector: row => row.id_kategori, sortable: true },
          { name: 'Nama Kategori', selector: row => row.nama_kategori, sortable: true },
          { name: 'Created At', selector: row => new Date(row.createdAt).toLocaleString(), sortable: true },
          { name: 'Updated At', selector: row => new Date(row.updatedAt).toLocaleString(), sortable: true },
          {
            name: 'Action',
            cell: row => (
              <div>
                <Button variant="primary" onClick={() => handleEdit(row)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDelete(row)} className="ml-2"><FaTrashAlt /></Button>
              </div>
            ),
          },
        ]}
        data={filteredCategories}
        loading={loading}
        onCreate={() => { setIsEdit(false); setCurrentCategory({ id_kategori: '', nama_kategori: '' }); setModalShow(true); }}
      />
      
      <ModalComponent
        show={modalShow}
        onHide={() => setModalShow(false)}
        onSave={handleSave}
        title={isEdit ? 'Edit Category' : 'Create Category'}
        fields={categoryFields}
        onChange={(field, value) => setCurrentCategory({ ...currentCategory, [field]: value })}
        isEdit={isEdit}
      />

      <ModalComponent
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onSave={handleSave}
        title="Confirm Delete"
        isDeleteModal={true}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default AdminCategories;
