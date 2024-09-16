let express = require("express")
let app = express();
app.use(express.json());

let port = 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
})
let { chef } = require("./models/chef.model")
let { dish } = require("./models/dish.model");
let { chefDish } = require("./models/chefDish.model");
let { sequelize } = require("./lib/index");

let dishData = [
    {
      name: 'Margherita Pizza',
      cuisine: 'Italian',
      preparationTime: 20,
    },
    {
      name: 'Sushi',
      cuisine: 'Japanese',
      preparationTime: 50,
    },
    {
      name: 'Poutine',
      cuisine: 'Canadian',
      preparationTime: 30,
    },
  ];

let chefData = [
    { name: 'Gordon Ramsay', birthYear: 1966 },
    { name: 'Masaharu Morimoto', birthYear: 1955 },
    { name: 'Ricardo Larrivée', birthYear: 1967 },
  ];

app.get("/", (req, res) => {
    res.status(200).json({ message: "BD5.4 - HW3 Application" });
});

//seed_db

app.get("/seed_db", async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        let dishDataInserted = await dish.bulkCreate(dishData);
        let chefDataInserted = await chef.bulkCreate(chefData);
     //self study
        let modelsCreated = Object.keys(sequelize.models);
        return res.status(200).json({
            message: "Database seeded successfully",
            tablesCreated : modelsCreated,
            dishData: dishDataInserted,
            chefData: chefDataInserted
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error seeding database",
            error: error.message
        })

    }


})


// self - to fetch data from all tables

app.get("/getAllData", async (req, res) => {
    try {
        let dishResult = await dish.findAll();
        let chefResult = await chef.findAll();
        let chefDishResult = await chefDish.findAll();
        return res.status(200).json({
            message: "Data fetched successfully",
            chefData: chefResult,
            dishData: dishResult,
            chefDishData: chefDishResult
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error fetching data",
            error: error.message
        })

    }
})

/*
Exercise 1: Create New Chef

Create a POST endpoint /chefs/new that will create a new author record in the database.

Declare a variable named newChef to store the data from the request body, i.e., req.body.newChef .

Create a function named addNewChefto create a new record in the database based on the request body.

API Call

http://localhost:3000/chefs/new

Request Body

{
  'newChef': {
    'name': 'New Chef',
    'birthYear': 1970
  }
}

Expected Output

{
  'newChef': {
    'id': 4,
    'name': 'New Chef',
    'birthYear': 1970
  }
}

*/

// fucntion to Create New Chef

async function addNewChef(newChef ) {
    try {
        let result = await chef.create(newChef);
        if (!result) {
            throw new Error("Failed to create new chef");

        }
        return { newChef: result };

    } catch (error) {
        console.log("error in creating new chef ", error.message);
        return error;


    }

}

//endpoint to create new student
app.post("/chefs/new", async (req, res) => {
    try {
        let newChef  = req.body.newChef;
        let result = await addNewChef(newChef);
        res.status(200).json(result);

    } catch (error) {
        if (error.message === "Failed to create new chef") {
            res.status(404).json({
                code: 404,
                message: "Failed to create new chef",
                error: error.message
            })
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                error: error.message
            })
        }


    }
})

/*
Exercise 2: Update Chef by ID

Create a POST endpoint /chefs/update/:id that will update a chef record by ID.

Retrieve the chef ID from the path parameters and parse it to an integer.

Declare a variable named newChefData to store the data from the request body.

Create a function named updateChefById to find and update the chef record based on the ID and request body.

API Call

http://localhost:3000/chefs/update/4

Request Body

{
  'name': 'Updated Chef Name',
  'birthYear': 1977
}

Expected Output

{
  'message': 'Chef updated successfully',
  'updatedChef': {
    'id': 4 ,
    'name': 'Updated Chef Name',
    'birthYear': 1977
  }
}
   */

//function to  Update Chef by ID
async function updateChefById (newChefData ,id) {
    try {
        let chefToBeUpdated = await chef.findByPk(id)
        if(!chefToBeUpdated){
            return new Error("chef  not found");

        }
        let updatedChef= await chefToBeUpdated.update(newChefData);
        return{
            message: 'chef updated successfully',
            updatedChef: updatedChef
        }
        
    } catch (error) {
        console.log("error in updating chef by id ", error.message)
        throw error
    }
    
}

// endpoint to Update Chef by ID
app.post("/chefs/update/:id" ,  async (req, res) => {
    try {
        
        let id = req.params.id
        let newChefData  = req.body
        let result = await  updateChefById (newChefData,id);
        return res.status(200).json(result)

    } catch (error) {
        if(error.message ===  "chef  not found"){
            return res.status(404).json({
                code: 404,
                message: "chef not found",
            error : error.message
        })
        }else {
            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                error : error.message
                })
        }

        
    }
})

