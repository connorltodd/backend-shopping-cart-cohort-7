const express = require('express');
const router = express.Router();
const { connection } = require('../config');

// http://localhost:9000/products
router.get('/', (request, response) => {
    // request is what is being sent from client (postman, react, frontend)
    // response is what the server is returning
    connection.query('SELECT * FROM Product', (error, results) => {
        if (error) {
            response.status(500).json(error)
        } else {
            response.status(200).json(results)
        }
    })
});


// POST /products
router.post('/', (request, response) => {
    const formData = request.body;
    console.log(formData)

    connection.query('INSERT INTO Product SET ?', [formData], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            const newProductId = results.insertId
            console.log(newProductId)
            connection.query('SELECT * FROM Product WHERE id = ?', [newProductId], (error, results) => {
                if(error) {
                    response.status(500).json(error)
                } else {
                    response.status(200).json(results)
                } 
            })
        }
    })
    
})

// GET BY ID /products/:id
router.get('/:id', (request, response) => {
    const requestedProductId = Number(request.params.id);

    connection.query('SELECT * FROM Product WHERE id = ?', [requestedProductId], (error, results) => {
        if (error) {
            response.status(500).json(error)
        } else {
            response.status(200).json(results)
        }
    })

})

// UPDATE BY ID /products/:id
router.put('/:id', (request, response) => {
    const requestedProductToUpdateId = Number(request.params.id);
    const updatedProduct = request.body;

    connection.query('UPDATE Product SET ? WHERE id = ? ', [updatedProduct, requestedProductToUpdateId], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            connection.query('SELECT * FROM Product WHERE id = ?', [requestedProductToUpdateId], (error, results) => {
                if (error) {
                    response.status(500).json(error)
                } else {
                    response.status(200).json(results)
                }
            })
        }
    })
})

// DELETE BY ID /products/:id
router.delete('/:id', (request, response) => {
    const requestedProductToDeleteId = Number(request.params.id);
    connection.query('DELETE FROM Product WHERE id = ?', [requestedProductToDeleteId], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            response.send({ message: `The product with the id of ${requestedProductToDeleteId} was successfully deleted`})
        }
    })
});

module.exports = router;