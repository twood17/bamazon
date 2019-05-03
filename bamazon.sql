DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR NOT NULL,
    department_name VARCHAR,
    price DEC(20, 2) NOT NULL,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Wheel of Time", "Books", 19.95, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Malazan Book of the Fallen", "Books", 19.95, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Tales of the Black Company", "Books", 15.95, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Monoploy", "Board Games", 25.95, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Life", "Board Games", 28.95, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Axis and Allies", "Board Games", 29.95, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Scrabble", "Board Games", 13.95, 19);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Basketball", "Sports Equipment", 29.95, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Soccer Ball", "Sports Equipment", 25.95, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Football", "Sports Equipment", 15.95, 11);
