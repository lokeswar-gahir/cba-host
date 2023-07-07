const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async(req,res)=>{
    console.log(`POST: /api/users/register`);

    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        console.log(`   All fields are mandatory!!!`);
        throw new Error("All fields are mandatory");
    }

    const userAvilable = await User.findOne({email});
    if(userAvilable){
        res.status(400);
        console.log(`   User already exist!!!`);
        throw new Error("User already exist!!!");
    }

    //Hash password
    const hassedPassword = await bcrypt.hash(password, 10);
    // console.log("hashed password: ", hassedPassword);

    const user = User.create({username, email, password: hassedPassword});
    if(user){
        console.log(`   User created Successfully.`);
        res.status(201).send(user);
    }else{
        res.status(400);
        throw new Error("User data is not valid.");
    }
    // res.end();
});

//@desc login a user
//@route POST /api/users/login
//@access public
const login = asyncHandler(async(req,res)=>{
    console.log(`POST: /api/users/login`);

    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory.");
        
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        res.status(200).json({accessToken});

        console.log(`   ${res.statusCode}: JWT Token generated Successfully\n`);
    }else{
        res.status(401);
        throw new Error("Email or password is not valid.")
    }
});

//@desc current user info
//@route GET /api/users/current
//@access private
const current = asyncHandler(async(req,res)=>{
    console.log(`GET: /api/users/current`);
    res.json(req.user);
    console.log(`   ${res.statusCode}: Current user info is fetched.(Protected)\n`);
});

const allusers = asyncHandler(async(req,res)=>{
    const alldata = await User.find();
    res.json(alldata);
});

module.exports = {registerUser, login, current,allusers};