import Produk from '../../../../../models/Product';
export default async function handler(req, res) {
    const { id } = req.query;
  
    if (req.method === 'DELETE') {
      try {
        const deleted = await Produk.destroy({ where: { id_produk: id } });
        if (deleted) {
          res.status(200).json({ message: 'Product deleted successfully' });
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }