import Produk from '../../../../models/Product';
import Stok from '../../../../models/Stock';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nama_produk, kode_produk, id_kategori, jumlah_barang } = req.body;

    try {
      // Validasi untuk memastikan semua data ada
      if (!nama_produk || !kode_produk || !id_kategori || jumlah_barang === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validasi jumlah_barang (pastikan angka)
      if (isNaN(jumlah_barang) || jumlah_barang < 1) {
        return res.status(400).json({ error: 'Invalid stock quantity' });
      }

      // Membuat produk baru tanpa foto
      const newProduk = await Produk.create({
        nama_produk,
        kode_produk,
        foto_produk: '',  // Tidak ada foto produk
        id_kategori,
        tgl_register: new Date(),
      });

      // Membuat entri stok untuk produk yang baru dibuat
      await Stok.create({
        id_produk: newProduk.id_produk,  // Asumsi produk memiliki id_produk yang otomatis
        jumlah_barang,
        tgl_update: new Date(),  // Menambahkan tanggal update
      });

      // Mengirimkan respons sukses
      res.status(201).json({ message: 'Product created successfully', product: newProduk });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Unable to create product', details: error.message });
    }    
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
