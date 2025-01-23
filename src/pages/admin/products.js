import withAuth from '@/lib/middleware/withAuth';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import TableComponent from '../../components/TabelComponent';
import ModalComponent from '../../components/ModalComponent';
import AlertMessage from '../../components/AlertMessageComponent'; 

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  // Fetch data produk
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAlertMessage('Failed to fetch products');
        setAlertType('danger');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch data categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setAlertMessage('Failed to fetch categories');
        setAlertType('danger');
      }
    };

    fetchCategories();
  }, []);

  const productColumns = [
    { name: 'ID Produk', selector: row => row.id_produk, sortable: true },
    { name: 'Nama Produk', selector: row => row.nama_produk, sortable: true },
    { name: 'Kode Produk', selector: row => row.kode_produk, sortable: true },
    { name: 'Foto Produk', 
      selector: row => <img src={`/images/products/${row.foto_produk}`} alt={row.nama_produk} width="50" />, 
      sortable: true 
    },
    { name: 'Tanggal Register', 
      selector: row => new Date(row.tgl_register).toLocaleString(), 
      sortable: true 
    },
    { name: 'Kategori', 
      selector: row => row.kategori?.nama_kategori || 'Uncategorized', 
      sortable: true 
    },
    { name: 'Jumlah Barang', 
      selector: row => row.stok?.jumlah_barang || 'N/A', 
      sortable: true 
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <Button variant="primary" onClick={() => handleEdit(row)}><FaEdit /></Button>
          <Button variant="danger" onClick={() => handleDelete(row)} className="ml-2"><FaTrashAlt /></Button>
        </div>
      ),
    },
  ];

  const handleEdit = (product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    setModalShow(true);
  };

  const handleDelete = (product) => {
    setDeleteModalShow(true);
    setCurrentProduct(product);
  };

  const handleSave = async () => {
    console.log("CEK ISI:",currentProduct);
    try {
      const payload = {
        nama_produk: currentProduct.nama_produk,
        kode_produk: currentProduct.kode_produk,
        id_kategori: currentProduct.id_kategori,
        jumlah_barang: currentProduct.jumlah_barang,
      };
  
      console.log('Payload:', payload);
  
      const response = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('Response:', data);
  
      if (response.ok) {
        setAlertMessage('Product created successfully');
        setAlertType('success');
        setModalShow(false);
        setProducts([...products, data]);
      } else {
        setAlertMessage(data.message || 'Failed to create product');
        setAlertType('danger');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setAlertMessage('Failed to save product');
      setAlertType('danger');
    }
  };
  
  const confirmDelete = () => {
    setDeleteModalShow(false);
  };

  const productFields = [
    { name: 'nama_produk', label: 'Product Name', value: currentProduct.nama_produk || '', type: 'text' },
    { name: 'kode_produk', label: 'Product Code', value: currentProduct.kode_produk || '', type: 'text' },
    { name: 'foto_produk', label: 'Product Image', value: currentProduct.foto_produk || '', type: 'file' },
    { 
      name: 'id_kategori', 
      label: 'Category', 
      value: currentProduct.kategori?.id_kategori || '',
      type: 'select', 
      options: categories.map(category => ({ value: category.id_kategori, label: category.nama_kategori })) 
    },
    { 
      name: 'jumlah_barang', 
      label: 'Stock Quantity', 
      value: currentProduct.stok?.jumlah_barang || "",
      type: 'number'
    },
  ];
  

  return (
    <div className="content">
      <AlertMessage message={alertMessage} type={alertType} onClose={() => setAlertMessage('')} />

      <TableComponent
        columns={productColumns}
        data={products.filter(product => product.nama_produk.includes(search))}
        loading={loading}
        onCreate={() => { setIsEdit(false); setCurrentProduct({ id_produk: '', nama_produk: '' }); setModalShow(true); }}
        onSearch={(value) => setSearch(value)}
      />

      <ModalComponent
        show={modalShow}
        onHide={() => setModalShow(false)}
        onSave={handleSave}
        title={isEdit ? 'Edit Product' : 'Create Product'}
        fields={productFields.map(field => ({
          ...field,
          value: currentProduct[field.name] ?? field.value,
        }))}
        onChange={(field, value) => {
          console.log(`Field: ${field}, Value: ${value}`);
          setCurrentProduct(prevState => ({
            ...prevState,
            [field]: value
          }));
        }}
        isEdit={isEdit}
      />

      <ModalComponent
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onSave={confirmDelete}
        title="Confirm Delete"
        isDeleteModal={true}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default withAuth(AdminProducts);
