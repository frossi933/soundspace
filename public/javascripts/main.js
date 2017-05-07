$(function() {

  const COMMANDS = ["play","pause","next","prev"];
  var toAdd = [];

  $("#file").change(function(event){
    $("#form").submit();
  })

  $("#bt_modal").click(function(){
    var list = $(".modal-body ul");
    list.empty();

    $.ajax({
      url : '/songs'
    }).done(function(data){

      var songs = JSON.parse(data);
      songs.forEach(function(song, index){
        var li = $("#itemToAdd").clone();

        li.attr("id","itemToAdd"+index);
        li.prepend($("<span>"+song.name+"</span>"));
        li.find("input[type='checkbox']").attr("value",index.toString());
        li.removeClass("hidden");

        li.appendTo(list);
      });

      $('#addingModal').trigger('listReady');

    }).fail(function(){
      console.log("error recuperando canciones");
    });
  });

  $('#addingModal').on('listReady',function(){
    $("input.Checkbox").click(function(){
      if(this.checked){
        toAdd.push(this.value);
      } else {
        toAdd.delete(this.value);
      }
    })
  });

  $("#bt_add").click(function(){
    var list = $(".modal-body ul").children();
    toAdd.forEach(function(value){
      AddSong($(".modal-body ul span").eq(value).html(), 100);
    });

    toAdd = [];
    LoadPlaylist();
  });

  $("#bt_play").click(function(){
    PlayerCmd("play");
  });

  $("#bt_pause").click(function(){
    PlayerCmd("pause");
  });

  $("#bt_next").click(function(){
    PlayerCmd("next");
  });

  $("#bt_prev").click(function(){
    PlayerCmd("prev");
  });

  var LoadPlaylist = function(){
    $.ajax({
      url: '/list'
    }).done(function(data){
      var list = $("#list");
      list.empty();
      
      var songs = JSON.parse(data);
      songs.forEach(function(song, index){
        var li = $("#item").clone();

        console.log(song);
        li.attr("id","item"+index);
        li.find(".Name").html(song.name);
        li.find(".Time").html(song.time);
        li.removeClass("hidden");

        li.appendTo(list);
      });
    }).fail(function(){
      console.log("error recuperando lista de reproduccion");
    });
  }

  var AddSong = function(songName, songTime){
    $.post('/list', { name : songName , time : songTime });
  }

  var IsValid = function(str){
    return COMMANDS.indexOf(str) >= 0;
  }

  var PlayerCmd = function(cmd){
    if(IsValid(cmd))
      $.ajax({
        url : '/player/'+cmd,
        success : function(data){
          UpdateCurrent(data);
        }
      });
    else
      console.log("Invalid command "+cmd);
  }

  var UpdateCurrent = function(index){
    var all = $("#list li");
    all.removeClass("active");
    var item = $("#item"+index);
    item.addClass("active");
  }
});
