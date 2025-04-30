const express = require('express');

const serverless = require('serverless-http');

const app = express();


app.use(express.json());

app.get("/", (req, res) =>{
    res.send("hi")
})

app.listen(3000)

// module.exports.handler = serverless(app);