import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TabelComponent';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import withAuth from '@/lib/middleware/withAuth';

const AdminReports = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const columns = [
    { name: 'ID Produk', selector: (row) => row.id_produk, sortable: true },
    { name: 'Kategori', selector: (row) => row.kategori?.nama_kategori || 'Uncategorized', sortable: true },
    { name: 'Nama Produk', selector: (row) => row.nama_produk, sortable: true },
    { name: 'Kode Produk', selector: (row) => row.kode_produk, sortable: true },
    { name: 'Tanggal Register', selector: (row) => row.tgl_register, sortable: true },
    { name: 'Stok', selector: (row) => row.stok?.jumlah_barang || 'N/A', sortable: true },
    { name: 'Tanggal Update', selector: (row) => row.stok?.tgl_update || 'N/A', sortable: true },
  ];

  const fetchData = async () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/reports?startDate=${startDate || '2000-01-01'}&endDate=${endDate || new Date().toISOString().split('T')[0]}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        Object.values(item).some(value =>
          value ? value.toString().toLowerCase().includes(search.toLowerCase()) : false
        )
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  // Excel export
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        'ID Produk': item.id_produk,
        'Nama Kategori': item.kategori?.nama_kategori || 'Uncategorized',
        'Nama Produk': item.nama_produk,
        'Kode Produk': item.kode_produk,
        'Tanggal Register': item.tgl_register,
        'Jumlah Stok': item.stok?.jumlah_barang || 'N/A',
        'Tanggal Update': item.stok?.tgl_update || 'N/A',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Produk');
    XLSX.writeFile(workbook, 'Laporan_Produk.xlsx');
  };

  // PDF export
  const downloadPDF = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }
    const doc = new jsPDF();
    doc.text('Laporan Produk', 14, 10);
    autoTable(doc, {
      head: [['ID Produk', 'Nama Kategori', 'Nama Produk', 'Kode Produk', 'Tanggal Register', 'Jumlah Stok', 'Tanggal Update']],
      body: filteredData.map((item) => [
        item.id_produk,
        item.kategori?.nama_kategori || 'Uncategorized',
        item.nama_produk,
        item.kode_produk,
        item.tgl_register,
        item.stok?.jumlah_barang || 'N/A',
        item.stok?.tgl_update || 'N/A',
      ]),
    });
    doc.save('Laporan_Produk.pdf');
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="content">
      <h4 className="page-title">Laporan</h4>
      <div className="d-flex mb-3">
        <div className="me-3 mt-4">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Filter Download
            </button>
            <div className="dropdown-menu">
              <div className="px-3 mb-3">
                <label htmlFor="startDate">Tanggal Mulai:</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="px-3 mb-3">
                <label htmlFor="endDate">Tanggal Akhir:</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="me-3 mt-4">
          <button className="btn btn-success me-2" onClick={downloadExcel}>
            Download Excel
          </button>
          <button className="btn btn-danger" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>

      <div className="table-container">
        <TableComponent columns={columns} data={filteredData} loading={loading} showCreateButton={false} onSearch={(value) => setSearch(value)}/>
        {filteredData.length === 0 && !loading && (
            <div className="text-center mt-3">Data tidak tersedia untuk rentang tanggal yang dipilih.</div>
        )}
      </div>
    </div>
  );
};

export default withAuth(AdminReports);
