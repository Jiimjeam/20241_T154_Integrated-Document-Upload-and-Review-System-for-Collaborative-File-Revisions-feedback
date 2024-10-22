const express = require('express');
const instructor = express.Router();
const { students } = require('../../exampleDB');  


instructor.post('/upload-syllabus', function(req, res) { 
    res.send('Syllabus uploaded');
});

instructor.get('/view-syllabus', function(req, res) { 
    res.send('Viewed syllabus');
});

instructor.get('/syllabus-comments', function(req, res) { 
    res.send('Viewed syllabus comments');
});

instructor.get('/syllabus-upload-history', function(req, res) { 
    res.send('Viewed syllabus History');
});


module.exports = instructor;
