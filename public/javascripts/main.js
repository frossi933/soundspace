$(function() {

  var playing = false;

  $.ajax({
    url : '/songs'
  }).done(function(data){
    var lista = $("#list");
    lista.empty();
    var songs = JSON.parse(data);
    songs.forEach(function(song){
      var li = $("<li class='song-entry'>"+song+"</li>");
      li.on("click", { name : song }, function(event){
        console.log(event);
        PlaySong(event.data.name);
      }).appendTo(lista);

      AddSong(song);
    });
  }).fail(function(){
    console.log("error recuperando canciones");
  });

  $("#bt_play").click(function(){
    PlaySong();
  });

  $("#bt_pause").click(function(){
    StopSong();
  });

  $("#bt_next").click(function(){
    NextSong();
  });


  var PlaySong = function(){
    $.ajax({
      url : '/player/play'
    });

    playing = true;
  }

  var AddSong = function(songName){
    $.post('/list', { name : songName });
    console.log(songName + ' added to playlist');
  }

  var StopSong = function(){
    $.ajax({
      url : '/player/pause'
    });

    playing = false;
  }

  var NextSong = function(){
    $.ajax({
      url : '/player/next'
    });
  }
});
