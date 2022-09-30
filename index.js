const express = require('express');
const morgan = require('morgan')
const app = express();
const PORT = 9000;
const { connection } = require('./config')

const productsRouter = require('./routes/products.route');
const usersRouter = require('./routes/user.route');
const cartRouter = require('./routes/cart.route');


app.use(express.json());
app.use(morgan('dev'));

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);


connection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Successfully connected to database')
    }
})



// Users
// POST /user
// GET /user/:id



app.listen(PORT, (error) => {
    if (error) {
        console.log('error: ', error)
    } else {
        console.log(`App is running at ${PORT}`)
    }
});