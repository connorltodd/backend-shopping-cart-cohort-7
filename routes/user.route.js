const { request, response } = require('express');
const express = require('express');
const router = express.Router();
const { connection } = require('../config');
// create routes

// POST /users (Create user and cart at the same time)
router.post('/', (request, response) => {
    const formData = request.body;
    // first create the user
    connection.query('INSERT INTO User SET ?', [formData], (error, results) => {
        if(error) {
            response.status(500).json(error);
        } else {
            const newUserId = results.insertId;
            // second create the cart with the id of the newly created user
            connection.query('INSERT INTO Cart (user_id) VALUES (?)', [newUserId], (error, results) => {
                if(error) {
                    response.status(500).json(error);
                } else {
                    response.json({ message: 'New user is created with cart successfully'})
                }
            })
        }
    })
})
// GET /users/:id (Get user and cart)
router.get('/:id', (request, response) => {
    const { id } = request.params;
    connection.query(`
    SELECT User.*, Cart.id as cart_id FROM User 
    Join Cart on Cart.user_id = User.id WHERE User.id = ?`, [id],
    (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            response.json(results[0]);
        }
    })
});

module.exports = router;