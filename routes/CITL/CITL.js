const express = require('express');
const CITL = express.Router();
const { students } = require('../../exampleDB');  


CITL.get('/view/uploaded/Syllabus', function(req, res) { 
    res.send('Viewed uploaded syllabus');
});

CITL.get('/viewSyllabus/comments', function(req, res) { 
    res.send('Viewed syllabus comments');
});

CITL.put('/add/syllabus/comments', function(req, res) { 
    res.send('added syllabus comments');
});

CITL.put('/reply/syllabus/comments', function(req, res) { 
    res.send('replied syllabus comments');
});

CITL.delete('/delete/syllabus/comments', function(req, res) { 
    res.send('deleted syllabus comments');
});

module.exports = CITL;
