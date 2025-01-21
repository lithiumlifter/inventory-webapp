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
        const existingUser = await User.findOne({ where: { nama_user } });
        if (existingUser) {
          return res.status(400).json({ error: "Nama pengguna sudah terdaftar" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = await User.create({ nama_user, password: hashedPassword });
  
        const token = createToken({
            id_user: user.id_user,
            nama_user: user.nama_user,
        });
  
        return res.status(201).json({ token });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Terjadi kesalahan saat registrasi" });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
