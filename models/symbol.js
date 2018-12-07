'use strict';
module.exports = (sequelize, DataTypes) => {
  const Symbol = sequelize.define('Symbol', {
    class_name: DataTypes.STRING
  }, {});
  Symbol.associate = function(models) {

    // associations can be defined here
  };
  return Symbol;
};