const express = require('express');
const forms = express.Router();
const { students } = require('../exampleDB');  


forms.post('/Register', function(req, res) { 
    res.send('Resgister successfull');
});

forms.get('/Login', function(req, res) { 
    res.send('Login successfully');
});

module.exports = forms;
