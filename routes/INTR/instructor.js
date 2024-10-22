const express = require('express');
const instructor = express.Router();
const { students } = require('../../exampleDB');  


instructor.post('/uploadSyllabus', function(req, res) { 
    res.send('Syllabus uploaded');
});

instructor.get('/viewSyllabus', function(req, res) { 
    res.send('Viewed syllabus');
});

instructor.get('/viewSyllabus/comments', function(req, res) { 
    res.send('Viewed syllabus comments');
});

instructor.get('/viewSyllabusupload/History', function(req, res) { 
    res.send('Viewed syllabus History');
});


module.exports = instructor;
