const express = require('express');
const errorHandler = require("./middleware/errorHandler");
require('dotenv').config();
const connectDb = require('./config/dbConnection');



const app = express();
connectDb();
const cors = require("cors");
app.use(cors());

const port  = process.env.PORT || 5000;
// const port  = 3001;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
 });
app.use(express.json());
app.use("/api/contacts", require('./routes/contactRouters'));
app.use("/api/users", require('./routes/userRouters'));
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Listening on port ${port}...\n`);
});

app.get('/',(req,res)=>{
    console.log("On Homepage.");
    res.sendFile(__dirname + '/frontend/hello.html',(err)=>{
        console.log(err)
    });
});
app.get('/hello.js',(req,res)=>{
    console.log("sending hello.js");
    res.sendFile(__dirname + '/frontend/hello.js',(err)=>{
        console.log(err)
    });
});