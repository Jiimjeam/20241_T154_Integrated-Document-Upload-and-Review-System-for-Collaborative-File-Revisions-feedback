const express = require('express');
const CITL = express.Router();
const { students } = require('../../exampleDB');  


CITL.get('/view/uploaded/Syllabus/CITL', function(req, res) { 
    res.send('Viewed uploaded syllabus');
});

CITL.get('/viewSyllabus/comments/CITL', function(req, res) { 
    res.send('Viewed syllabus comments');
});

CITL.put('/add/syllabus/comments/CITL', function(req, res) { 
    res.send('added syllabus comments');
});

CITL.put('/reply/syllabus/comments/CITL', function(req, res) { 
    res.send('replied syllabus comments');
});

CITL.delete('/delete/syllabus/comments/CITL', function(req, res) { 
    res.send('deleted syllabus comments');
});

module.exports = CITL;
