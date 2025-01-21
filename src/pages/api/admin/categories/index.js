import Kategori from '../../../../models/Category';
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const categories = await Kategori.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
