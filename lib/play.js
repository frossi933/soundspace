var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var EventEmitter = require('events').EventEmitter;

var audioOpts = {
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  mode: lame.STEREO
}

var Player = new function(){

  this.eventEmitter = new EventEmitter();
  this.speaker = null;
  this.playing = false;
  this.current = '';
  this.list = [];
  this.index = 0;

  this.indexInc = function(){
    if(this.index == this.list.length-1)
      this.index = 0;
    else
      this.index++;
  }

  this.indexDec = function(){
    if(this.index == 0)
      this.index = this.list.length-1;
    else
      this.index--;
  }

  this.getIndex = function(){
    return this.index;
  }

  this.add = function(name, time){

    if(!this.list && this.list["name"].indexOf(name) >= 0)
      return;

    this.list.push({ name : name , time : time });
    this.eventEmitter.emit("listUpdated");
  }

  this.prev = function(){
    this.pause();
    this.indexDec();
    this.play()
  }

  this.next = function(){
    this.pause();
    this.indexInc();
    this.play();
  }

  this.play = function(){
    var player = this;
    var speaker = new Speaker(audioOpts);
    var decoder = lame.Decoder(2, 44100, 16);

    if(player.playing || player.list.length == 0)
      return

    var song = player.list[player.index].name;
    console.log(this.list);
    //console.log(song);
    player.playing = true;
    player.current = song;

    console.log('playing '+song);

    var songStream = fs.createReadStream(song);

    songStream.on('end', function(){
      player.next();
    }).on('close',function(err){
      console.log("closing song stream");
    });

    songStream.pipe(decoder)
      .on('format', function (format) {
        this.pipe(speaker);
        player.speaker = speaker;
      });
  }

  this.pause = function(){
    if(!this.playing || !this.speaker)
      return;

    this.speaker.close();
    this.speaker = null;
    this.playing = false;
    this.current = '';
  }

  this.playlist = function(){
    return this.list;
  }
}

module.exports = Player;
