var path = require('path');
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var htmlPath = path.join(__dirname, 'build');

app.use(express.static(htmlPath));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

var server = app.listen(port, function () {
    var host = 'localhost';
    var port = server.address().port;
    console.log('listening on http://'+host+':'+port+'/');
});
