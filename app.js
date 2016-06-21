var express=require('express');
var https=require('https');
var app=express();
var favicon = require('serve-favicon');

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon1.ico'));

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/views/index.html" );
});

app.get('/topstories', function (req, res) {
  https.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',function(response){
    response.setEncoding('utf8');
    response.on('error',console.error);
    response.on('data',function(data){
      res.send(data);
    });
  });
});


var server = app.listen(3000, function () {
  console.log('Up and Running ........ ');
});
