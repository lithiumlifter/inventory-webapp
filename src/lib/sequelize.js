import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'inventory_app',
  });

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database berhasil');
  } catch (error) {
    console.error('Gagal terhubung ke database:', error);
  }
};

testConnection();

export default sequelize;
