import User from '../../../models/User';
import { createToken } from '../../../lib/jwt';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nama_user, password } = req.body;

    if (!nama_user || !password) {
      return res.status(400).json({ error: "Nama pengguna dan password diperlukan" });
    }

    try {
      const user = await User.findOne({ where: { nama_user } });

      if (!user) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Password salah" });
      }

     const token = createToken({
        id_user: user.id_user,
        nama_user: user.nama_user,
      });

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Terjadi kesalahan saat login" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
