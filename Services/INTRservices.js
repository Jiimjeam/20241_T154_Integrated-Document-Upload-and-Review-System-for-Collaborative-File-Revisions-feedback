
const students = require('../exampleDB');

function viewSyllabus (req, res) { 
    res.status(200).send({
        "meesage": "Students Retreived Successfully",
        "data": students
    });
}


module.exports = {viewSyllabus};