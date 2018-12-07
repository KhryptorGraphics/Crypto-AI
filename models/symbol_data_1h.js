'use strict';
module.exports = (sequelize, DataTypes) => {
  const Symbol_data_1h = sequelize.define('Symbol_data_1h', {
    class_name: DataTypes.STRING,
    symbol_id: DataTypes.INTEGER,
    open_time: DataTypes.DATE,
    close_time: DataTypes.DATE,
    open_price: DataTypes.DOUBLE,
    high_price: DataTypes.DOUBLE,
    low_price: DataTypes.DOUBLE,
    close_price: DataTypes.DOUBLE,
    volume: DataTypes.DOUBLE,
    Quote_asset_volume: DataTypes.DOUBLE,
    no_of_trades: DataTypes.DOUBLE,
    Taker_buy_base_asset_vol: DataTypes.DOUBLE,
    taker_buy_quote_asset_volume: DataTypes.DOUBLE
  }, {});
  Symbol_data_1h.associate = function(models) {
    // associations can be defined here
    Symbol_data_1h.belongsTo(models.Symbol, {
      foreignKey: 'symbol_id'
    })
  };
  return Symbol_data_1h;
};