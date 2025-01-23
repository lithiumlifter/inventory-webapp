import fs from 'fs';
import path from 'path';
import Product from '../../../../../models/Product';

// Helper untuk menyimpan gambar base64 ke file
const saveBase64Image = async (base64Data) => {
  const base64String = base64Data.split(';base64,').pop();
  const buffer = Buffer.from(base64String, 'base64');
  const fileName = `product_${Date.now()}.png`;
  const filePath = path.resolve('public/uploads', fileName);

  try {
    await fs.promises.writeFile(filePath, buffer);
    return fileName;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nama_produk, kode_produk, id_kategori, jumlah_barang, foto_produk } = req.body;

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const oldPhotos = JSON.parse(product.foto_produk || '[]');
      const parsedPhotos = await parseFotoProduk(foto_produk);

      // Update product data
      product.nama_produk = nama_produk || product.nama_produk;
      product.kode_produk = kode_produk || product.kode_produk;
      product.id_kategori = id_kategori || product.id_kategori;
      product.jumlah_barang = jumlah_barang || product.jumlah_barang;
      product.foto_produk = JSON.stringify(parsedPhotos);

      // Hapus foto lama yang tidak digunakan
      await deleteOldPhotos(oldPhotos, parsedPhotos);

      // Simpan perubahan
      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Fungsi parsing foto_produk (menangani base64 dan URL)
const parseFotoProduk = async (foto_produk) => {
  if (typeof foto_produk === 'string') {
    try {
      return JSON.parse(foto_produk);
    } catch (error) {
      console.error('Error parsing foto_produk:', error);
      return [];
    }
  }

  if (Array.isArray(foto_produk)) {
    const parsed = [];
    for (const foto of foto_produk) {
      if (foto.startsWith('data:image')) {
        // Base64 image, simpan gambar baru
        const newFileName = await saveBase64Image(foto);
        parsed.push(`/uploads/${newFileName}`);
      } else if (foto.startsWith('/uploads/')) {
        // URL gambar yang sudah ada
        parsed.push(foto);
      }
    }
    return parsed;
  }

  return [];
};

// Fungsi hapus foto lama
// Fungsi hapus foto lama// Fungsi hapus foto lama
const deleteOldPhotos = async (oldPhotos, newPhotos) => {
  const folderPath = path.resolve('public/uploads');
  
  // Hanya menghapus foto lama yang tidak ada di newPhotos
  const photosToDelete = oldPhotos.filter((photo) => !newPhotos.includes(photo));

  for (const photo of photosToDelete) {
    const photoPath = path.join(folderPath, photo);

    try {
      if (fs.existsSync(photoPath)) {
        await fs.promises.unlink(photoPath);  // Menghapus foto yang tidak ada di newPhotos
        console.log(`File ${photo} deleted successfully.`);
      } else {
        console.log(`File ${photo} not found.`);
      }
    } catch (error) {
      console.error(`Error deleting file ${photo}:`, error);
    }
  }
};


