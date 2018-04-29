//Global variables
$(document).ready(function() {

//Array of Playable Characters
var characters = {
    "ryu": {
        "name": "ryu",
        "health": 200,
        "attack": 18,
        "enemyAttackBack": 25,
        "imageUrl": "assets/images/ryu1-photo.jpg",
        "fighterImgUrl": "assets/images/ryu-left.gif",
        "defenderImgUrl":  "assets/images/ryu-right.gif"
        
    }, 
    "ken": {
        "name": "ken",
        "health": 200,
        "attack": 24,
        "enemyAttackBack": 25,
        "imageUrl": "assets/images/ken1-photo.jpg",
        "fighterImgUrl": "assets/images/ken-left.gif",
        "defenderImgUrl":  "assets/images/ken-right.gif"
        
    }, 
    "guile": {
        "name": "guile",
        "health": 200,
        "attack": 8,
        "enemyAttackBack": 10,
        "imageUrl": "assets/images/guile1-photo.jpg",
        "fighterImgUrl": "assets/images/guile-left.gif",
        "defenderImgUrl":  "assets/images/guile-right.gif"
        
    }, 
    "zangief": {
        "name": "zangief",
        "health": 200,
        "attack": 7,
        "enemyAttackBack": 5,
        "imageUrl": "assets/images/zangief1-photo.gif",
        "fighterImgUrl": "assets/images/zangief-left.gif",
        "defenderImgUrl":  "assets/images/zangief-right.gif"
        
    }
};

var currFighter;
var currDefender;
var nextEnemy = [];
var indexofSelChar;
var attackResult;
var turnCounter = 1;
var killCount = 0;
//Define the audio clips
var gameOver = new Audio('assets/audio/gameOver.mp3');
var lostSound = new Audio('assets/audio/lostSound.mp3');
var hadouken = new Audio('assets/audio/hadouken.mp3');
var playerSound = new Audio('assets/audio/playerSound.mp3');
var background = new Audio('assets/audio/background.mp3');




function  printAllinOne(character, renderArea, makeChar) {
    //character: obj, renderArea: class/id, makeChar: string
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    if (renderArea == '#fighter') {
      var charImage = $("<img alt='image' class='character-image img-fluid rounded'>").attr("src", character.fighterImgUrl); 

    var powerBarHolder = $("<div class='power-bar-holder'>");  
    var powerBar = $("<div class='power-bar' id='bar1'>").each(function(){
      var percentage = parseInt(character.health)/200*100;
        if(percentage > 0){
  
          $(this).animate({'width':''+ percentage +'%'}, 'slow');
          $(powerBarHolder).add(this);
          console.log(character.name + "   Health : " + percentage);
          
        }else{
         
          $(this).css({'color':'black', 'background':'none'}, 'slow');
          console.log(character.name + "   Health : " + percentage);
        
        }
       
      });
      
    } else if (renderArea == '#defender' ) {
      var charImage = $("<img alt='image' class='character-image img-fluid rounded'>").attr("src", character.defenderImgUrl);
      var powerBarHolder = $("<div class='power-bar-holder'>");  
      var powerBar = $("<div class='power-bar' id='bar2'>").each(function(){
       
        var percentage = parseInt(character.health)/200*100;
        if(percentage > 0){

          $(this).animate({'width':''+ percentage +'%'}, 'slow');
       
          console.log(character.name + "   Health : " + percentage);
     
        }else{
          console.log(character.name + "   Health : " + percentage);
          $(this).css({'color':'black', 'background':'none'}, 'slow');
          
        }
        
      });
      
    } else {
      var charImage = $("<img alt='image' class='character-image img-fluid rounded'>").attr("src", character.imageUrl);
    }
    
    var charHealth = $("<div class='character-health'>").text(character.health);
    var powerBarDiv = $(powerBarHolder).append(powerBar);
    //Put all the elements together into the Character Div.
   charDiv.append(charName).append(charImage).append(charHealth).append(powerBarDiv);
    $(renderArea).append(charDiv);
    //Capitalizes the first letter in characters name
    $('.character-name').css('textTransform', 'capitalize');
 
    if (makeChar == 'enemy') {
      $(charDiv).addClass('enemy');
    } else if (makeChar == 'defender') {
      currDefender = character;
      $(charDiv).addClass('target-enemy');
    }
  };

  // Create function to render game message to DOM
  function printMessage(message) {
    var gameMesageSet = $("#gameMessage");
    var newMessage = $("<div>").text(message);
    gameMesageSet.append(newMessage);

    if (message == 'clearMessage') {
      gameMesageSet.text('');
    }
  };

  function printCharacters(charObj, areaRender) {
    //render all characters on the first page
    if (areaRender == '#characters-section') {
      $(areaRender).empty();

      //For ....in Statment iterates over the enumerable properties of character array
      for (var property in charObj) {
        printAllinOne(charObj[property], areaRender, '');
      }

    }
    //render player character
    if (areaRender == '#fighter') {
      $('#fighter').prepend("Your Character");       
      printAllinOne(charObj, areaRender, '');
      $('#attack-button').css('visibility', 'visible');
      $('#fight-section').css('visibility', 'visible');
      $('#gameMessage').css('visibility', 'visible');
      
    }
    //Print the next enemy
    if (areaRender == '#nextEnemy-section') {
        $('#nextEnemy-section').prepend("Enemies Available To Attack");      
      for (var i = 0; i < charObj.length; i++) {

        printAllinOne(charObj[i], areaRender, 'enemy');
      }
      //render one enemy to defender area
      $(document).on('click', '.enemy', function() {
        //select an combatant to fight
        name = ($(this).data('name'));
        //if defernder area is empty
        if ($('#defender').children().length === 0) {
          printCharacters(name, '#defender');
          
          $(this).hide();
          printMessage("clearMessage");
        }
      });
    }
    //render defender
    if (areaRender == '#defender') {
      $(areaRender).empty();
      
      for (var i = 0; i < nextEnemy.length; i++) {
        //add enemy to defender area
        if (nextEnemy[i].name == charObj) {
          $('#defender').append("Defender")
          printAllinOne(nextEnemy[i], areaRender, 'defender');
          playerSound.play();
        }
      }
    }
    //re-render defender when attacked
    if (areaRender == 'playerDamage') {
      $('#defender').empty();
      $('#defender').append("Defender")
      printAllinOne(charObj, '#defender', 'defender');
      hadouken.play();
    }
    //re-render player character when attacked
    if (areaRender == 'enemyDamage') {
      $('#fighter').empty();
      $('#fighter').prepend("Your Character");
      printAllinOne(charObj, '#fighter', '');
    }
    //render defeated enemy
    if (areaRender == 'enemyDefeated') {
      $('#defender').empty();
      var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
      printMessage(gameStateMessage);
      lostSound.play();
    }
  };

//Restarts the game - renders a reset button
function restartGame(inputEndGame) {
  //When 'Restart' button is clicked, reload the page.
  var restart = $('<button class="btn btn-danger">Restart</button>').click(function() {
    location.reload();
   
  });
  var gameState = $("<div>").text(inputEndGame);
  $("#gameMessage").append(gameState);
  $("#gameMessage").after(restart);
};



  //Main Program
  //this is to render all characters for user to choose their computer
  printCharacters(characters, '#characters-section');
  //Play the background music
  background.play();  

  $(document).on('click', '.character', function() {
    name = $(this).data('name');
  
    //only when no player char has been selected (Load the next enemy array on the first time)
    if (!currFighter) {
    
      currFighter = characters[name];

      //For ....in Statment iterates over the enumerable properties of character array
      for (var property in characters) {
        if (property != name) {
          nextEnemy.push(characters[property]);
        }
      }

      
      $("#characters-section").hide();
      printCharacters(currFighter, '#fighter');
      //this is to render all characters for user to choose fight against
      printCharacters(nextEnemy, '#nextEnemy-section');
      playerSound.play();
    
    }
    
  });

 
  // Load the following function when attack button on Click
  $("#attack-button").on("click", function() {
    //if defernder area has enemy
    if ($('#defender').children().length !== 0) {
      //defender state change
      var attackMessage = "You attacked " + currDefender.name + " for " + (currFighter.attack * turnCounter) + " damage.";
      printMessage("clearMessage");
      
      
      //calculate the Health Point for defender
      currDefender.health = currDefender.health - (currFighter.attack * turnCounter);

      //win condition
      if (currDefender.health > 0) {
        //enemy not dead keep playing
        printCharacters(currDefender, 'playerDamage');
        //player state change
        var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
        printMessage(attackMessage);
        printMessage(counterAttackMessage);
        
        //calculate the Health Point for Fighter  
        currFighter.health = currFighter.health - currDefender.enemyAttackBack;
        printCharacters(currFighter, 'enemyDamage');
        if (currFighter.health <= 0) {
          printMessage("clearMessage");
          restartGame("You have been defeated...GAME OVER!!!");
          gameOver.play();
          $("#attack-button").unbind("click");
          $('#nextEnemy-section').text(" ");
         
          
        }
      } else {
        printCharacters(currDefender, 'enemyDefeated');
        killCount++;
        if (killCount >= 3) {
          printMessage("clearMessage");
          restartGame("You Won!!!! GAME OVER!!!");
          gameOver.play();
          $('#nextEnemy-section').text(" ");
         }
      }
      turnCounter++;
    } else {
      printMessage("clearMessage");
      printMessage("No enemy here.");
      playerSound.play();
    }
  });

});