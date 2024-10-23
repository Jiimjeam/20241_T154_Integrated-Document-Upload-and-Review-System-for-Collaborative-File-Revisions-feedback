const express = require('express');
const instructor = express.Router();

const  students  = require('../../exampleDB');  
const {viewSyllabus} = require('../../Services/INTRservices')


instructor.get('/view-syllabus', function(req, res) { 
    viewSyllabus(req, res);
    // nani(req, res);
});

instructor.post('/upload-syllabus', function(req, res) { 
    res.send('Syllabus uploaded');
});

instructor.get('/syllabus-comments', function(req, res) { 
    res.send('Viewed syllabus comments');
});

instructor.get('/syllabus-upload-history', function(req, res) { 
    res.send('Viewed syllabus History');
});


module.exports = instructor;
