'use strict';
module.exports = (sequelize, DataTypes) => {
  const currentprice = sequelize.define('currentprice', {
    symbol_id: DataTypes.INTEGER,
    symbol_price: DataTypes.REAL
  }, {});
  currentprice.associate = function(models) {
    currentprice.belongsTo(models.Symbol, {
      foreignKey: 'symbol_id'
    })
    // associations can be defined here
  };
  return currentprice;
};