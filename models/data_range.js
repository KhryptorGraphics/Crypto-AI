'use strict';
module.exports = (sequelize, DataTypes) => {
  const data_range = sequelize.define('data_range', {
    class_name: DataTypes.STRING,
    symbol_id: DataTypes.INTEGER,
    time_start: DataTypes.DATE,
    time_end: DataTypes.DATE
  }, {});
  data_range.associate = function(models) {
    
    data_range.belongsTo(models.Symbol, {
      foreignKey: 'symbol_id'
    })
    // associations can be defined here
  };
  return data_range;
};