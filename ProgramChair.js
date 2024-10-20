const express = require('express');
const programChair = express.Router();
const { students } = require('../../exampleDB');  


programChair.get('/view/uploaded/Syllabus/PRCR', function(req, res) { 
    res.send('Viewed uploaded syllabus');
});

programChair.get('/viewSyllabus/comments/PRCR', function(req, res) { 
    res.send('Viewed syllabus comments');
});

programChair.put('/add/syllabus/comments/PRCR', function(req, res) { 
    res.send('added syllabus comments');
});

programChair.put('/reply/syllabus/comments/PRCR', function(req, res) { 
    res.send('replied syllabus comments');
});

programChair.delete('/delete/syllabus/comments/CITL', function(req, res) { 
    res.send('deleted syllabus comments');
});

module.exports = programChair;
