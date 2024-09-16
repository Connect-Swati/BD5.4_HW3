/*
Exercise 3: Define associations

Create a model studentCourse.model.js which uses a 
join table to connect both student & course tables 
with many-to-many relationship
 */
let { sequelize, DataTypes } = require("../lib/index");
let { dish } = require("./dish.model")
let { chef } = require("./chef.model");

let chefDish  = sequelize.define("chefDish ", {
    chedId: {
        type: DataTypes.INTEGER,
        references: {
            model: chef,
            key: "id"
        }
    },
    dishId: {
        type: DataTypes.INTEGER,
        references: {
            model: dish,
            key: "id"
        }
    }
})

dish.belongsToMany(chef, { through: chefDish  })
chef.belongsToMany(dish, { through: chefDish  })
module.exports = { chefDish  }

