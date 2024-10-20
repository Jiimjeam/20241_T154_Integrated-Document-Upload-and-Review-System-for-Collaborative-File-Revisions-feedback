const express = require('express');
const instructor = express.Router();
const { students } = require('../../exampleDB');  


instructor.post('/uploadSyllabus/INTR', function(req, res) { 
    res.send('Syllabus uploaded');
});

instructor.get('/viewSyllabus/INTR', function(req, res) { 
    res.send('Viewed syllabus');
});

instructor.get('/viewSyllabus/comments/INTR', function(req, res) { 
    res.send('Viewed syllabus comments');
});

instructor.get('/viewSyllabusupload/History/INTR', function(req, res) { 
    res.send('Viewed syllabus History');
});

module.exports = instructor;
