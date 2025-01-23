import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Kategori = sequelize.define('tbl_kategori', {
  id_kategori: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_kategori: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
}, {
  tableName: 'tbl_kategori',
  timestamps: true,
});

Kategori.associate = (models) => {
  Kategori.hasMany(models.Produk, { foreignKey: 'id_kategori' });
};

export default Kategori;
