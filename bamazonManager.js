var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "135Knight739treE120hoRse",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    managerView();
});

// function for the managerView to start
function managerView() {
    inquirer.prompt({
        name: "managerchoices",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products For Sale.",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }).then(function (answer) {
        if (answer.managerchoices === "View Products For Sale") {
            viewProducts();
        } else if (answer.managerchoices === "View Low Inventory") {
            lowProducts();
        } else if (answer.managerchoices === "Add to Inventory") {
            addInventory();
        } else if (answer.managerchoices === "Add New Product") {
            addProduct();
        } else {
            connection.end();
        }
    })
}

function viewProducts() {
    var sql = "SELECT item_id,product_name,price,stock_quantity from products";
    connection.query(sql, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " +
                res[i].item_id +
                " || Product: " +
                res[i].product_name +
                " || Price: " +
                res[i].price +
                " || Stock Quantity: " +
                res[i].stock_quantity
            );
        }
        managerView();
    });
}

function lowProducts() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(
                    "\nLow quantity! Please order more!\nItem ID: " +
                    res[i].item_id +
                    " || Product: " +
                    res[i].product_name +
                    " || Price: " +
                    res[i].price +
                    " || Stock Quantity: " +
                    res[i].stock_quantity +
                    "\n"
                );
            }
        }
        managerView();
    });
}

function addInventory() {
    connection.query("SELECT * from products", function(err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "item",
            type: "input",
            message:
              "What is the item ID number of the product you would like to order more of?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("  Please provide a number\n");
              return false;
            }
          },
          {
            name: "amount",
            type: "input",
            message: "How many units of this product would you like to buy?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("  Please provide a number\n");
              return false;
            }
          }
        ])
        // with the users answers we run a loop that determines which item they are referring to
        .then(function(answer) {
          var chosenItem;
          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === parseInt(answer.item)) {
              chosenItem = res[i];
            }
          }
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity:
                  chosenItem.stock_quantity + parseInt(answer.amount)
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("\nOrder placed!\n");
              managerView();
            }
          );
        });
    });
  }

  function addProduct() {
    inquirer.prompt([
      {
        name: "item",
        type: "input",
        message: "What item would you like add to the inventory?"
      },
      {
        name: "department",
        type: "input",
        message: "What department will the item be placed in?"
      },
      {
        name: "price",
        type: "input",
        message: "How much will you be selling the item for?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stock",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
          "INSERT INTO products SET ?",
          {
              product_name: answer.item,
              department_name: answer.department,
              price: answer.price,
              stock_quantity: answer.stock
          },
          function(err) {
              if (err) throw err;
              console.log("\nYou successfully added the product!\n");
              managerView();
            }
      );
    });
  }