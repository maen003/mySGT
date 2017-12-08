const express = require('express');
const credentials = require('./mysql_credentials.js');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const webserver = express();
webserver.use(bodyParser.urlencoded({ extended: false }));
webserver.use( bodyParser.json() );

webserver.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

webserver.post('/students',function(req, res){
    const connection = mysql.createConnection(credentials);

    connection.connect(() => {
        console.log(arguments);
        connection.query(
            `SELECT * FROM students`, function(err, results, fields){
                console.log('query has finished', connection);
                const output = {
                    success: true,
                    data: results
                };
                res.end(JSON.stringify(output));
            });
        console.log('query has started')
    });
    console.log('got a user request????');
    //res.end('got a user request!!!!!');
});

// webserver.post('/add_students',function(req, res){
//     console.log(req.body.name);
//
//     console.log("DATA RECEIVEDDDDD!!!!");
//     const connection = mysql.createConnection(credentials);
//
//     connection.connect(() => {
//         console.log(arguments);
//         connection.query(
//             `INSERT INTO students SET name = '${req.body.name}', course = '${req.body.course}', grade = '${req.body.grade}'`, function(err, results, fields){
//                 console.log('query has finished', connection);
//                 const output = {
//                     success: true,
//                     data: results
//                 };
//                 res.end(JSON.stringify(output));
//             });
//         console.log('query has started')
//     });
//     console.log('got a user request????');
//     //res.end('got a user request!!!!!');
// });
//
// webserver.post('/delete_students',function(req, res){
//     console.log(req.body.name);
//
//     console.log("Data is being received!!!!");
//     const connection = mysql.createConnection(credentials);
//
//     connection.connect(() => {
//         console.log(arguments);
//         connection.query(
//             `DELETE FROM students WHERE id = '${req.body.student_id}'`, function(err, results, fields){
//                 console.log('query has finished', connection);
//                 const output = {
//                     success: true,
//                     data: results
//                 };
//                 res.end(JSON.stringify(output));
//             });
//         console.log('query has started')
//     });
//     console.log('got a user request????');
//     //res.end('got a user request!!!!!');
// });


webserver.listen(4000,function(){
    console.log('the server is started');
});