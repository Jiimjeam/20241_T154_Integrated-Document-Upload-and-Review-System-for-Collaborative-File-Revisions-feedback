const express = require ('express');
const app = express();
const  students  = require('./exampleDB'); 

const instructorRoute = require('./routes/INTR/instructor')
const formsRoute = require('./routes/forms')
const SenfacultyRoute = require('./routes/SN.FCT/Seniorfaculty')
const CITLRoute = require('./routes/CITL/CITL')

app.use('', instructorRoute);
app.use('', formsRoute);
app.use('', SenfacultyRoute);
app.use('', CITLRoute);


app.listen(2000, () => {
    console.log("Server is running on port 2000")
});
 