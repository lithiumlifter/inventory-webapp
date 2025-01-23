import Kategori from '../../../../../models/Category';
export default async function handler(req, res) {
    const { id } = req.query;
  
    if (req.method === 'DELETE') {
      try {
        const deleted = await Kategori.destroy({ where: { id_kategori: id } });
        if (deleted) {
          res.status(200).json({ message: 'Category deleted successfully' });
        } else {
          res.status(404).json({ message: 'Category not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }