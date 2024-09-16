let { sequelize, DataTypes } = require("../lib/index");
let chef = sequelize.define("chef", {
    name: DataTypes.TEXT,
    birthYear: DataTypes.INTEGER
})
module.exports = { chef }