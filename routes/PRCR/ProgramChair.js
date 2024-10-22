const express = require('express');
const programChair = express.Router();
const { students } = require('../../exampleDB');  


programChair.get('/view/uploaded/Syllabus/PRCR', function(req, res) { 
    res.send('Viewed uploaded syllabus');
});

programChair.get('/viewSyllabus/comments/PRCR', function(req, res) { 
    res.send('Viewed syllabus comments');
});

programChair.put('/add/syllabus/comments', function(req, res) { 
    res.send('added syllabus comments');
});

programChair.put('/reply/syllabus/comments', function(req, res) { 
    res.send('replied syllabus comments');
});

programChair.delete('/delete/syllabus/comments', function(req, res) { 
    res.send('deleted syllabus comments');
});

programChair.post('/send/syllabus', function(req, res) { 
    res.send('Syllabus Sent');
});

module.exports = programChair;
