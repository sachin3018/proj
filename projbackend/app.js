
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');


//My Routes
const authRoute = require("./routes/auth")
const userRoute = require('./routes/user')
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product")
const orderRoute = require("./routes/order")
const paymentBRoute = require("./routes/payment")
const port =   8000;

//middle ware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//DB connect 
mongoose.connect(process.env.DATABASE , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true})
    .then(() => {
        console.log("Hey Connected Succesfully")
    })
    .catch(error => {
        console.log(error)
    })


//Routes
app.use('/auth', authRoute)
app.use('/auth', userRoute)
app.use('/auth', categoryRoute)
app.use('/auth', productRoute)
app.use('/auth', orderRoute)
app.use('/auth', paymentBRoute);

app.listen(port, () => {
    console.log(`This is running on ${port}....`);
})