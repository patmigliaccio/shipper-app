'use strict';

var express = require("express");
var path    = require("path");

var app = express();

//TODO LOAD IN ASSETS

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(1337);

console.log('Server running at http://localhost:1337/');