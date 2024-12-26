const express = require('express');
const app = express();
const port= process.env.PORT || 5000;
app.use(express.json());


app.get("/",(req, res) => {
    res.send("Hello this is the server for sushi chat bot")
})

