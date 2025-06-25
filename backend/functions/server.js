const express = require('express');

const serverless = require('serverless-http');

const app = express();

const db = require('../config/db')

const dbconnecet = db.dbConnection();


const {userRouter} = require('../routes/user')

app.use(express.json());

app.use('/api/user', userRouter)


app.get("/", (req, res) =>{
    res.send("hi")
})

app.listen(3000)

// module.exports.handler = serverless(app);