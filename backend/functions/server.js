const express = require('express');

const serverless = require('serverless-http');

const app = express();

const dotenv = require ('dotenv')
dotenv.config();

// Import Routes
const authRoute = require('../routes/auth');

app.use(express.json());

// Route Middlewares
app.use('/user',authRoute);

app.listen(3000,()=>{console.log('server is runnig')})

// module.exports.handler = serverless(app);