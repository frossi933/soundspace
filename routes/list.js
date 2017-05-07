var express = require('express');
var player = require('../lib/play.js');

var router = express.Router();

router.get('/', function(req, res){
  res.send(JSON.stringify(player.playlist()));
});

router.post('/', function(req, res) {

  console.log(req.body);
  player.add('songs/'+req.body.name, req.body.time);
  res.send("ok");
});


module.exports = router;
