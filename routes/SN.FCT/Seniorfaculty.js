const express = require('express');
const Senfaculty = express.Router();
const { students } = require('../../exampleDB');  


Senfaculty.get('/view/uploaded/Syllabus', function(req, res) { 
    res.send('Viewed uploaded syllabus');
});

Senfaculty.get('/viewSyllabus/comments', function(req, res) { 
    res.send('Viewed syllabus comments');
});

Senfaculty.put('/add/syllabus/comments', function(req, res) { 
    res.send('added syllabus comments');
});

Senfaculty.put('/reply/syllabus/comments', function(req, res) { 
    res.send('replied syllabus comments');
});

Senfaculty.delete('/delete/syllabus/comments', function(req, res) { 
    res.send('deleted syllabus comments');
});

Senfaculty.post('/send/syllabus', function(req, res) { 
    res.send('Syllabus Sent');
});

module.exports = Senfaculty;
