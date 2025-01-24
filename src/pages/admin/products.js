import withAuth from '@/lib/middleware/withAuth';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import TableComponent from '../../components/TabelComponent';
import ModalComponent from '../../components/ModalComponent';
import AlertMessage from '../../components/AlertMessageComponent'; 
import ImageModal from '../../components/ImageModalComponent'; 

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

  // Inisiasi Tabel
  const productColumns = [
    { name: 'ID Produk', selector: row => row.id_produk, sortable: true },
    { name: 'Nama Produk', selector: row => row.nama_produk, sortable: true },
    { name: 'Kode Produk', selector: row => row.kode_produk, sortable: true },
    {
      name: 'Foto Produk',
      selector: row => {
        let photos = [];
  
        if (row.foto_produk) {
          try {
            photos = JSON.parse(row.foto_produk);
          } catch (error) {
            console.error('Failed to parse foto_produk:', error);
          }
        }
  
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', }}>
            {photos.map((photo, index) => (
              <ImageModal key={index} image={photo} />
            ))}
          </div>
        );
      },
      sortable: false,
    },
    {
      name: 'Tanggal Register',
      selector: row => new Date(row.tgl_register).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Kategori',
      selector: row => row.kategori?.nama_kategori || 'Uncategorized',
      sortable: true,
    },
    {
      name: 'Jumlah Barang',
      selector: row => row.stok?.jumlah_barang || 'N/A',
      sortable: true,
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
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
  
    const isUpdate = !!currentProduct.id_produk;
    const endpoint = isUpdate 
      ? `/api/admin/products/update/${currentProduct.id_produk}`
      : '/api/admin/products/create';

  
    const method = isUpdate ? 'PUT' : 'POST';

    console.log('Endpoint yang dipanggil:', endpoint); 
    console.log('Metode yang digunakan:', method);
  
    const base64Images = [];
  
    // Konversi foto_produk ke base64 atau langsung gunakan jika string
    for (let file of currentProduct.foto_produk) {
      if (typeof file === 'string') {
        base64Images.push(file);
      } else {
        const base64 = await convertFileToBase64(file);
        base64Images.push(base64);
      }
    }
  
    const productData = {
      nama_produk: currentProduct.nama_produk,
      kode_produk: currentProduct.kode_produk,
      id_kategori: currentProduct.id_kategori,
      jumlah_barang: currentProduct.jumlah_barang,
      foto_produk: base64Images,
    };
  
    console.log("Product Data to Send:", productData);
  
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
  
      const data = await response.json();
      if (response.ok) {
        setAlertMessage(isUpdate ? 'Product updated successfully' : 'Product created successfully');
        setAlertType('success');
        setModalShow(false);
  
        if (isUpdate) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === currentProduct.id ? data.product : product
            )
          );
        } else {
          setProducts([...products, data.product]);
        }
      } else {
        setAlertMessage(data.message || 'Failed to save product');
        setAlertType('danger');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setAlertMessage('Failed to save product');
      setAlertType('danger');
    }
  };
  
  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/products/delete/${currentProduct.id_produk}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setAlertMessage('Product deleted successfully');
        setAlertType('success');
        setProducts(products.filter(product => product.id_produk !== currentProduct.id_produk));
      } else {
        const data = await response.json();
        setAlertMessage(data.message || 'Failed to delete product');
        setAlertType('danger');
      }
  
      setDeleteModalShow(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlertMessage('Failed to delete product');
      setAlertType('danger');
      setDeleteModalShow(false);
    }
  };
  

  const productFields = [
    { name: 'nama_produk', label: 'Product Name', value: currentProduct.nama_produk || '', type: 'text' },
    { name: 'kode_produk', label: 'Product Code', value: currentProduct.kode_produk || '', type: 'text' },
    { 
      name: 'foto_produk', 
      label: 'Product Images', 
      value: currentProduct.foto_produk || '', 
      type: 'file', 
      multiple: true
    },
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
      <h4 className="page-title">Produk</h4>

      <AlertMessage message={alertMessage} type={alertType} onClose={() => setAlertMessage('')} />

      <TableComponent
        columns={productColumns}
        data={products.filter(product => product.nama_produk.includes(search))}
        loading={loading}
        onCreate={() => { setIsEdit(false); setCurrentProduct({ id_produk: '', nama_produk: '' }); setModalShow(true); }}
        onSearch={(value) => setSearch(value)}
        showCreateButton={true}
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
          if (field === 'foto_produk') {
            setCurrentProduct(prevState => ({
              ...prevState,
              [field]: value
            }));
          } else {
            setCurrentProduct(prevState => ({
              ...prevState,
              [field]: value
            }));
          }
        }}
        isEdit={isEdit}
        currentProduct={currentProduct}
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
