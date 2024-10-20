const express = require('express');
const Senfaculty = express.Router();
const { students } = require('../../exampleDB');  


Senfaculty.get('/view/uploaded/Syllabus/SN.FCT', function(req, res) { 
    res.send('Viewed uploaded syllabus');
});

Senfaculty.get('/viewSyllabus/comments/SN.FCT', function(req, res) { 
    res.send('Viewed syllabus comments');
});

Senfaculty.put('/add/syllabus/comments/SN.FCT', function(req, res) { 
    res.send('added syllabus comments');
});

Senfaculty.put('/reply/syllabus/comments/SN.FCT', function(req, res) { 
    res.send('replied syllabus comments');
});

Senfaculty.delete('/delete/syllabus/comments/CITL', function(req, res) { 
    res.send('deleted syllabus comments');
});

module.exports = Senfaculty;
