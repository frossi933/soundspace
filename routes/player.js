var express = require('express');
var player = require('../lib/play.js');

var router = express.Router();


router.get('/play', function(req, res){
  player.play();
  res.send(player.getIndex().toString());
});

router.get('/pause', function(req, res){
  player.pause();
  res.send(player.getIndex().toString());
});

router.get('/next', function(req, res){
  player.next();
  res.send(player.getIndex().toString());
});

router.get('/prev', function(req, res){
  player.prev();
  res.send(player.getIndex().toString());
});

module.exports = router;
