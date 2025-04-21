const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app=express();
if(process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({ path: 'backend/config/config.env' });
}

//using middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser())

const post=require('./routes/post');
const user=require('./routes/user');


app.use("/api/v1",post);
app.use("/api/v1",user);

module.exports = app;