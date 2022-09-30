const { application, request } = require('express');
const express = require('express');
const router = express.Router();
const { connection } = require('../config');

// POST /cart/:cart_id/products
router.post('/:cart_id/products', (request, response) => {
    const { cart_id } = request.params;
    const { product_id } = request.body;
    connection.query('INSERT INTO Cart_Product (product_id, cart_id) VALUES (?,?)', [product_id, cart_id], 
    (error, results) => {
        if(error) {
            response.status(500).json(error);
        } else {
            response.json({ message: 'cart product was successfully created'})
        }
    })
});


// GET /cart/:cart_id/products
router.get('/:cart_id/products', (request, response) => {
    const { cart_id } = request.params;

    connection.query(`
        SELECT Product.*, Cart_Product.id as cart_product_id, Cart_Product.quantity, Cart.id as cart_id FROM Cart
        JOIN Cart_Product ON Cart.id = Cart_Product.cart_id 
        JOIN Product ON Product.id = Cart_Product.product_id WHERE Cart.id = ?
    `, [cart_id], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            response.json(results);
        }
    })
})



// PUT /cart/:cart_id/products/:cart_product_id (Update Quantity)
router.put('/:cart_id/products/:cart_product_id', (request, response) => {
    const { cart_id, cart_product_id } = request.params;
    const { quantity } = request.body;

    connection.query('UPDATE Cart_Product SET quantity = ? WHERE id = ?', [quantity, cart_product_id],
    (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            response.status(200).json({ message: 'product has been successfully updated'})
        }
    });

})

// DELETE BY ID /cart/:cart_id/products/:cart_product_id
router.delete('/:cart_id/products/:cart_product_id', (request, response) => {
    const { cart_id, cart_product_id } = request.params;

    connection.query('DELETE FROM Cart_Product WHERE id = ?', [cart_product_id], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            response.json({ message: `The cart product with the id ${cart_product_id} was successfully deleted`})
        }
    })
})

module.exports = router;