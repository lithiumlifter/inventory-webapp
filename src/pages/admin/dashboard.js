import { FaBox, FaTag, FaDolly, FaUsers } from 'react-icons/fa'; // Import ikon yang dibutuhkan dari react-icons
import withAuth from '@/lib/middleware/withAuth';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import komponen yang dibutuhkan
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [dataProduk, setDataProduk] = useState([]);
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [totalStok, setTotalStok] = useState(0);
  const [stokRendah, setStokRendah] = useState([]);
  const [stokPerKategori, setStokPerKategori] = useState({});
  const [totalUser, setTotalUser] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setDataProduk(data);
      setTotalProduk(data.length);
      setTotalKategori(new Set(data.map((item) => item.kategori.nama_kategori)).size);
      setTotalStok(data.reduce((sum, item) => sum + (item.stok?.jumlah_barang || 0), 0));
      setStokRendah(data.filter((item) => item.stok && item.stok.jumlah_barang < 10));
      processStokPerKategori(data);

      // Fetch Total User from a different API endpoint
      const responseUser = await fetch('/api/user/');
      const dataUser = await responseUser.json();
      setTotalUser(dataUser.length); // Assuming the
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 const processStokPerKategori = (data) => {
  const stokPerKategori = data.reduce((acc, item) => {
    const kategori = item.kategori.nama_kategori;
    const stok = item.stok?.jumlah_barang || 0;

    if (acc[kategori]) {
      acc[kategori] += stok;
    } else {
      acc[kategori] = stok;
    }

    return acc;
  }, {});

  setStokPerKategori(stokPerKategori);
};

useEffect(() => {
  fetchDashboardData();
}, []);

const chartData = {
  labels: Object.keys(stokPerKategori),
  datasets: [
    {
      label: 'Jumlah Stok per Kategori',
      data: Object.values(stokPerKategori),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

  return (
    <div className="content">
      <div className="container-fluid">
        <h4 className="page-title">Dashboard</h4>
        <div className="row">
          <div className="col-md-4">
            <div className="card card-stats" style={{ backgroundColor: '#FF9800' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-5">
                    <div className="icon-big text-center" style={{ color: 'white', marginBottom:'20px' }}>
                      <FaBox size={48} />
                    </div>
                  </div>
                  <div className="col-7 d-flex align-items-center">
                    <div className="numbers">
                      <p className="card-category" style={{ color: 'white' }}>Total Produk</p>
                      <h4 className="card-title" style={{ color: 'white' }}>{loading ? '...' : totalProduk}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-stats" style={{ backgroundColor: '#4CAF50' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-5">
                    <div className="icon-big text-center" style={{ color: 'white',  marginBottom:'20px' }}>
                      <FaTag size={48} />
                    </div>
                  </div>
                  <div className="col-7 d-flex align-items-center">
                    <div className="numbers">
                      <p className="card-category" style={{ color: 'white' }}>Total Kategori</p>
                      <h4 className="card-title" style={{ color: 'white' }}>{loading ? '...' : totalKategori}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-stats" style={{ backgroundColor: '#E53935' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-5">
                    <div className="icon-big text-center" style={{ color: 'white', marginBottom:'20px' }}>
                      <FaDolly size={48} />
                    </div>
                  </div>
                  <div className="col-7 d-flex align-items-center">
                    <div className="numbers">
                      <p className="card-category" style={{ color: 'white' }}>Total Stok</p>
                      <h4 className="card-title" style={{ color: 'white' }}>{loading ? '...' : totalStok}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="col-md-3">
            <div className="card card-stats" style={{ backgroundColor: '#2196F3' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-5">
                    <div className="icon-big text-center" style={{ color: 'white', marginBottom:'20px' }}>
                      <FaUsers size={48} />
                    </div>
                  </div>
                  <div className="col-7 d-flex align-items-center">
                    <div className="numbers">
                      <p className="card-category" style={{ color: 'white' }}>Total User</p>
                      <h4 className="card-title" style={{ color: 'white' }}>{loading ? '...' : totalUser}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Barang Stok Rendah</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nama Produk</th>
                        <th>Kategori</th>
                        <th>Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stokRendah.map((item) => (
                        <tr key={item.id_produk}>
                          <td>{item.nama_produk}</td>
                          <td>{item.kategori.nama_kategori}</td>
                          <td>{item.stok.jumlah_barang}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Stok per Kategori</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Chart type="bar" data={chartData} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Aktivitas Terbaru</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <ul className="list-group">
                    {dataProduk.slice(0, 5).map((item) => (
                      <li key={item.id_produk} className="list-group-item">
                        Produk ditambahkan: {item.nama_produk}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminDashboard);
