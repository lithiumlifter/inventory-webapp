import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Stok = sequelize.define('tbl_stok', {
  id_stok: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Produk', // ini mengacu ke model Produk
      key: 'id_produk'
    }
  },
  jumlah_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tgl_update: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},{
  tableName: 'tbl_stok',
  timestamps: false, 
});

// Define hubungan dengan produk (one-to-many)
Stok.associate = (models) => {
    Stok.belongsTo(models.Produk, { foreignKey: 'id_produk' });
};

export default Stok;
