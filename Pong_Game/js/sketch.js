/* The sound part of this code was edited by Artyom Grigoryan for the Sound Programming assignment.
*/

let ball, p1, p2, retroFont;
let go = false;

// background music
let backgroundMusic;

// sounds in the game
let restartSound, ballSound, beepSound, dartSound, bounceSound,wowSound;

// sound effects 
let myDelay, myReverb, myFFT, myAmplitude;


function preload() {
  
  retroFont = loadFont('ARCADECLASSIC.TTF');
  
  // loading all sounds
  backgroundMusic = loadSound ('sounds/Disp.mp3');
  restartSound = loadSound('sounds/jump.wav');
  ballSound = loadSound('sounds/ball.wav');
  beepSound = loadSound('sounds/beep.wav');
  dartSound = loadSound('sounds/dart.wav');
  bounceSound = loadSound('sounds/bounce.wav');
  wowSound = loadSound('sounds/wow.wav');
}

function setup() {
  
	alert('-> Use keys A,Z and K,M to move the paddles\n'+
		  '-> Press Spacebar to start each round, and R to reset the game\n'+
		  '-> Hit the ball and make your opponent miss  to score!\n\n'+
	    'Good Luck!'+
          
          // added new info about how to turn on background music
         '\n\n\nP.S. if you want to listen to music that I composed in 2013, click the mouse. If you want ta pause the music - click again :)');

	let cnv = createCanvas(700, 400);
      
	ball = new Ball(width/2, height/2, 10, 10);

	p1 = new Paddle(20, height/2 - 50, 10, 100);
	p2 = new Paddle(width - 30, height/2 - 50, 10, 100);
  
 
// sound part-->
  
  // Sound effects for processing wowSound
  wowSound.disconnect(); // disconnecting wowSound
  
  myFFT = new p5.FFT(0.5,16); // smoothing = 0.5 
  
  myAmplitude = new p5.Amplitude(); // smoothing = 0
  
  myReverb = new p5.Reverb();
  myReverb.drywet(0.5);
  myReverb.process(wowSound, 1, 0.2);
  myReverb.amp(5); // turn it up!
  
  // Sound effects for processing bounceSound
  myDelay = new p5.Delay();
  myDelay.feedback(0.2);
  myDelay.delayTime(0.2);
  bounceSound.connect(myDelay);
  
  // Sound effects for processing backgroundMusic
  cnv.mouseClicked(toggleSound);
  backgroundMusic.amp(0.77);
  
  // Sound effects for processing restartSound
  // changing to a random rate
  restartSound.rate(random(0.0,2.0));
}



function draw() {
	background(52);
	backdrop();

	movePaddles();
	p1.show();
	p2.show();

	let oob = ball.outOfBounds();
	if (oob) {
		// the ball stays at spawn till go = true
		go = false;
		if (oob == 'right') {
			p1.score++;
          // added new condition
          // a rewarding sound feedback every 5th goal reached
          if (p1.score % 5 === 0)
          {
            wowSound.play();
          } else {
          beepSound.play(); // otherwise just a beepSound as a counting sound
          }
		} else {
			p2.score++
           if (p2.score % 5 === 0) {
            wowSound.play();
          } else {
          beepSound.play();
          }
		}
	}

	if (go) ball.update();

	ball.hit(p1, p2);

	ball.show()
    
  let myLevel = myAmplitude.getLevel();
  // triangle's hyptotenus as the parameter for map()
  let hypotenus = map(myLevel,0,1,0,width/8); 
  
  // two red triangles
  fill(139,0,0);
  triangle(345, hypotenus, 345, 0, 300, 0); 
  triangle(355, hypotenus, 355, 0, 400, 0);
    
  //FFT, dancing rectangles in the middle-bottom
  let spectrum = myFFT.analyze();
  let w = width/spectrum.length;
  for(let i=0; i<spectrum.length; i++){
    let x = map(i,0,spectrum.length,0,width/8);
    let h = map (spectrum[i],0,255,0,height/8);
    fill(spectrum[i],0,0);
    noStroke();
    rect(x+310,height,4,-h);
  }
}


function movePaddles() {
	// 65 = 'a'
	if (keyIsDown(65)) {
		p1.move(-5); 
	}
	
	// 90 = 'z'
	if (keyIsDown(90)) {
		p1.move(5);
	}
	
	// 75 = 'k'
	if (keyIsDown(75)) {
		p2.move(-5);
	}
	
	// 77 = 'm'
	if (keyIsDown(77)) { 
		p2.move(5);
	}
}

function keyTyped() {
	if (key == ' ') {
		go = true;
      ballSound.play(); // ballSound after ball moves from the starting point
	}

	if (key == 'r') {
		p1.score = 0;
		p2.score = 0;
		ball.resetball();
		go = false;
      restartSound.play(); // restartSound in case if the game resumed
	}

	// for safety
	return false;
       
}

// added new function to check if the status of backgroundMusic
function toggleSound(){
  if (backgroundMusic.isPlaying()) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }
}



