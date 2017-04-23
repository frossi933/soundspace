var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

var audioOpts = {
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  mode: lame.STEREO
}

var Player = new function(){

  this.speaker = null;
  this.playing = false;
  this.current = '';
  this.queue = [];

  this.add = function(song){
    if(this.queue.indexOf(song) >= 0)
      return;

    this.queue.push(song);
  }

  this.next = function(){

    this.pause();
    this.queue = this.queue.slice(1);
    this.play();
  }

  this.play = function(){

    var player = this;
    var speaker = new Speaker(audioOpts);
    var decoder = lame.Decoder(2, 44100, 16);

    if(player.playing || player.queue.length == 0)
      return

    var song = player.queue[0];
    player.playing = true;
    player.current = song;

    console.log('playing '+song);

    fs.createReadStream(song)
      .pipe(decoder)
      .on('format', function (format) {
        this.pipe(speaker);

        speaker.on('close', function(){
          console.log('next...')
          //player.next();
        });

        player.speaker = speaker;
      });
  }

  this.pause = function(){
    if(!this.playing || !this.speaker)
      return;

    this.speaker.end();
    this.playing = false;
    this.current = '';
  }

  this.list = function(){
    return this.queue;
  }
}

module.exports = Player;
