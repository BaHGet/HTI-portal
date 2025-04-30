const express = require('express');
const app = express();

const serverless = require('serverless-http');

const { userRouter } = require("../routes/user");


// middleware
app.use(express.json());



app.use('/api/user', userRouter)

app.get("/", (req, res) =>{
    res.send("hi")
})

app.listen(3000)

// module.exports.handler = serverless(app);