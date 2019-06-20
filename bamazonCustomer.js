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
    showProducts();
});

function showProducts() {
    var sql = "SELECT item_id,product_name,price,stock_quantity from products";
    connection.query(sql, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " + res[i].item_id + " || Product: " + res[i].product_name +" || Price: " + res[i].price + " || Items on hand: " +
                res[i].stock_quantity
            );
        }
        purchaseProduct();
    });
}
function purchaseProduct() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "item",
                    type: "input",
                    message:
                        "What is the item ID number of the product you would like to buy?",
                    validate: function (value) {
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
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log("  Please provide a number\n");
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                // loop start to determine if there are enough items on hand.
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === parseInt(answer.item)) {
                        chosenItem = res[i];
                    }
                }
                // this checks if there is enough quantity of the item the user has requested
                // if there is enough in stock, the table is updated and the user is given a total amount
                // if there is not enough in stock then the user is notified and the function starts over
                if (chosenItem.stock_quantity > parseInt(answer.amount)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity - parseInt(answer.amount)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log(
                                "\nPurchase placed! Your total is $" +
                                (
                                    chosenItem.price.toFixed(2) * parseInt(answer.amount)
                                ).toFixed(2) + "\n"
                            );
                            inquirer
                                .prompt({
                                    name: "keepshopping",
                                    type: "list",
                                    message: "Would you like to continue shopping?",
                                    choices: ["Yes", "No"]
                                })
                                .then(function (answer) {
                                    if (answer.keepshopping === "Yes") {
                                        showProducts();
                                    } else {
                                        connection.end();
                                    }
                                });
                        }
                    );
                } else {
                    console.log("\nInsufficient quantity!\n");
                    purchaseProduct();
                }
            });
    });
}