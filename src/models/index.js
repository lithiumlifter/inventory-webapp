import Kategori from '../models/Category';
import Produk from '../models/Product';
import Stok from '../models/Stock';

Kategori.hasMany(Produk, { foreignKey: 'id_kategori' });
Produk.belongsTo(Kategori, { foreignKey: 'id_kategori' });

Produk.hasMany(Stok, { foreignKey: 'id_produk' });
Stok.belongsTo(Produk, { foreignKey: 'id_produk' });

export { Kategori, Produk, Stok };
