import fs from 'fs';
import path from 'path';
import Produk from '../../../../models/Product';
import Stok from '../../../../models/Stock';

const saveImage = (base64Image, filename) => {
  return new Promise((resolve, reject) => {
    const matches = base64Image.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
    if (!matches) {
      return reject('Invalid base64 string');
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const imagePath = path.join(process.cwd(), 'public', 'uploads', filename);

    fs.writeFile(imagePath, imageBuffer, (err) => {
      if (err) {
        return reject('Failed to save image');
      }
      resolve(imagePath);
    });
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nama_produk, kode_produk, id_kategori, jumlah_barang, foto_produk } = req.body;

    try {
      // Validasi untuk memastikan semua data ada
      if (!nama_produk || !kode_produk || !id_kategori || jumlah_barang === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validasi jumlah_barang (pastikan angka)
      if (isNaN(jumlah_barang) || jumlah_barang < 1) {
        return res.status(400).json({ error: 'Invalid stock quantity' });
      }

      // If there are photos, save them and get the file URLs
      let imageUrls = [];
      if (foto_produk && foto_produk.length > 0) {
        for (let i = 0; i < foto_produk.length; i++) {
          const base64Image = foto_produk[i];
          const filename = `product_${Date.now()}_${i + 1}.jpg`;  // Unique filename
          const imageUrl = await saveImage(base64Image, filename);
          imageUrls.push(`/uploads/${filename}`);  // URL path of the saved image
        }
      }

      // Convert imageUrls array to JSON string before saving to database
      const serializedImageUrls = JSON.stringify(imageUrls);

      // Create the new product
      const newProduk = await Produk.create({
        nama_produk,
        kode_produk,
        foto_produk: serializedImageUrls,  // Store serialized JSON string
        id_kategori,
        tgl_register: new Date(),
      });

      // Create stock entry for the new product
      await Stok.create({
        id_produk: newProduk.id_produk,  // Assumes the product has id_produk automatically
        jumlah_barang,
        tgl_update: new Date(),  // Add the update date
      });

      // Return success response
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
