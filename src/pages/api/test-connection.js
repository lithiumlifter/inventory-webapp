import sequelize from '../../lib/sequelize';

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: 'Koneksi berhasil!' });
  } catch (error) {
    res.status(500).json({ message: 'Koneksi gagal', error: error.message });
  }
}
