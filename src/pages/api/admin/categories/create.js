import Kategori from '../../../../models/Category';
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nama_kategori } = req.body;
    try {
      const newCategory = await Kategori.create({ nama_kategori });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
