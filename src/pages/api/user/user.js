import { verifyToken } from '../../../lib/jwt';
import User from '../../../models/User';
export default async function handler(req, res) {
    if (req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) return res.status(401).json({ error: 'Token tidak ditemukan' });
  
      try {
        const decoded = await verifyToken(token);
        const user = await User.findByPk(decoded.id_user);
  
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
  
        return res.status(200).json({
          id_user: user.id_user,
          nama_user: user.nama_user,
        });
      } catch (error) {
        return res.status(500).json({ error: 'Token tidak valid atau telah kadaluarsa' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
