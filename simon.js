var Player = function(){
  this.turn = false;
  this.pattern = [];
};



var Game = function(player){
  var self = this;

  self.start = function(){
    player.turn = false;

    self.turn = true;
    self.started = true;
    self.addPattern = true;
    self.createPattern(player);
  }

  self.restart = function(){
    player.turn = false;
    self.turn = true;

    if(self.strict){
      self.pattern = [];
      self.addPattern = true;
      self.createPattern(player);
    }
    else{
      self.createPattern(player);
    }
  }

  self.stop = function(){
    helper.timeoutIDs.forEach(function(id){
      clearTimeout(id);
    })

    player.pattern = [];
    player.turn = false;

    self.pattern = [];
    self.turn = false;

    self.started = false;
  }

};

Game.prototype = {
  started: false,
  on: false,
  strict: false,
  addPattern: false,
  turn: false,
  pattern: [],
  pace: 1100,

  createPattern: function(player){
    var colors = [".green", ".red", ".yellow", ".blue"];
    var randomIndex = Math.floor(Math.random() * colors.length);
    var randomColor = colors[randomIndex];

    var self = this;
    var index = 0;

    switch(self.pattern.length){
      case 5:
        self.pace = 1000;
        break;
      case 10:
        self.pace = 900;
        break;
      case 15:
        self.pace = 750;
        break;
    }


    if(self.addPattern){
      self.pattern.push(randomColor);
      self.addPattern = false;
    }

    if(self.turn){
      if(self.pattern.length <= 20){

        helper.loopArrayDelay(function(color){
          self.lightUp(color);
        }, self, player, self.pattern, index, self.pace);

      }
      else{
        self.stop();
      }
    }

  },

  lightUp: function(color){
    var self = this;

    if(self.on){
      switch(color){
        case ".green":
          $(color).addClass('active');
          sound.a.play();
        break;
        case ".red":
          $(color).addClass('active');
          sound.b.play();
        break;
        case ".yellow":
          $(color).addClass('active');
          sound.c.play();
        break;
        case ".blue":
          $(color).addClass('active');
          sound.d.play();
        break;
      }

      setTimeout(function(){
        if(self.started){
          $(color).removeClass('active');
        }
      }, this.pace - 200);
    }
    else{
      $(color).removeClass('active');
    }

  }
}




var helper = {
  timeoutIDs: [],

  loopArrayDelay: function(callback, game, player, array, index, delay){
    var self = this;

    self.timeoutIDs.push(
      setTimeout(function(){
        helper.screenContent(helper.prependZero(array.length));
        callback(array[index]);
        index++;

        if(index < array.length){
          self.loopArrayDelay(callback, game, player, array, index, delay);
        }
        else{
          setTimeout(function(){
            game.turn = false;
            player.pattern = [];
            player.turn = true;
          }, 700);
        }

      }, delay)
    );

  },

  checkPattern: function(game, player){
    var gamePattern = game.pattern;
    var playerPattern = player.pattern;
    var playerLastIndex = playerPattern.length -1;


    if(playerPattern[playerLastIndex] != gamePattern[playerLastIndex]){
      helper.screenContent("!!");
      sound.error.play();
      setTimeout(game.restart, 500);
    }
    else if(playerPattern.length == gamePattern.length && playerPattern[playerLastIndex] == gamePattern[playerLastIndex]){
      setTimeout(game.start, 400);
    }

  },

  screenContent: function(message){
    $('.screen').text(message);
  },

  prependZero: function(num){
    if(num < 10){
      return "0" + num;
    }

    return num;
  }

}




var sound = {
  a: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  b: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  c: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
  d: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
  error: new Audio('http://www.freesound.org/data/previews/171/171494_2437358-lq.mp3')
}





var events = function(){
  var player = new Player();
  var game = new Game(player);


  $('.color').mousedown(function(){
    var color = $(this);

    if(player.turn){

      color.addClass('active');

      if(color.hasClass('green')){
        sound.a.play();
        player.pattern.push('.green');
      }
      else if(color.hasClass('red')){
        sound.b.play();
        player.pattern.push('.red');
      }
      else if(color.hasClass('yellow')){
        sound.c.play();
        player.pattern.push('.yellow')
      }
      else if(color.hasClass('blue')){
        sound.d.play();
        player.pattern.push('.blue');
      }

      helper.checkPattern(game, player);
    }
  });

  $('.color').mouseup(function(){
    $(this).removeClass('active');
  });

  $('.start').click(function(){
    if(game.on){
      if(!game.started){
        $(".indicator",this).addClass('active');
        $('.color').removeClass('active');
        game.start();
      }
      else{
        helper.screenContent("__");
        $(".indicator",this).removeClass('active');
        game.stop();
        $('.color').addClass('active');
      }
    }
  });


  $('.strict').click(function(){
    if(!game.started && game.on){
      if(!game.strict){
        $(".indicator",this).addClass('active');
        game.strict = true;
      }
      else{
        $(".indicator",this).removeClass('active');
        game.strict = false;
      }
    }

  });


  $('.power').click(function(){
    var state = $('.state');

    if(state.hasClass('off')){
      $('.color, .screen').addClass('active');
      state.removeClass('off');
      state.addClass('on');
      game.on = true;
    }
    else if(state.hasClass('on')){
      $('.color, .screen, .indicator').removeClass('active');
      helper.screenContent("__");

      state.removeClass('on');
      state.addClass('off');

      game.stop();
      game.on = false;
      game.strict = false;
    }
  });

};

$(document).ready(function(){
  events();
});
