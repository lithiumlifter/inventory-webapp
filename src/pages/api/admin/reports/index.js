import { Kategori, Produk, Stok } from '../../../../models/index';
const { Op } = require('sequelize');
export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { startDate, endDate } = req.query;
  
      try {
        const produk = await Produk.findAll({
          include: [
            {
              model: Kategori,
              attributes: ['id_kategori', 'nama_kategori'],
              required: false,
            },
            {
              model: Stok,
              attributes: ['id_stok', 'jumlah_barang', 'tgl_update'],
              required: false,
              order: [['tgl_update', 'DESC']],
              limit: 1,
            },
          ],
          where: {
            tgl_register: {
                [Op.between]: [
                startDate || '2000-01-01',
                new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
                    .toISOString()
                    .split('T')[0],
                ],
            },
            },

          attributes: [
            'id_produk',
            'id_kategori',
            'nama_produk',
            'kode_produk',
            'foto_produk',
            'tgl_register',
          ],
          order: [['tgl_register', 'DESC']],
        });
  
        if (produk.length === 0) {
          return res.status(404).json({ message: 'No products found' });
        }
  
        const formattedData = produk.map((item) => ({
          id_produk: item.id_produk,
          nama_produk: item.nama_produk,
          kode_produk: item.kode_produk,
          foto_produk: item.foto_produk,
          tgl_register: item.tgl_register,
          kategori: {
            id_kategori: item.tbl_kategori?.id_kategori || null,
            nama_kategori: item.tbl_kategori?.nama_kategori || 'Uncategorized',
          },
          stok: item.tbl_stoks?.[0]
            ? {
                id_stok: item.tbl_stoks[0].id_stok,
                jumlah_barang: item.tbl_stoks[0].jumlah_barang,
                tgl_update: item.tbl_stoks[0].tgl_update,
              }
            : null,
        }));
  
        res.status(200).json(formattedData);
      } catch (error) {
        console.error('Error fetching products:', error);
        res
          .status(500)
          .json({ error: error.message || 'Something went wrong while fetching products' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }