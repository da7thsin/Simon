var Player = function(){
  this.turn = false;
  this.pattern = [];
};



var Game = function(player){
  var self = this;

  self.start = function(player){
    self.intervalID = setInterval(function(){
      self.init(player);
    }, self.pace);
  }

  self.restart = function(player){

  }

  self.stop = function(player){

  }

};

Game.prototype = {
  started: false,
  on: false,
  strict: false,
  turn: true,
  intervalID: 0,
  pattern: [],
  pace: 900,


  init: function(player){

  },

  createPattern: function(player){
    var self = this;

    if(self.turn && self.pattern.length <= 20){

    }
    else{
      self.stop(player);
    }

  }
}


var events = function(){
  var player = new Player();
  var simon = new Game(player);

  function checkPattern(game, player){
    var gamePattern = game.pattern.join('');
    var playerPattern = player.pattern.join('');

    if(gamePattern == playerPattern){
      console.log("correct pattern");
    }
    else{
      if(game.strict){
        game.restart();
      }
    }
  }


  $('.color').mousedown(function(){
    if(player.turn){
      $(this).addClass('active');
      checkPattern(simon, player);
    }
  });


  $('.color').mouseup(function(){
    if(player.turn){
      $(this).removeClass('active');
    }
  });


  $('.start').click(function(){
    // console.log("start has been pressed");
  });


  $('.strict').click(function(){
    // console.log("strict has been pressed");
  });


  $('.power').click(function(){
    var state = $('.state');

    state.toggleClass('off');
    state.toggleClass('on');
    $('.color, .screen').toggleClass('active');

    if(state.hasClass('off')){
      simon.on = false;
    }else if(state.hasClass('on')){
      simon.on = true;
    }
  });

};

$(document).ready(function(){
  events();
});
