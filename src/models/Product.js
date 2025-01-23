import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Produk = sequelize.define('tbl_produk', {
 id_produk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_kategori: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Kategori',
      key: 'id_kategori'
    }
  },
  nama_produk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kode_produk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  foto_produk: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tgl_register: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
    tableName: 'tbl_produk',
    timestamps: false, 
});

// Define hubungan dengan kategori (one-to-many)
Produk.associate = (models) => {
    Produk.belongsTo(models.Kategori, { foreignKey: 'id_kategori' });
};

export default Produk;
