/*
The two extension used are sound and platforms. I have added advanced graphics with particles. The sounds were interesting to implement and brought life to the game. However, the sounds were not simple to implement as while putting sound in the draw function the code was giving error. Similarly the hardest part was to put the falling sound for the panda as the sound would loop on itself and the sound won’t stop. While putting the platforms, i was not able to make the panda jump on the platforms. The issue was of height of the platforms as i didn’t put the right values. When i placed coins on the platforms, my panda did not collect the coins while i walked over them but would collect when i jump on them, this was because my y values were correct in the "dist" function but my x values were wrong, It worked after i figured out the correct values. I learned from the bugs i had to fix while making particles, as i was unable to locate the particles and the code for particles was a little complicated to implement. However after implementing particles, my code worked perfect. I was able to put the position values accurately at the end of the code. I practiced with implementing different sounds and i worked on the theme of the game to give an immersive experience to the player.

*/

//Game Sounds
var backgroundSound;
var jumpSound;
var winningSound;
var coinSound;
var endgameSound;
var deadpandaSound;
//Game Position variables 
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var clouds;
//Game Objects 
var mountains;
var collectables;
var canyons;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var game_score;
var flagpole;
var lives;
var colour;
var isContact;
//Particle system variable
var emit;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    //Background Sound
    backgroundSound = loadSound('assets/back.wav');
    backgroundSound.setVolume(0.5);
    //Game Winning Sound
    winningSound = loadSound('assets/Whee.wav');
    winningSound.setVolume(0.5);
    //Character Jump Sound
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    //Collecting Coin Sound
    coinSound = loadSound('assets/Coins.wav');
    coinSound.setVolume(0.5);
    //Game over Sound
    endgameSound = loadSound('assets/endgamesound.wav');
    endgameSound.setVolume(0.5);
    //Falling panda in canyon sound
    deadpandaSound = loadSound('assets/deadpanda.wav');
    deadpandaSound.setVolume(0.5);
    
}


function setup()
{
    backgroundSound.loop();//Background sound looping 
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function draw()
{
    gameSound();

	background(100, 155, 255); // fill the sky blue
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    checkPlayerDie(); //checks if player falls in the canyon
    push();
    translate(scrollPos,0); 
    
    // Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
   
    // Draw trees.
    drawTrees();
     // Draw Platforms
     for(var i = 0; i < platforms.length; i++)
     {
         platforms[i].draw();
     }

	// Draw canyons.
    for(var i=0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }
         //Particle system 
    emit.updateParticles();

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
        {
            if(collectables[i].isFound == false)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                }
        }
    
    renderFlagpole();
    noStroke();
    fill(66,10,3);
    rect(1570,floorPos_y + 130, 160,30);
    pop();

	// Draw game character.
	
	drawGameChar();
    
    /////// Text on top Left
    stroke(0);
    strokeWeight(3);
    fill(255);
    textSize(20);
    text("Score: " + game_score, 20,20);
    stroke(0);
    strokeWeight(3);
    fill(255);
    textSize(20);
    text("Lives: ", 20,44);
    noStroke();
    strokeWeight(1)
    if(lives < 1)
        {
            //Code for Game over 
            fill(50, 0, 0, 200)
            rect(0, 0, width, height);
            stroke(200,0,0);
            fill(255, 255, 255);
            text("Game over. Press space to continue.", width/3, height/2);
            return;
        }
    if(flagpole.isReached)
        {
            //Game winning code 
            fill(160, 64, 237, 200)
            rect(0, 0, width, height);
            stroke(149, 40, 237);
            fill(255);
            text("Level complete. Press space to continue.", width/3,height/2);
            return;
        }
    ;
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
     if(gameChar_y < floorPos_y)
        {
             isContact = false; 
                for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                        {
                            isContact = true;
                            isFalling = false;
                            break;
                        }
                }
            if(isContact == false)
            {
                gameChar_y += 5;
                isFalling = true; 
            }
        }
    else 
        {
            isFalling = false;
        }
    if(isPlummeting)
        {
            gameChar_y += 0.5;
           
        }
    
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

    if(keyCode == 37)
        {
            console.log("left arrow");
            isLeft = true;
        }
    if(keyCode == 39)
            {
            console.log("right arorw");
            isRight = true;
            }
    if (keyCode == 32 && gameChar_y == floorPos_y)
        {
            console.log("space bar")
            gameChar_y -= 130;
            jumpSound.play();
        }
    if(isContact == true && keyCode == 32)
        {
            console.log("space bar")
            gameChar_y -= 170;
            jumpSound.play();
        }
    if(keyCode == 32 && lives == 0)
        {
            lives = 4;
            endgameSound.stop();
            backgroundSound.loop();
        }
    
    
    
	// keys are pressed.

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);

}

function keyReleased()
{

    if(keyCode == 37)
        {
            console.log("left arrow");
            isLeft = false;
        }
    else if(keyCode == 39 )
            {
            console.log("right arorw");
            isRight = false;
            }
      
	// keys are released.

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    	//the game character
    stroke(0);
    fill(0);
	if(isLeft && isFalling)
	{
        // add your jumping-left code
        ellipse(gameChar_x,gameChar_y-20,25,35);
        ellipse(gameChar_x-6,gameChar_y-6,8,20);
        ellipse(gameChar_x+6,gameChar_y-6,8,20);
        ellipse(gameChar_x+6,gameChar_y-28,25,8);//hands
        //whites
        stroke(0);
        fill(255);
        ellipse(gameChar_x-7,gameChar_y-18,15,23);//white belly
        ellipse(gameChar_x,gameChar_y-40,18,20);//face
        //Eyes
        fill(0);
        ellipse(gameChar_x-3,gameChar_y-44,5,6);//eyes
        ellipse(gameChar_x-7,gameChar_y-38,4,3);//nose
        ellipse(gameChar_x+4,gameChar_y-50,6,10);//ears
        fill(255);    
        ellipse(gameChar_x-4,gameChar_y-43,4,5);
        fill(0);
        ellipse(gameChar_x-5,gameChar_y-43,.5,1);


	}
	else if(isRight && isFalling)
	{
        // add your jumping-right code
        ellipse(gameChar_x,gameChar_y-20,25,35);
        ellipse(gameChar_x+6,gameChar_y-6,8,20);
        ellipse(gameChar_x-6,gameChar_y-6,8,20);
        ellipse(gameChar_x-6,gameChar_y-28,25,8);//hands

        //whites
        stroke(0);
        fill(255);
        ellipse(gameChar_x+7,gameChar_y-18,15,23);//white belly
        ellipse(gameChar_x,gameChar_y-40,18,20);//face
        
        //Eyes
        fill(0);
        ellipse(gameChar_x+3,gameChar_y-44,5,6);//eyes
        ellipse(gameChar_x+7,gameChar_y-38,4,3);//nose
        ellipse(gameChar_x-4,gameChar_y-50,6,10);//ears
        fill(255);    
        ellipse(gameChar_x+4,gameChar_y-43,4,5);
        fill(0);
        ellipse(gameChar_x+ 5,gameChar_y-43,.5,1);
	}
	else if(isLeft)
	{
        // add your walking left code
        fill(0);
        ellipse(gameChar_x,gameChar_y-20,25,35);
        ellipse(gameChar_x-6,gameChar_y-6,8,20);
        ellipse(gameChar_x+6,gameChar_y-6,8,20);
        //whites
        stroke(0);
        fill(255);
        ellipse(gameChar_x-7,gameChar_y-18,15,23);//white belly
        ellipse(gameChar_x,gameChar_y-40,18,20);//face
        //Eyes
        fill(0);
        ellipse(gameChar_x-3,gameChar_y-44,5,6);//eyes
        ellipse(gameChar_x-7,gameChar_y-38,4,3);//nose
        ellipse(gameChar_x+4,gameChar_y-50,6,10);//ears
        fill(255);    
        ellipse(gameChar_x-4,gameChar_y-43,4,5);
        fill(0);
        ellipse(gameChar_x-5,gameChar_y-43,.5,1);

	}
	else if(isRight)
	{
        // add your walking right code
        fill(0);
        ellipse(gameChar_x,gameChar_y-20,25,35);
        ellipse(gameChar_x+6,gameChar_y-6,8,20);
        ellipse(gameChar_x-6,gameChar_y-6,8,20);
        //whites
        stroke(0);
        fill(255);
        ellipse(gameChar_x+7,gameChar_y-18,15,23);//white belly
        ellipse(gameChar_x,gameChar_y-40,18,20);//face
        //Eyes
        fill(0);
        ellipse(gameChar_x+3,gameChar_y-44,5,6);//eyes
        ellipse(gameChar_x+7,gameChar_y-38,4,3);//nose
        ellipse(gameChar_x-4,gameChar_y-50,6,10);//ears
        fill(255);    
        ellipse(gameChar_x+4,gameChar_y-43,4,5);
        fill(0);
        ellipse(gameChar_x+ 5,gameChar_y-43,.5,1);

	}
	else if(isFalling || isPlummeting)
	{
        // add your jumping facing forwards code
        ellipse(gameChar_x,gameChar_y-20,25,35);
        ellipse(gameChar_x-8,gameChar_y-50,10,10);
        ellipse(gameChar_x+8,gameChar_y-50,10,10);
        ellipse(gameChar_x-6,gameChar_y-6,8,20);
        ellipse(gameChar_x+6,gameChar_y-6,8,20);
        ellipse(gameChar_x-6,gameChar_y-28,25,8);//legs
        ellipse(gameChar_x+6,gameChar_y-28,25,8);//legs
        //whites
        stroke(0);
        fill(255);
        ellipse(gameChar_x,gameChar_y-18,18,20);
        ellipse(gameChar_x,gameChar_y-40,18,20);
        //Eyes
        fill(0);
        ellipse(gameChar_x-3,gameChar_y-44,5,6);
        ellipse(gameChar_x+3,gameChar_y-44,5,6);
        ellipse(gameChar_x,gameChar_y-38,3,2);
        fill(255);    
        ellipse(gameChar_x-2,gameChar_y-43,4,5);
        ellipse(gameChar_x+2,gameChar_y-43,4,5);
        fill(0);
        ellipse(gameChar_x-2,gameChar_y-43,.5,1);
        ellipse(gameChar_x+2,gameChar_y-43,.5,1);
	}
	else
	{
		// add your standing front facing code
       ellipse(gameChar_x,gameChar_y-20,25,35);
       ellipse(gameChar_x-8,gameChar_y-50,10,10);
       ellipse(gameChar_x+8,gameChar_y-50,10,10);
       ellipse(gameChar_x-6,gameChar_y-6,8,20);//legs
       ellipse(gameChar_x+6,gameChar_y-6,8,20);//legs
       ellipse(gameChar_x-6,gameChar_y-28,25,8);//hands
       ellipse(gameChar_x+6,gameChar_y-28,25,8);//hands right
       //whites
       stroke(255);
       fill(255);
       ellipse(gameChar_x,gameChar_y-18,16,18);
       stroke(0);
       ellipse(gameChar_x,gameChar_y-40,18,20);
    
       //Eyes
       fill(0);
       ellipse(gameChar_x-3,gameChar_y-44,5,6);
       ellipse(gameChar_x+3,gameChar_y-44,5,6);
       ellipse(gameChar_x,gameChar_y-38,3,2);
       fill(255);    
       ellipse(gameChar_x-2,gameChar_y-43,4,5);
       ellipse(gameChar_x+2,gameChar_y-43,4,5);
       fill(0);
       ellipse(gameChar_x-2,gameChar_y-43,.5,1);
       ellipse(gameChar_x+2,gameChar_y-43,.5,1);
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
        {
              stroke(100,100,100)
              fill(235,255,255);
              ellipse(350-clouds[i].x_pos,80-clouds[i].y_pos,70+clouds[i].size,40+clouds[i].size);
              ellipse(400-clouds[i].x_pos,80-clouds[i].y_pos,70+clouds[i].size,40+clouds[i].size);
              ellipse(375-clouds[i].x_pos,70-clouds[i].y_pos,80+clouds[i].size,60+clouds[i].size);
              ellipse(700-clouds[i].x_pos,120-clouds[i].y_pos,70+clouds[i].size,40+clouds[i].size);
              ellipse(750-clouds[i].x_pos,150-clouds[i].y_pos,70+clouds[i].size,40+clouds[i].size);
              ellipse(725-clouds[i].x_pos,140-clouds[i].y_pos,80+clouds[i].size,60+clouds[i].size);
              ellipse(680-clouds[i].x_pos,145-clouds[i].y_pos,70+clouds[i].size,50+clouds[i].size);
              noStroke();
              ellipse(700-clouds[i].x_pos,130-clouds[i].y_pos,60+clouds[i].size,60+clouds[i].size);//EDC
              ellipse(760-clouds[i].x_pos,150-clouds[i].y_pos,30+clouds[i].size,30+clouds[i].size);//EDC
              ellipse(345-clouds[i].x_pos,80-clouds[i].y_pos,30+clouds[i].size,30+clouds[i].size);//EDC
              ellipse(405-clouds[i].x_pos,80-clouds[i].y_pos,30+clouds[i].size,30+clouds[i].size);//EDC
        }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
        {
            fill(5,161,158);
            noStroke();
            beginShape();// mountains A
            vertex(mountains[i].x_pos-500, mountains[i].y_pos+100);
            vertex(mountains[i].x_pos-350, mountains[i].y_pos-40-mountains[i].size);
            vertex(mountains[i].x_pos-200, mountains[i].y_pos+50-mountains[i].size);
            vertex(mountains[i].x_pos, mountains[i].y_pos+125-mountains[i].size);
            endShape();
            beginShape();
            vertex(mountains[i].x_pos-350,mountains[i].y_pos-40-mountains[i].size);
            vertex(mountains[i].x_pos-370,mountains[i].y_pos-20-mountains[i].size);
            vertex(mountains[i].x_pos-340,mountains[i].y_pos-mountains[i].size);
            endShape();
            beginShape();// mountains C
            vertex(mountains[i].x_pos,mountains[i].y_pos+120-mountains[i].size);
            vertex(mountains[i].x_pos+400,mountains[i].y_pos-20-mountains[i].size);
            vertex(mountains[i].x_pos+500,mountains[i].y_pos+100-mountains[i].size);
            vertex(mountains[i].x_pos+800,mountains[i].y_pos+180-mountains[i].size);
            endShape();
            beginShape();// mountains B
            vertex(mountains[i].x_pos-100,mountains[i].y_pos+120-mountains[i].size);
            vertex(mountains[i].x_pos+100,mountains[i].y_pos-mountains[i].size);
            vertex(mountains[i].x_pos+220,mountains[i].y_pos+150-mountains[i].size);
            endShape();
            // Mountains 3D Details
            fill(4, 89, 88)
            beginShape();
            vertex(mountains[i].x_pos-500,mountains[i].y_pos+200);
            vertex(mountains[i].x_pos-500,mountains[i].y_pos+99-mountains[i].size);
            vertex(mountains[i].x_pos+524,mountains[i].y_pos+150-mountains[i].size);
            vertex(mountains[i].x_pos+524,mountains[i].y_pos+200);
            endShape();
            beginShape();
            vertex(mountains[i].x_pos-500,mountains[i].y_pos+100);
            vertex(mountains[i].x_pos-350,mountains[i].y_pos-40-mountains[i].size);
            vertex(mountains[i].x_pos-370,mountains[i].y_pos-mountains[i].size);
            vertex(mountains[i].x_pos-340,mountains[i].y_pos+20-mountains[i].size);
            vertex(mountains[i].x_pos-380,mountains[i].y_pos+50-mountains[i].size);
            vertex(mountains[i].x_pos-280,mountains[i].y_pos+55-mountains[i].size);
            vertex(mountains[i].x_pos-235,mountains[i].y_pos+90-mountains[i].size);
            vertex(mountains[i].x_pos-102,mountains[i].y_pos+118-mountains[i].size);
            vertex(mountains[i].x_pos+100,mountains[i].y_pos-mountains[i].size);//
            vertex(mountains[i].x_pos+90,mountains[i].y_pos+20-mountains[i].size);
            vertex(mountains[i].x_pos+105,mountains[i].y_pos+35-mountains[i].size);
            vertex(mountains[i].x_pos+50,mountains[i].y_pos+60-mountains[i].size);
            vertex(mountains[i].x_pos+105,mountains[i].y_pos+80-mountains[i].size);
            vertex(mountains[i].x_pos+110,mountains[i].y_pos+100-mountains[i].size);
            vertex(mountains[i].x_pos+155,mountains[i].y_pos+66-mountains[i].size);
            vertex(mountains[i].x_pos+400,mountains[i].y_pos-20-mountains[i].size);
            vertex(mountains[i].x_pos+360,mountains[i].y_pos+20-mountains[i].size);
            vertex(mountains[i].x_pos+415,mountains[i].y_pos+50-mountains[i].size);
            vertex(mountains[i].x_pos+370,mountains[i].y_pos+80-mountains[i].size);
            vertex(mountains[i].x_pos+450,mountains[i].y_pos+100-mountains[i].size);
            vertex(mountains[i].x_pos+480,mountains[i].y_pos+150-mountains[i].size);
            vertex(mountains[i].x_pos-500,mountains[i].y_pos+100);
            endShape(); 
        }
}

// Function to draw trees objects.
function drawTrees()
{
        // Draw trees.
        for(var i = 0; i < trees_x.length; i++)
        {
              noStroke();       
              fill(3,94,49);
              ellipse(trees_x[i]+10,floorPos_y-80+110,100,40);
              fill(100,47,14);
              rect(trees_x[i],floorPos_y-80,20,100);
              stroke(204,0,102);
              fill(218,112,214);
              //TREE Leaves
              ellipse(trees_x[i],floorPos_y-80+30,50,50);
              ellipse(trees_x[i]-20,floorPos_y-80,80,70);
              ellipse(trees_x[i]-40,floorPos_y-80-30,80,80);
              ellipse(trees_x[i]-30,floorPos_y-80-50,80,100);
              ellipse(trees_x[i]-10,floorPos_y-80-70,80,90);
              ellipse(trees_x[i]+30,floorPos_y-80-70,60,70);
              ellipse(trees_x[i]+40,floorPos_y-80-50,80,70);
              ellipse(trees_x[i]+60,floorPos_y-80-30,70,60);
              ellipse(trees_x[i],floorPos_y-80,80,70);
              ellipse(trees_x[i]+40,floorPos_y-80+10,80,70);
              ellipse(trees_x[i]+40,floorPos_y-80+10,80,70);
              ellipse(trees_x[i]+40,floorPos_y-80+10,80,70);
              noStroke();
              ellipse(trees_x[i]+10,floorPos_y-80-30,120,120);
              //cherries
              fill(255,51,0);
              ellipse(trees_x[i]-50,floorPos_y-80-30,10,10);
              ellipse(trees_x[i]+40,floorPos_y-80+30,10,10);
              ellipse(trees_x[i]+20,floorPos_y-80-70,10,10);
         }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    
    fill(71,34,13);
    rect(t_canyon.x_pos,floorPos_y,t_canyon.width,200);
    fill(54,  26,  10);
    rect(t_canyon.x_pos + 10,floorPos_y,t_canyon.width - 20,200);
    fill(26,12,4);
    triangle(t_canyon.x_pos ,floorPos_y + 200,
             t_canyon.x_pos + t_canyon.width,floorPos_y + 200, 
             t_canyon.x_pos + t_canyon.width/2,floorPos_y );   //Detail to make the canyon get dark       
    noStroke();
}



// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && 
       gameChar_world_x < t_canyon.x_pos + t_canyon.width &&
       gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
        }
    if(isPlummeting == true)
        {
            gameChar_y += 5;
            
        }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
          stroke(78, 230, 222);
          fill(181, 255, 251);
          rect(t_collectable.x_pos - 14,t_collectable.y_pos - 14,
               t_collectable.size + 8,t_collectable.size + 8);
    
          triangle(t_collectable.x_pos + t_collectable.size,t_collectable.y_pos,
                   t_collectable.x_pos - t_collectable.size,t_collectable.y_pos,
                   t_collectable.x_pos,t_collectable.y_pos + t_collectable.size);
          triangle(t_collectable.x_pos + t_collectable.size,t_collectable.y_pos,
                   t_collectable.x_pos - t_collectable.size,t_collectable.y_pos,
                   t_collectable.x_pos,t_collectable.y_pos-t_collectable.size);
          fill(78, 230, 222);

          ellipse(t_collectable.x_pos,t_collectable.y_pos,
                  t_collectable.size,t_collectable.size);
          
    
          
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
     if(dist( t_collectable.x_pos  , t_collectable.y_pos + t_collectable.size,
             gameChar_world_x,gameChar_y) < t_collectable.size)
        {
           t_collectable.isFound = true;
           game_score += 1;
           coinSound.play();
        }
    
}
//Code to implement background sound
function gameSound()
{
    if(lives == 1 && isPlummeting == true)
        {
            backgroundSound.stop();
            endgameSound.loop();    
        }
}

function renderFlagpole()
//function to draw flagpole 
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y ,
         flagpole.x_pos, floorPos_y - 250);
    noStroke();
    fill(200,25,25);
    if(flagpole.isReached)
        {
            rect(flagpole.x_pos,floorPos_y - 250,50,50); 
            triangle(flagpole.x_pos + 80,floorPos_y - 225,
                     flagpole.x_pos + 50,floorPos_y - 200,
                     flagpole.x_pos + 50,floorPos_y - 250);
        }
    else
        {
            rect(flagpole.x_pos,floorPos_y - 40,50,40);
            triangle(flagpole.x_pos + 50,floorPos_y ,
                     flagpole.x_pos + 50,floorPos_y - 40,
                     flagpole.x_pos + 80,floorPos_y - 20);

        }
    pop();
}

function checkFlagpole() // function cheks if the character reaches the flagpole
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 5)
        {
            winningSound.play();
            flagpole.isReached = true;
        }
}
function checkPlayerDie() //funtion checks if the player falls in the canyon.
{
    if(gameChar_y > floorPos_y + 200 && lives > 0)
        {
            deadpandaSound.play(); // plays dying panda sound
            lives -= 1
            if(lives >= 1)
                {
                    startGame();
                }
        }
    for(var i = lives; i > 0 ; i--)
        {
            if(i==3)
                {
                    noStroke();
                    fill(200,0,0);
                    ellipse(88,33,10);
                    ellipse(98,33,10);
                    triangle(83, 34,
                             103,34,
                             93, 48);
                    /////////////////
                    ellipse( 88 + 25,33,10);
                    ellipse( 98 + 25,33,10);
                    triangle(83 + 25,34,
                            103 + 25,34,
                             93 + 25,48);
                    ///////////////
                    ellipse( 88 + 50,33,10);
                    ellipse( 98 + 50,33,10);
                    triangle(83 + 50,34,
                            103 + 50,34,
                             93 + 50,48);
                }
            if(i==2)
                {
                    noStroke();
                    fill(200,0,0);
                    ellipse(88,33,10);
                    ellipse(98,33,10);
                    triangle(83,34,
                            103,34,
                             93,48);
                    /////////////////
                    ellipse( 88 + 25,33,10);
                    ellipse( 98 + 25,33,10);
                    triangle(83 + 25,34,
                            103 + 25,34,
                             93 + 25,48);
                   
                }
            if(i==1)
                {
                    noStroke();
                    fill(200,0,0);
                    ellipse(88,33,10);
                    ellipse(98,33,10);
                    triangle(83,34,
                             103,34,
                             93,48);
                  
                }
        }
    
}

/////////////////////////
////start game /////////
 function startGame()
{
    
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
 

	// Initialise arrays of scenery objects.
    trees_x =       [-20,1400,1200,1800,400,800,2200];
    clouds =        [{x_pos: 130, y_pos: 0,  size: 0},
                    {x_pos: -1000,y_pos: 0,  size: 0},
                    {x_pos: -530, y_pos: 0,  size: 0}];
    mountains =    [{x_pos: 500,  y_pos: 232,size: 0},
                    {x_pos: 1500, y_pos: 232,size: 0},
                    {x_pos: 2500, y_pos: 232,size: 0},
                    {x_pos: -100, y_pos: 232,size: 0},
                    {x_pos: -700, y_pos: 232,size: 0},
                    {x_pos: -1000,y_pos: 232,size: 0}];
    collectables = [{x_pos: 900,  y_pos: 430,size: 20, isFound: false},
                    {x_pos: 1400, y_pos: 430,size: 20, isFound: false},
                    {x_pos: 130,  y_pos: floorPos_y - 120,size: 20, isFound: false},
                    {x_pos: 240,  y_pos: floorPos_y - 120,size: 20, isFound: false},
                    {x_pos: 385,  y_pos: floorPos_y - 240,size: 20, isFound: false},
                    {x_pos: 635,  y_pos: floorPos_y - 220,size: 20, isFound: false},
                    {x_pos: -220, y_pos: floorPos_y - 120,size: 20, isFound: false},
                    {x_pos: -370, y_pos: floorPos_y - 220,size: 20, isFound: false},
                    {x_pos: -280, y_pos: floorPos_y - 220,size: 20, isFound: false},
                    {x_pos: -850, y_pos: floorPos_y - 120,size: 20, isFound: false},
                    {x_pos: 1025, y_pos: floorPos_y - 170,size: 20, isFound: false},
                    {x_pos: 1295, y_pos: floorPos_y - 120,size: 20, isFound: false},
                    {x_pos: 1730, y_pos: floorPos_y - 170,size: 20, isFound: false},
                    {x_pos: 1810, y_pos: floorPos_y - 170,size: 20, isFound: false},
                    {x_pos: 1505, y_pos: floorPos_y - 230,size: 20, isFound: false},];
    canyons =      [{x_pos: 70,   width: 80},
                    {x_pos: 1560, width: 180},
                    {x_pos: -1740,width: 1000}];
    flagpole =      {x_pos : 2000, isReached : false};
     //platforms in the start
    platforms = [];
    platforms.push(createPlatforms(110, floorPos_y - 100, 160));
    platforms.push(createPlatforms(310,floorPos_y - 220, 160));
    platforms.push(createPlatforms(560, floorPos_y - 200, 160));
    //platforms on the left side
    platforms.push(createPlatforms(-300, floorPos_y - 100, 160));
    platforms.push(createPlatforms(-400, floorPos_y - 200, 160));
    platforms.push(createPlatforms(-900, floorPos_y - 100, 160));
    //platforms on the right side
    platforms.push(createPlatforms(950, floorPos_y - 150, 160));
    platforms.push(createPlatforms(1220, floorPos_y - 100, 160));
    platforms.push(createPlatforms(1700, floorPos_y - 150, 160));
    platforms.push(createPlatforms(1430, floorPos_y - 210, 160));
    game_score = 0;
    emit = new Emitter(
         1650, floorPos_y + 120 ,
         0, -5, 40, 
         color(140, 0, 0, 100));
    emit.startEmitter(200, 400);
    
}

function createPlatforms(x, y, length) // draw platforms 
{
    var p = 
    {
        x:x,
        y:y,
        length:length,
        draw: function()
        {   
            stroke(0, 100, 0)
            fill(37, 168, 44);
            rect(this.x, this.y, 150, 10);
            fill(90, 170, 96);
            ellipse(this.x + 25, this.y + 5, 6, 13);
            ellipse(this.x + 50, this.y + 5, 6, 13);
            ellipse(this.x + 75, this.y + 5, 6, 13);
            ellipse(this.x + 100, this.y + 5, 6, 13);
            ellipse(this.x + 125, this.y + 5, 6, 13);
            noStroke();

        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }

            }

            return false;
        }
    }
    return p;
}

function Particle(x, y, xSpeed, ySpeed, size, colour) // Advanced graphics by adding particles
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    this.age = 0;
    
    this.drawParticle = function()
    {
        fill(this.colour);
        ellipse(this.x, this.y, this.size);
    }
    
    this.updateParticle = function()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age ++;
    }
}

function Emitter(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    
    this.startParticles = 0;
    this.lifetime = 0;
    
    this.particles = [];
    this.addParticle = function()
    {
         var p = new Particle(random(this.x-60,this.x + 60), 
                         random(this. y-10,this.y + 10), 
                         random(this.xSpeed - 1, this.xSpeed + 1), 
                         random(this.ySpeed - 1, this.ySpeed +1), 
                         random(this.size -4, this.ySpeed +4), this.colour);
                return p;
    }
    
    this.startEmitter = function(startParticles, lifetime)
    {
        this.startParticles = startParticles;
        this.lifetime = lifetime;
        
        //start emitter with initial particles
        
        for(var i = 0; i < startParticles; i++)
            {
        
                
                this.particles.push(this.addParticle());
            }
    }
    
    this.updateParticles = function()
    {
        var deadParticles = 0;
        //iterate through particles and draw to screen
        for (var i = this.particles.length - 1; i >= 0; i--)
            {
                this.particles[i].drawParticle();
                this.particles[i].updateParticle();
                
                if(this.particles[i].age > random(0, this.lifetime))
                    {
                        this.particles.splice(i, 1);
                        deadParticles ++;
                    }
            }
        if(deadParticles > 0)
            {
                for (var i = 0; i < deadParticles; i++)
                    {
                         this.particles.push(this.addParticle());
                    }
               
            }
        
    }
}


