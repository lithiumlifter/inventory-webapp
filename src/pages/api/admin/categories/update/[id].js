import Kategori from '../../../../../models/Category';
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nama_kategori } = req.body;
    try {
      const category = await Kategori.findByPk(id);
      if (category) {
        category.nama_kategori = nama_kategori;
        await category.save();
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
