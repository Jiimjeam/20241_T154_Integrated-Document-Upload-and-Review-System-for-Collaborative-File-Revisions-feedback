// import express from 'express'
// import cors from 'cors'
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
const express = require('express')
const dotenv = require('dotenv')
const app = express();

 
const instructorRoute = require('./routes/INTR/instructor')
const formsRoute = require('./routes/forms')
const SenfacultyRoute = require('./routes/SN.FCT/Seniorfaculty')
const programChairRoute = require('./routes/PRCR/ProgramChair')
const CITLRoute = require('./routes/CITL/CITL');
const { default: mongoose } = require('mongoose');

app.use('/forms', formsRoute);
app.use('/instructor', instructorRoute);
app.use('/Senfaculty', SenfacultyRoute);
app.use('/programChair', programChairRoute);
app.use('/CITL', CITLRoute);

dotenv.config();
const PORT  = process.env.PORT

const connect = async () => {
    // try {
    //     await mongoose.connect(process.env.MONGODB);
    // } catch (error) {
    //     console.log(error)
    // }
}

mongoose.connection.on('disconnected', () =>{
    console.log('disconnected to MongoDB');
})

mongoose.connection.on('connected', () =>{
    console.log('Connected to MongoDB');
})


app.listen(PORT, () => {
    connect()      //Invalid ang MONGODB KEY kay examlple ra akong gi butang 
    console.log(`Server is running on port ${PORT}`)
});
 