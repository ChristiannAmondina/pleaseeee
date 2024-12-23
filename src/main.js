//================================================================
// Imports
//================================================================
import './assets/styles.css'; // Adjust the path as necessary
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GUI } from 'dat.gui'; // Import dat.GUI

import { 
  createChair, createdesk , createaircon, 
  createflower, createframe, createdispenser, created_design1, 
  created_design2, created_design3, created_floor, created_hallchairs,
   created_cheaproom, created_fence,    created_statue , created_ceiling 
   ,created_nearstatue
} 
from './js/objects.js';




import { createblood } from './js/effects.js';
import { loadWall } from './js/design.js';

import { FPSControls } from './js/FPSControls'; // Import FPSControls from separate file
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


//================================================================
// Scene Setup
//================================================================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl-container').appendChild(renderer.domElement);

//================================================================
// TextureLoader
//================================================================
const textureLoader = new THREE.TextureLoader();

/*
//================================================================
// Fog Setup
//================================================================
//0.0080
let fogDensity = 0; // Adjusted density for fog
let fogColor = new THREE.Color(0xaaaaaa); // Set initial fog color (light gray)
scene.fog = new THREE.FogExp2(fogColor, fogDensity); // Exponential fog (color, density)

//================================================================
// Lighting Setup
//================================================================
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3); // Ambient light to illuminate all objects
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
directionalLight.position.set(10, 10, 5.592).normalize(); // Light source position
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // For softer shadows

*/

//================================================================
// Fog Setup
//================================================================
let fogDensity = 0.06; // Adjusted density for fog
let fogColor = new THREE.Color(0x000000); // Set initial fog color (black)
scene.fog = new THREE.FogExp2(fogColor, fogDensity); // Exponential fog (color, density)



//================================================================
// Lighting Setup
//================================================================
const ambientLight = new THREE.AmbientLight(0x635900, 0.1); // Ambient light to illuminate all objects
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x635900, 0.010); // White directional light
directionalLight.position.set(-15.36, -50, 50).normalize(); // Light source position
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // For softer shadows








const localizedDirectionalLight = new THREE.DirectionalLight(0xffcc00, 1.0);

// Position it in your specific area
localizedDirectionalLight.position.set(-15.36, -50, 50); // Position it at (-115, -39, -40)

// Set the light's target to the area you want to illuminate
localizedDirectionalLight.target.position.set(29, 7, -28); // Focus it downward toward the ground

// Enable shadows for more localized effects
localizedDirectionalLight.castShadow = true;
localizedDirectionalLight.shadow.mapSize.width = 1024;  // Higher value for better resolution
localizedDirectionalLight.shadow.mapSize.height = 1024;
localizedDirectionalLight.shadow.camera.near = 0.1;  // Set the shadow camera near
localizedDirectionalLight.shadow.camera.far = 500;  // Set the shadow camera far (to control distance)

// Add the light to the scene
scene.add(localizedDirectionalLight);
scene.add(localizedDirectionalLight.target);





// Load the sound effect
const sparkSound = new Audio('/sounds/Electricity spark sound effects HQ.mp3'); // Replace with the correct sound file path
sparkSound.volume = 1.0; // Set the volume to maximum (range: 0.0 to 1.0)


// Wait for the sound to be loaded and ensure the duration is valid before using it
sparkSound.addEventListener('loadedmetadata', () => {
  // The sound is loaded and duration is available, you can start using it
  console.log('Sound loaded, duration:', sparkSound.duration);
});

function flickerLight() {
  const flashCount = Math.floor(Math.random() * 6) + 3; // Random flashes (3 to 8)
  let currentFlash = 0;

  function flash() {
    if (currentFlash < flashCount) {
      // Decide if the light should flicker
      const isFlickering = Math.random() > 0.5; // 50% chance of flickering

      if (isFlickering) {
        // Flickering: Set random light intensity and play the sound
        ambientLight.intensity = Math.random() * 0.7 + 0.1; // Intensity: 0.1 to 0.8
        
        // Start the sound at a random time within its duration, but check if duration is valid
        if (sparkSound.paused && !isNaN(sparkSound.duration)) {
          const randomStartTime = Math.random() * sparkSound.duration; // Random start between 0 and the sound's duration
          sparkSound.currentTime = randomStartTime; // Set the random start time
          sparkSound.play();
        }
      } else {
        // Not flickering: Dim the light and stop the sound
        ambientLight.intensity = 1; // Normal ambient light
        if (!sparkSound.paused) {
          sparkSound.pause(); // Stop the sound if it's playing
        }
      }

      currentFlash++;

      // Random delay between each flash (50ms to 150ms)
      setTimeout(flash, Math.random() * 100 + 50);
    } else {
      // End of flashes: Dim the light, stop the sound, and wait for the next sequence
      ambientLight.intensity = 0.1; // Minimal ambient light during delay
      if (!sparkSound.paused) {
        sparkSound.pause(); // Ensure sound is stopped
      }
      setTimeout(flickerLight, 5000); // 5-second delay before the next sequence
    }
  }

  flash(); // Start the flashing sequence
}

// Start the flickering effect
flickerLight();








//================================================================
// Call onPlayerNearKey or onKeyCollected based on your game logic
//================================================================


//================================================================
// Sound Setup with Auto-Play Attempt
//================================================================
let audioContext;

document.addEventListener('click', function() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume the AudioContext if it's suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // Now you can safely start playing audio
  playAudio();
});

// Function to play three audio files at once, looping indefinitely
function playAudio() {
  const audio1 = new Audio('/sounds/Free Horror Ambience (Dark Project).mp3');
  const audio2 = new Audio('/sounds/Underwater Pool - Sound Effect (HD).mp3'); // Second audio file
  const audio3 = new Audio('/sounds/Sound Effects Heavy Rain and Thunder.mp3'); // Third audio file

  // Set the volume of the third audio to be lower than the others
  audio3.volume = 0.6; // Adjust this value (0.0 to 1.0) to control the volume of the third sound

  // Enable looping for all three audio files
  audio1.loop = true;
  audio2.loop = true;
  audio3.loop = true;

  // Play all three sounds at once
  audio1.play();
  audio2.play();
  audio3.play();
}







//================================================================
// Wall Setup (Front, Back, Left, Right)
//================================================================

// Front Wall
const frontWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Front wall texture
frontWallTexture.wrapS = THREE.RepeatWrapping;
frontWallTexture.wrapT = THREE.RepeatWrapping;
frontWallTexture.repeat.set(30, 10); // Scale texture to fit

const frontWallMaterial = new THREE.MeshStandardMaterial({ 
    map: frontWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5 // Optional: for added shininess
});
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 1), frontWallMaterial);
frontWall.position.z = -50;
frontWall.castShadow = true;
frontWall.receiveShadow = true;
scene.add(frontWall);

// Back Wall
const backWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Back wall texture
backWallTexture.wrapS = THREE.RepeatWrapping;
backWallTexture.wrapT = THREE.RepeatWrapping;
backWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const backWallMaterial = new THREE.MeshStandardMaterial({ 
    map: backWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const backWall = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 1), backWallMaterial);
backWall.position.z = 50;
backWall.castShadow = true;
backWall.receiveShadow = true;
scene.add(backWall);

// Left Wall
const leftWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Left wall texture
leftWallTexture.wrapS = THREE.RepeatWrapping;
leftWallTexture.wrapT = THREE.RepeatWrapping;
leftWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const leftWallMaterial = new THREE.MeshStandardMaterial({ 
    map: leftWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), leftWallMaterial);
leftWall.position.set(-52, 2, -1);
leftWall.scale.set(1, 2, 0.6);

leftWall.castShadow = true;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Left Wall 1
const left1WallTexture = textureLoader.load('/images/texture/tile.jpg'); // Left wall texture
left1WallTexture.wrapS = THREE.RepeatWrapping;
left1WallTexture.wrapT = THREE.RepeatWrapping;
left1WallTexture.repeat.set(30, 10); // Adjust the repeat scale

const left1WallMaterial = new THREE.MeshStandardMaterial({ 
    map: left1WallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const left1Wall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), left1WallMaterial);
left1Wall.scale.set(8, 0.3, 0.3);
left1Wall.position.set(-44, 20, 35);

left1Wall.castShadow = true;
left1Wall.receiveShadow = true;
scene.add(left1Wall);

// Right Wall
const rightWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Right wall texture
rightWallTexture.wrapS = THREE.RepeatWrapping;
rightWallTexture.wrapT = THREE.RepeatWrapping;
rightWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const rightWallMaterial = new THREE.MeshStandardMaterial({ 
    map: rightWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), rightWallMaterial);
rightWall.position.x = 50;
rightWall.castShadow = true;
rightWall.receiveShadow = true;
scene.add(rightWall);

//================================================================
// Ceiling and Floor Setup
//================================================================

// Ceiling
const ceilingTexture = textureLoader.load('/images/texture/tile.jpg'); // Ceiling texture
ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(30, 10); // Adjust the repeat scale

const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    map: ceilingTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 22; // Place it above the floor
ceiling.receiveShadow = true;
scene.add(ceiling);

// Floor
const floorTexture = textureLoader.load('/images/texture/tile.jpg'); // Floor texture (same texture as ceiling)
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(30, 10); // Adjust the repeat scale

const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: floorTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMaterial);
floor.rotation.x = Math.PI / -2; // Rotate to make it horizontal
floor.position.y = 0; // Place it on the ground
floor.receiveShadow = true;
scene.add(floor);

//================================================================
// GUI Setup
//================================================================
const gui = new GUI();

// Light Intensity Control
const lightFolder = gui.addFolder('Lighting');
const ambientLightControl = lightFolder.add(ambientLight, 'intensity', 0, 2).name('Ambient Light Intensity');
const directionalLightControl = lightFolder.add(directionalLight, 'intensity', 0, 2).name('Directional Light Intensity');

// Directional Light Direction Controls
const lightDirectionFolder = gui.addFolder('Light Direction');
const initialLightPosition = {
  x: -15.36,
  y: -50,
  z: 50
};

// Set initial position of the directional light
directionalLight.position.set(initialLightPosition.x, initialLightPosition.y, initialLightPosition.z);

// Initialize GUI controls for light position
lightDirectionFolder.add(initialLightPosition, 'x', -50, 50).name('Light X Position').onChange((value) => {
  directionalLight.position.x = value;
});
lightDirectionFolder.add(initialLightPosition, 'y', -50, 50).name('Light Y Position').onChange((value) => {
  directionalLight.position.y = value;
});
lightDirectionFolder.add(initialLightPosition, 'z', -50, 50).name('Light Z Position').onChange((value) => {
  directionalLight.position.z = value;
});

// Fog Controls
const fogFolder = gui.addFolder('Fog');
const fogIntensityControl = fogFolder.add({ fogDensity: fogDensity }, 'fogDensity', 0, 0.1).name('Fog Density').onChange((value) => {
  scene.fog.density = value;
});

const fogColorControl = fogFolder.addColor({ fogColor: fogColor.getHex() }, 'fogColor').name('Fog Color').onChange((value) => {
  scene.fog.color.set(value);
});

//================================================================
// Initialize the GUI
//================================================================
lightFolder.close(); // Open the lighting folder
lightDirectionFolder.close(); // Open the light direction folder
fogFolder.close(); // Open the fog folder



































//================================================================
// Camera Setup
//================================================================
camera.position.set(37, 6, 11); // Set camera position
//30, 100, 5
// Setup OrbitControls for environment editing
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.25;
orbitControls.screenSpacePanning = false;
orbitControls.zoomSpeed = false;
orbitControls.minDistance = 10;
orbitControls.maxDistance = 200;

// Setup PointerLockControls for first-person movement
const pointerLockControls = new PointerLockControls(camera, renderer.domElement);
scene.add(pointerLockControls.object);

// Instantiate FPSControls
const fpsControls = new FPSControls(camera, scene, pointerLockControls);
///
///

//
//
//
//

let isFirstPerson = false;
let isZombieMoving = true; // Track whether the zombie should move
let zombieState = "patrolling"; // Initial state of the zombie

const clock = new THREE.Clock();

//================================================================
// Screen Effects (Damage Overlay)
//================================================================
const damageOverlay = document.getElementById('damage-overlay');

// Function to make the screen flicker red
function triggerRedFlicker() {
  let flickerCount = 0; // Count flickers
  const maxFlickers = 5; // Total number of flickers

  const interval = setInterval(() => {
    damageOverlay.style.opacity = damageOverlay.style.opacity === '0' ? '1' : '0';
    flickerCount++;
    if (flickerCount >= maxFlickers * 2) {
      clearInterval(interval);
      damageOverlay.style.opacity = '0'; // Ensure it ends in a non-visible state
    }
  }, 100); // Flicker interval (in milliseconds)
 
}

const attackSound = new Audio('/sounds/Call of Duty Zombie Scream - Sound Effect  ProSounds.mp3'); // Add your attack sound file here
// Increase the volume and ensure it plays strongly
attackSound.volume = 1; // Max volume
attackSound.playbackRate = 2; // Slightly increase playback speed for intensi
function onZombieAttack() {
  triggerRedFlicker();
  console.log('Player attacked by zombie!');

  // Play the attack sound
  attackSound.play();

  // Ensure the zombie doesn't tilt during the attack
  zombie.rotation.x = 0;  // Reset X-axis rotation (no tilt)
  zombie.rotation.z = 0;  // Reset Z-axis rotation (no tilt)

  // Make the zombie's face face directly toward the camera when attacking
  const directionToCamera = new THREE.Vector3();
  directionToCamera.subVectors(camera.position, zombie.position).normalize();
  
  // Calculate the angle to rotate towards the camera (Y-axis rotation)
  const angle = Math.atan2(directionToCamera.x, directionToCamera.z);  // Use directionToCamera here
  zombie.rotation.y = angle;

  // Trigger the attack animation here if any
  // For example:
  // zombieAnimation.play("attack_animation");

  // Camera shake logic
  const shakeDuration = 0.2; // Shake duration in seconds
  const shakeMagnitude = 0.1; // Magnitude of shake (how far the camera moves)

  const originalCameraPosition = camera.position.clone(); // Store the original position
  const originalFOV = camera.fov; // Store the original FOV
  
  // Set the zoom effect (zoom in the camera)
  const zoomDuration = 0.2; // Duration of zoom effect in seconds
  const zoomMagnitude = 30; // The field of view to zoom into (smaller means more zoomed in)
  camera.fov = zoomMagnitude; // Set the camera to zoom in

  let shakeTime = 0;
  let zoomTime = 0;

  function shakeCamera() {
    if (shakeTime < shakeDuration) {
      // Apply random movement to the camera position
      camera.position.x = originalCameraPosition.x + (Math.random() - 0.5) * shakeMagnitude;
      camera.position.y = originalCameraPosition.y + (Math.random() - 0.5) * shakeMagnitude;
      camera.position.z = originalCameraPosition.z + (Math.random() - 0.5) * shakeMagnitude;

      shakeTime += 0.016; // Assume 60 FPS, so 1 frame = 0.016s
      requestAnimationFrame(shakeCamera); // Continue shaking
    } else {
      // Restore the camera to its original position after the shake
      camera.position.copy(originalCameraPosition);
    }
  }

  function zoomCamera() {
    if (zoomTime < zoomDuration) {
      // Gradually zoom back to the original FOV
      camera.fov = THREE.MathUtils.lerp(camera.fov, originalFOV, zoomTime / zoomDuration);
      camera.updateProjectionMatrix(); // Update the camera's projection matrix to apply the FOV change

      zoomTime += 0.016; // Assume 60 FPS, so 1 frame = 0.016s
      requestAnimationFrame(zoomCamera); // Continue zooming
    } else {
      // Reset the camera's FOV after zoom effect
      camera.fov = originalFOV;
      camera.updateProjectionMatrix();
    }
  }
  
  // Start the shake and zoom effects
  shakeCamera();
  zoomCamera();
}





//================================================================
// Zombie Movement (AI Behavior)
//================================================================
// Square boundaries (min and max coordinates)
const minX = -40, maxX = 40;
const minZ = -40, maxZ = 40;

let currentTarget = new THREE.Vector3();  // Current target position for the zombie
let isMovingToTarget = false;  // Flag to track if the zombie is moving to a new target
const wanderDistance = 50; // Distance at which the zombie starts wandering

// Update zombie state and movement
//================================================================
function updateZombie() {
  if (zombie) {
    const playerPosition = camera.position;
    const zombiePosition = zombie.position;
    const distanceToPlayer = playerPosition.distanceTo(zombiePosition);
    const direction = new THREE.Vector3();
    direction.subVectors(playerPosition, zombiePosition).normalize();






    
    switch (zombieState) {
      case "patrolling":
        patrolRandomly();
        if (distanceToPlayer < 32) {
          zombieState = "chasing"; // Start chasing if within range
        }
        break;

      case "chasing":
        chasePlayer(direction, distanceToPlayer);
        if (distanceToPlayer < 5) {
        
          zombieState = "attacking"; // Attack if extremely close
        } else if (distanceToPlayer > 50) {
          zombieState = "patrolling"; // Return to patrol if too far away
          isMovingToTarget = false;  // Reset movement flag to trigger new patrol target
        } else if (distanceToPlayer > wanderDistance) {
          zombieState = "wandering"; // Start wandering if player is far away
        }
        
        break;

      case "attacking":
        onZombieAttack(); // Trigger red flicker effect when attacking
        if (distanceToPlayer < 1) {
          gameOver(); // Trigger game over if zombie catches player
        } else if (distanceToPlayer > 30) {
          zombieState = "chasing"; // Continue chasing if player is still close
          damageOverlay.style.opacity = '0'; // Stop the red flicker when player is too far
        } else if (distanceToPlayer > 5) {
          zombieState = "chasing"; // Stop attacking and go back to chasing
          damageOverlay.style.opacity = '0'; // Stop the red flicker
        }
        break;

      case "wandering":
        wanderRandomly();
        if (distanceToPlayer < wanderDistance) {
          zombieState = "chasing"; // Return to chasing if player is within range
        }
        break;
    }
  }
}




//================================================================
// Game Over Effect
//================================================================
//================================================================
// Game Over Effect with Delay
//================================================================

let gameOverState = false; // Track the game over state
const gameoverSound = new Audio('/sounds/Game Over Sound Effect - SFX.mp3');  // Replace with actual path

function gameOver() {
  // Stop all animations
  if (mixer) {
    mixer.stopAllAction();  // Stop all animations
  }

 // Set the gameOverState flag to true
gameOverState = true;

// Add a delay before showing the "Game Over" message
setTimeout(() => {
  // Display "Game Over" message
  const gameOverMessage = document.createElement('div');
  gameoverSound.play();
  gameOverMessage.style.position = 'absolute';
  gameOverMessage.style.top = '50%';
  gameOverMessage.style.left = '50%';
  gameOverMessage.style.transform = 'translate(-50%, -50%)';
  gameOverMessage.style.fontSize = '48px';
  gameOverMessage.style.fontFamily = 'Courier New, Courier, monospace';
  gameOverMessage.style.color = 'red';
  gameOverMessage.style.fontWeight = 'bold';
  gameOverMessage.innerText = 'GAME OVER\nPress Ctrl + R to restart';
  document.body.appendChild(gameOverMessage);

  // Create the image element
  const gameOverImage = document.createElement('img');
  gameOverImage.src = '/static/images/pics/bloodscreen.png'; // Correct image path
  gameOverImage.style.position = 'absolute';
  gameOverImage.style.position = 'fixed';
  gameOverImage.style.top = '0';
  gameOverImage.style.left = '0';
  gameOverImage.style.width = '100%';
  gameOverImage.style.height = '100%';
  gameOverImage.style.filter = 'contrast(41)';
  gameOverImage.style.opacity = '0.3';
  gameOverImage.style.zIndex = '-5'; // Set the z-index behind other elements
  document.body.appendChild(gameOverImage); // Append the image to the body

  // Listen for 'Ctrl + R' key press to restart the game
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'r') {
      restartGame();  // Restart the game when Ctrl + R is pressed
      document.body.removeChild(gameOverMessage);  // Remove the game over message
      document.body.removeChild(gameOverImage);  // Remove the image as well
    }
  });
}, 2000); // Delay for 2 seconds before showing the message

// Play the key collection sound
gameoverSound.play();
}


//================================================================
// Game Restart Function
//================================================================
function restartGame() {
  // Reset game state
  zombie.position.set(-20, 0, -20); // Reset zombie position
  camera.position.set(0, 14, 24); // Reset camera position
  zombieState = "patrolling"; // Reset zombie state
  isZombieMoving = true; // Enable zombie movement

  // Restart the animation
  if (mixer) {
    mixer.stopAllAction();  // Stop any active animation
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play(); // Play animations again
    });
  }

  // Additional reset logic (if needed)
  // Reset the player's position, game variables, etc.

  // You can call any necessary functions to reset the game scene here
  // For example: resetPlayerPosition(), resetGameEnvironment(), etc.
}


// Patrol randomly within the square area
function patrolRandomly() {
  if (!isMovingToTarget) {
    // Set a random target within the defined area
    currentTarget.set(
      Math.random() * (maxX - minX) + minX,  // Random x within the range
      0,  // Y remains constant (since this is a flat 2D plane for movement)
      Math.random() * (maxZ - minZ) + minZ   // Random z within the range
    );
    isMovingToTarget = true;  // Start moving to the new target
  }

  // Move zombie towards the target
  const distanceToTarget = zombie.position.distanceTo(currentTarget);
  
  if (distanceToTarget < 1) {
    // If the zombie reaches the target, stop moving and pick a new target
    isMovingToTarget = false;
    currentTarget.set(
      Math.random() * (maxX - minX) + minX,  // Random x within the range
      0,  // Y remains constant (since this is a flat 2D plane for movement)
      Math.random() * (maxZ - minZ) + minZ   // Random z within the range
    );
  } else {
    // Move towards the target
    const direction = new THREE.Vector3();
    direction.subVectors(currentTarget, zombie.position).normalize();

    // Update zombie's rotation to face the target
    const angle = Math.atan2(direction.x, direction.z);  // Calculate the angle
    zombie.rotation.y = angle;  // Make the zombie face the target

    const patrolSpeed = 0.04;  // Patrol speed
    zombie.position.addScaledVector(direction, patrolSpeed);  // Move towards the target
  }

  // Optional: Randomly rotate slightly to simulate looking around
  if (Math.random() < 0.04) {
    zombie.rotation.y += (Math.random() - 0.5) * Math.PI / 4; // Randomly adjust rotation
  }
}


// Chase the player
function chasePlayer(direction, distanceToPlayer) {
  if (distanceToPlayer < 10) {
    zombie.position.addScaledVector(direction, 0.0040); // Speed up when closer to the player
    zombie.lookAt(camera.position); // Always face the player

    // Ensure zombie remains upright during chase
    zombie.rotation.x = 10;  // Lock tilt on X-axis
    zombie.rotation.z = 0;  // Lock tilt on Z-axis
    
    
  }

  // Ensure zombie stays on the ground (y = 0)
  zombie.position.y = 0.8;
}



// Wander randomly within the defined area
function wanderRandomly() {
  if (!isMovingToTarget) {
    // Set a random target within the defined area
    currentTarget.set(
      Math.random() * (maxX - minX) + minX,  // Random x within the range
      0,  // Y remains constant (since this is a flat 2D plane for movement)
      Math.random() * (maxZ - minZ) + minZ   // Random z within the range
    );
    isMovingToTarget = true;  // Start moving to the new target

      if (Math.random() < 0.04) {
    zombie.rotation.y += (Math.random() - 0.15) * Math.PI / 4; // Randomly adjust rotation
  }
  }

  // Move zombie towards the target
  const distanceToTarget = zombie.position.distanceTo(currentTarget);
  
  if (distanceToTarget < 1) {
    // If the zombie reaches the target, stop moving and pick a new target
    isMovingToTarget = false;
    currentTarget.set(
      Math.random() * (maxX - minX) + minX,  // Random x within the range
      0,  // Y remains constant (since this is a flat 2D plane for movement)
      Math.random() * (maxZ - minZ) + minZ   // Random z within the range
    );
  } else {
    // Move towards the target
    const direction = new THREE.Vector3();
    direction.subVectors(currentTarget, zombie.position).normalize();

    // Update zombie's rotation to face the target
    const angle = Math.atan2(direction.x, direction.z);  // Calculate the angle
    zombie.rotation.y = angle;  // Make the zombie face the target

    const wanderSpeed = 0.05;  // Wander speed
    zombie.position.addScaledVector(direction, wanderSpeed);  // Move towards the target
  }

  // Optional: Randomly rotate slightly to simulate looking around
  if (Math.random() < 0.04) {
    zombie.rotation.y += (Math.random() - 0.5) * Math.PI / 4; // Randomly adjust rotation
  }
}








//================================================================
// Character (Zombie) Setup
//================================================================
const loader = new GLTFLoader();
let zombie, mixer;

loader.load('/images/models/zombie_monster_slasher_necromorph.glb', (gltf) => {
  zombie = gltf.scene;
  zombie.scale.set(5, 5, 5);
  zombie.position.set(-20, 0, -20); // Starting position of the zombie
  zombie.castShadow = true;
  zombie.receiveShadow = true;
  scene.add(zombie);

  // Initialize the animation mixer for the zombie
  mixer = new THREE.AnimationMixer(zombie);

  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play(); // Play animations
  });
});









//================================================================
// flood
//================================================================



let water;  // Declare water globally
let waterMixer;  // Declare a global mixer variable

loader.load('/images/models/water_wave_for_ar.glb', (gltf) => {
  water = gltf.scene;
  water.scale.set(0.3, 0.3, 0.31);
  water.position.set(20, 23, 20); // Starting position of the water
  water.castShadow = true;
  water.receiveShadow = true;
  scene.add(water);

  // Make the water darker by adjusting its material
  water.traverse((child) => {
    if (child.isMesh) {
      // Set the color to a darker shade (e.g., dark blue or near black)
      if (child.material) {
        child.material.color = new THREE.Color(0x001a33); // Dark blue
        child.material.emissive = new THREE.Color(0x000000); // No emissive light
        child.material.needsUpdate = true; // Update the material
      }
    }
  });

  // Create an AnimationMixer if the model has animations
  if (gltf.animations && gltf.animations.length) {
    waterMixer = new THREE.AnimationMixer(water); // Initialize mixer inside if-block

    gltf.animations.forEach((clip) => {
      const action = waterMixer.clipAction(clip);
      action.play(); // Play all animations
      action.setEffectiveTimeScale(0.5); // Slow down the animation by setting time scale to 0.5 (50% speed)
    });
  }

  // Optional: Log the object to check if it's been added to the camera
  console.log(water);
}, undefined, // Optional: onProgress callback
function (error) { // onError callback
  console.error('An error occurred while loading the model:', error);
});

















//================================================================
// Input and Controls
//================================================================
document.addEventListener('click', () => {
  if (!isFirstPerson) {
    pointerLockControls.lock(); // Enable first-person mode
    isFirstPerson = true;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isFirstPerson) {
    pointerLockControls.unlock(); // Exit first-person mode
    isFirstPerson = false;
  }
});

const zombieSound = new Audio('/sounds/Zombie sound effect.mp3');
zombieSound.loop = true; // Make sure the sound loops to continuously fade in/out




function zombieFollowPlayer() {
  if (isZombieMoving && zombie) {
    const playerPosition = camera.position;
    const zombiePosition = zombie.position;

    const direction = new THREE.Vector3();
    direction.subVectors(playerPosition, zombiePosition).normalize();

    zombie.lookAt(playerPosition);

    const distanceToPlayer = playerPosition.distanceTo(zombiePosition);

    let speed = 0.017; // Base zombie speed

    // Adjust volume based on distance (closer = louder)
    let volume = 0;

    if (distanceToPlayer <= 8) {
      // At 8 units or less, volume is at maximum (1)
      volume = 1;
    } else if (distanceToPlayer > 8 && distanceToPlayer <= 20) {
      // Between 8 and 20 units, volume stays high (near max)
      volume = 1;
    } else if (distanceToPlayer > 20 && distanceToPlayer <= 26) {
      // Between 20 and 26 units, gradually fade out the sound
      volume = Math.max(0, 1 - (distanceToPlayer - 20) / 6);
    } else {
      // Beyond 26 units, pause the sound and reset it
      zombieSound.pause();
      zombieSound.currentTime = 0; // Reset sound to the beginning
      zombieSound.volume = 0; // No sound
    }

    // Apply the adjusted volume
    if (distanceToPlayer <= 26) {
      if (zombieSound.paused) {
        zombieSound.play(); // Start the sound if not playing and player is in range
      }
      zombieSound.volume = volume;
    }

    // Adjust playback rate based on distance (closer = higher pitch)
    const maxPlaybackRate = 1.5; // Maximum pitch (close)
    const minPlaybackRate = 0.5; // Minimum pitch (far)
    let playbackRate = THREE.MathUtils.mapLinear(
      distanceToPlayer,
      35, // max distance (far)
      1,  // min distance (close)
      minPlaybackRate,
      maxPlaybackRate
    );
    playbackRate = THREE.MathUtils.clamp(playbackRate, minPlaybackRate, maxPlaybackRate);
    zombieSound.playbackRate = playbackRate;

    if (distanceToPlayer < 1) {
      speed = 0.2; // Increase zombie speed when very close

      // Attack player if extremely close
      if (distanceToPlayer < 5) {
        onZombieAttack(); // Trigger attack
      }
    }

    // Move zombie towards the player
    zombie.position.addScaledVector(direction, speed);
  }
}

























//================================================================
// Ceiling Light Setup (Completely Black)
//================================================================
// Ceiling Light Setup (Static, No Animation, No Effects)
let sparkceiling, material;

// Load the GLB model of the ceiling light
loader.load('/images/models/long_office_ceiling_light.glb', (gltf) => {
  sparkceiling = gltf.scene;
  sparkceiling.scale.set(17, 15, 15); // Set the scale of the ceiling light
  sparkceiling.position.set(34, 16.710, -14); // Set the position of the ceiling light
  
  // Rotate the ceiling light to face the opposite direction (downwards)
  sparkceiling.rotation.x = Math.PI; // Rotate 180 degrees around the X-axis
  sparkceiling.rotation.y = Math.PI/2; // Rotate 180 degrees around the X-axis
  sparkceiling.castShadow = true;  // Enable casting shadow
  sparkceiling.receiveShadow = true;  // Enable receiving shadow
  scene.add(sparkceiling);

});






















































//================================================================
// Candle Setup and Interactions
//================================================================

let lightObject;

let pointLight; // For candle-like light


// Load the .glb model for the candle
loader.load(
  '/images/models/copper_candlestick.glb',
  function (gltf) {
    lightObject = gltf.scene;

    // Position and scale the model
    lightObject.position.set(2.3, -4, -1.5);
    lightObject.scale.set(21, 21, 21); 
    lightObject.rotation.x = Math.PI / -23;

    // Add the model to the camera
    camera.add(lightObject);

    // Create a yellow point light (simulating candle light)
    pointLight = new THREE.PointLight(0xFFFF00, 1, 10); // Yellow light, intensity of 1, range 10
    pointLight.position.set(0, 0, 0); // Place it at the camera's position
    pointLight.scale.set(110, 110, 110); 
    camera.add(pointLight);

    // Create an AnimationMixer if the model has animations
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(lightObject);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play(); // Play all animations
      });
    }

    // Optional: Log the object to check it's been added to the camera
    console.log(lightObject);
  },
  undefined, // Optional: onProgress callback
  function (error) { // onError callback
    console.error('An error occurred while loading the model:', error);
  }
);







//================================================================
// Key Setup and Interactions
//================================================================
let hasKey = false;  // Flag to check if the player has the key
let hasUsedKey = false;  // Flag to check if the key has been used
let boundDoor = null;  // The specific door this key is bound to

// Sound effect for collecting the key
const keyCollectSound = new Audio('/sounds/key.mp3');  // Replace with actual path

// Sound effect for opening the door
const doorOpenSound = new Audio('/sounds/Door.mp3');  // Replace with actual path

// Load the .glb model for the key
let keyObject;
loader.load('/images/models/metal_credit_card.glb', function (gltf) {
  keyObject = gltf.scene; // The loaded key model
  keyObject.position.set(-35, 3, 19);
  keyObject.scale.set(0.4, 0.4, 0.4); // Adjust scale if needed
  scene.add(keyObject);
  keyObject.rotation.x = Math.PI / 2;
}, undefined, function (error) {
  console.error(error);
});

// Bind the key to a specific door
function bindKeyToDoor(door) {
  boundDoor = door;  // Assign the key to open this door
}

// Export functions for key-related interactions
export function showKeyCollectNote() {
  const keyCollectNote = document.getElementById('key-collect-note');
  if (keyCollectNote) {
    keyCollectNote.style.display = 'block';  // Show the key collect note
  }
}

export function hideKeyCollectNote() {
  const keyCollectNote = document.getElementById('key-collect-note');
  if (keyCollectNote) {
    keyCollectNote.style.display = 'none';  // Hide the key collect note
  }
}

// Function to check proximity to key and show note
function checkProximityToKey(playerPosition) {
  if (keyObject) {
    const keyPosition = keyObject.position.clone();
    const distance = playerPosition.distanceTo(keyPosition);

    if (distance < 5 && !hasKey) {  // Only show note if the player doesn't already have the key
      showKeyCollectNote();
      document.addEventListener('keydown', onKeyPress);
    } else {
      hideKeyCollectNote();
    }
  }
}

// Handle key press to collect the key
function onKeyPress(event) {
  if (event.key === 'c' && !hasUsedKey) {  // Only collect key if it hasn't been used yet
    const distanceToKey = camera.position.distanceTo(keyObject.position);
    if (distanceToKey < 15) {
      onKeyCollected();
      hideKeyCollectNote();
      keyCollectSound.play();  // Play the sound when the key is collected
    }
  }
}

// Function to collect the key
function onKeyCollected() {
  if (keyObject) {
    // Remove the key from its current position in the scene
    scene.remove(keyObject);

    // Attach the key to the camera
    camera.add(keyObject);

    // Position the key in front of the camera (e.g., 2 units forward, 0.5 units up)
    keyObject.position.set(0.2, -0.5, -1); // Adjust as needed
    
    // Adjust the scale to make the key visible but not too large
    keyObject.scale.set(0.3, 0.4, 0.3); // Fine-tune scale if needed
  }


  hasKey = true; // Update the flag

  // Hide the key collect note
  hideKeyCollectNote();

  // Play the key collection sound
  keyCollectSound.play();

  // Show the key in the inventory UI (optional)
  const keyImageContainer = document.getElementById('key-image-container');
  if (keyImageContainer) {
    keyImageContainer.style.display = 'block';
  }
}


//================================================================
// Door Setup and Interactions
//================================================================

// Load the texture for the door
const doorTexture = textureLoader.load('/images/texture/moderndoor.jpg'); // Set your image path

// Set the texture to repeat
doorTexture.wrapS = THREE.RepeatWrapping;  // Repeat the texture on the X-axis
doorTexture.wrapT = THREE.RepeatWrapping;  // Repeat the texture on the Y-axis

// Adjust the number of times the texture repeats (adjust these values as needed)
doorTexture.repeat.set(1, 1);  // Repeat the texture 2 times along X, 3 times along Y

// Create a material with the loaded texture
const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorTexture,  // Apply the texture to the material

  side: THREE.DoubleSide  // Optionally, apply texture to both sides of the door
});

// Define the door geometry (size of the door)
const doorGeometry = new THREE.BoxGeometry(3, 6, 0.2); // Width, height, depth of the door

// Create the door mesh with the geometry and material
const door = new THREE.Mesh(doorGeometry, doorMaterial);

// Position the door in your scene (adjust position as needed)
door.position.set(24, 4,44); // Example position (x, y, z)
door.rotation.y = Math.PI / -2;
door.scale.set(3,2, 7); // Example position (x, y, z)

// Add the door to the scene
scene.add(door);

// Bind the key to this door
bindKeyToDoor(door);

let doorOpen = false; // Flag to track if the door is open

function checkProximityToDoor(playerPosition) {
  const doorPosition = door.position.clone();
  const distanceToDoor = playerPosition.distanceTo(doorPosition);

  if (distanceToDoor < 10) { // You can adjust the distance to your needs
    if (hasKey && !doorOpen && !hasUsedKey && boundDoor === door) {  // Ensure the key is bound to this door
      // Display a prompt to open the door if the player has the key
      showDoorOpenNote();  // Function to show a prompt on the screen (optional)
      document.addEventListener('keydown', onDoorPress);
    } else {
      // Display a different message if the player doesn't have the key
      showNoKeyNote();  // Function to show a "no key" message
      document.removeEventListener('keydown', onDoorPress);
    }
  } else {
    hideDoorNote();  // Hide the door prompt when not close
    document.removeEventListener('keydown', onDoorPress);
  }
}

// Handle "E" key press to open the door
function onDoorPress(event) {
  if (event.key === 'e') {
    if (hasKey && !hasUsedKey && boundDoor === door) {  // Only open this specific door with the key
      openDoor();  // Function to open the door
      doorOpenSound.play();  // Play the sound when the door opens
    } else {
      alert('You need the correct key to open the door!');  // Alert if the player doesn't have the key or tries to open the wrong door
    }
  }
}

function openDoor() {
  if (doorOpen) return; // Prevent reopening if already open
  doorOpen = true;

  // Animate the door's position to simulate it opening
  const doorTargetPosition = door.position.clone();
  doorTargetPosition.z -= 5.4; // Move the door 5 units to the left (adjust as needed)
  
  const animationDuration = 1; // 1-second animation
  let startTime = performance.now();

  function animateDoor() {
    const elapsedTime = (performance.now() - startTime) / 50000; // Time elapsed in seconds
    if (elapsedTime < animationDuration) {
      // Lerp (smooth transition) between current position and target position
      door.position.lerp(doorTargetPosition, elapsedTime / animationDuration);
      requestAnimationFrame(animateDoor);
    } else {
      // Ensure the door ends up at the final position
      door.position.copy(doorTargetPosition);
    }
  }

  animateDoor();

  // Play door open sound
  doorOpenSound.play();

  // Mark the key as used
  hasUsedKey = true;

  // Remove the key from the camera and scene
  if (keyObject) {
    camera.remove(keyObject); // Detach from the camera
    keyObject = null; // Fully remove the key reference
    const keyImageContainer = document.getElementById('key-image-container');
  if (keyImageContainer) {
    keyImageContainer.style.display = 'none';  // Hide the key image
  }
  }

  // Hide the inventory image
  hideKeyImage();
}


// Show the door prompt
function showDoorOpenNote() {
  const doorNote = document.getElementById('door-open-note');
  if (doorNote) {
    doorNote.style.display = 'block';  // Show the "Press E to open the door" note
  }
}

// Hide the door prompt
function hideDoorNote() {
  const doorNote = document.getElementById('door-open-note');
  if (doorNote) {
    doorNote.style.display = 'none';  // Hide the door prompt
  }
}

// Show the "no key" message
function showNoKeyNote() {
  const noKeyNote = document.getElementById('no-key-note');
  if (noKeyNote) {
    noKeyNote.style.display = 'block';  // Show "You need the key" note
  }
}


























// Import necessary Three.js components

import TWEEN from '@tweenjs/tween.js';

// Initialize audio elements for each action with max volume
const wrongPasswordSound = new Audio('/sounds/Sound effect WRONG ANSWER.mp3');
const correctPasswordSound = new Audio('/sounds/Correct answer Sound effect.mp3');
const typingSound = new Audio('/sounds/enter button on a keyboard sound effect (royalty free).mp3');
const deviceInteractionSound = new Audio('/sounds/90s PC boot sequence with sound HD.mp3');
const doorOpenSound1 = new Audio('/sounds/Faction Vault Door Open (Fortnite Sound) - Sound Effect for editing.mp3');  // Path to the door open sound effect




wrongPasswordSound.volume = 1.0;
correctPasswordSound.volume = 1.0;
typingSound.volume = 1.0;
deviceInteractionSound.volume = 1.0;
doorOpenSound1.volume = 1.0;  // Set volume to maximum


// Create the password door and device
let passwordDoor, passwordDevice;
let correctPassword = "1532";  // Correct password
let enteredPassword = "";  // Holds the player's input
let isInteracting = false;  // To check if the player is interacting
let interactionUI;  // UI elements for instructions
let inputDiv;  // Password input div
let playerPosition;  // Store player's position for distance check
let deviceInteracted = false;  // To track if the device has been interacted with already

const customDoorTexture = textureLoader.load('/images/texture/glass.jpg');  // Set your image path

// Set texture wrapping
customDoorTexture.wrapS = THREE.RepeatWrapping;  // Repeat the texture on the X-axis
customDoorTexture.wrapT = THREE.RepeatWrapping;  // Repeat the texture on the Y-axis

// Adjust the number of times the texture repeats
customDoorTexture.repeat.set(1, 1);  // Repeat the texture 1 time along X, 1 time along Y

// Create material with transparency and smoothness
const customDoorMaterial = new THREE.MeshStandardMaterial({
  map: customDoorTexture,        // Apply the texture
  transparent: true,             // Enable transparency
  opacity: 0.5,                  // Set semi-transparency (adjust 0 to 1 for desired effect)
  roughness: 0,                  // Make the material completely smooth
  side: THREE.DoubleSide         // Apply the texture to both sides
});

// Define geometry for the door
const customDoorGeometry = new THREE.BoxGeometry(1, 3, 0.2); // Width, height, depth of the door

// Create the door mesh
const texturedPasswordDoor = new THREE.Mesh(customDoorGeometry, customDoorMaterial);

// Position and scale the door
texturedPasswordDoor.position.set(23, 7, -42); // Same position as the original door
texturedPasswordDoor.rotation.y = Math.PI / 2;
texturedPasswordDoor.scale.set(16, 6, 4);  // Example scale (width, height, depth)

// Add the door to the scene
scene.add(texturedPasswordDoor);



const modelPath = '/images/models/simple_mini-atm.glb';  // Path to your .glb file

// Initialize passwordDevice as null initially
passwordDevice = null;

// Load the .glb model and add it to the scene
loader.load(modelPath, function (gltf) {
  passwordDevice = gltf.scene;
  passwordDevice.scale.set(0.0030, 0.0030, 0.0030); 
  passwordDevice.position.set(27, 6, -49.2); 
  passwordDevice.rotation.y = Math.PI / -2;
  scene.add(passwordDevice);
  console.log("Green device manager loaded");
}, undefined, function (error) {
  console.error("Error loading the GLTF model:", error);
});

// Create the UI instructions (hidden initially)
function createInteractionUI() {
  interactionUI = document.createElement('div');
  interactionUI.style.position = 'absolute';
  interactionUI.style.top = '10px';
  interactionUI.style.left = '50%';
  interactionUI.style.transform = 'translateX(-50%)';
  interactionUI.style.color = 'white';
  interactionUI.style.fontSize = '20px';
  interactionUI.style.fontFamily = 'Arial, sans-serif';
  interactionUI.innerHTML = ""; // Initially empty
  document.body.appendChild(interactionUI);
}
createInteractionUI();

// Handle key events for interaction
let typingTimeout;  // Timer for typing sound
function handleKeyPress(event) {
  if (event.key === 'e' && !isInteracting && !deviceInteracted) {
    if (isNearDevice()) {
      startPasswordInput();
      playDeviceInteractionSound();  // Play device interaction sound
    }
  } else if (event.key === 'q' && isInteracting) {
    quitInteraction();
    playDeviceInteractionSound();  // Play device interaction sound when closing
  } else if (isInteracting && event.key >= '0' && event.key <= '9') {
    enteredPassword += event.key;
    updatePasswordDisplay();
    playTypingSound();  // Play typing sound for entering password
    resetTypingSoundTimeout();  // Reset typing sound timeout to continue playing
  } else if (isInteracting && event.key === 'Enter') {
    validatePassword(enteredPassword);
  } else if (isInteracting && event.key === 'Backspace') {
    enteredPassword = enteredPassword.slice(0, -1);
    updatePasswordDisplay();
    playTypingSound();  // Play typing sound for backspace
    resetTypingSoundTimeout();  // Reset typing sound timeout to continue playing
  }
}
window.addEventListener('keydown', handleKeyPress);

// Handle mouse interaction (detect if player is looking at the device)
function onMouseMove(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([passwordDevice]);

  if (intersects.length > 0 && !isInteracting && isNearDevice() && !deviceInteracted) {
    interactionUI.innerHTML = "Press E to Interact with the Device Manager";  // Show instructions if near device
  } else if (intersects.length === 0 && !isInteracting) {
    interactionUI.innerHTML = "";  // Clear instructions when not near the device
  }
}
window.addEventListener('mousemove', onMouseMove);

// Check if player is near the device (within 15 tiles, assuming each tile is 1 unit in 3D space)
function isNearDevice() {
  if (!passwordDevice) return false;  // Make sure the device is loaded

  playerPosition = camera.position;
  const devicePosition = passwordDevice.position;
  const distance = playerPosition.distanceTo(devicePosition);
  console.log("Distance to device:", distance);  // Log the distance to the device
  return distance <= 8;  // 8 units distance check (adjust as needed)
}

// Start the password input process
function startPasswordInput() {
  isInteracting = true;
  playDeviceInteractionSound();  // Play sound for interaction
  interactionUI.innerHTML = "Enter Password:";

  inputDiv = document.createElement('div');
  inputDiv.style.position = 'absolute';
  inputDiv.style.top = '50%';
  inputDiv.style.left = '50%';
  inputDiv.style.transform = 'translate(-50%, -50%)';
  inputDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
  inputDiv.style.padding = '20px';
  inputDiv.style.borderRadius = '10px';
  inputDiv.style.color = 'white';
  inputDiv.style.fontFamily = 'fantasy';  // Set font to fantasy
  inputDiv.innerHTML = ` 
    <p style="font-size: 30px;">Entered Password: ${enteredPassword}</p>
    <p>Press Enter to Submit</p>
  `;
  document.body.appendChild(inputDiv);
}

// Update the password display (show the entered password)
function updatePasswordDisplay() {
  if (inputDiv) {
    inputDiv.innerHTML = ` 
      <p style="font-size: 30px; color: ${isCorrectPassword() ? 'green' : 'red'};">Entered Password: ${enteredPassword}</p>
      <p>Press Enter to Submit</p>
    `;
  }
}

// Validate the entered password
function validatePassword(password) {
  console.log("Entered Password:", password);  // Debugging the entered password
  if (password === correctPassword) {
    openPasswordDoor();
    showPasswordMessage(true);
    playCorrectPasswordSound();  // Play correct password sound
    setTimeout(() => quitInteraction(), 2000); // Delay before quitting interaction
    deviceInteracted = true;
  } else {
    showPasswordMessage(false);
    playWrongPasswordSound();  // Play wrong password sound
    enteredPassword = ""; // Reset password input to try again
  }
}

// Check if the entered password is correct
function isCorrectPassword() {
  return enteredPassword === correctPassword;
}

// Show password validation message with styling
function showPasswordMessage(isCorrect) {
  const messageDiv = document.createElement('div');
  messageDiv.style.position = 'absolute';
  messageDiv.style.top = '60%';
  messageDiv.style.left = '50%';
  messageDiv.style.transform = 'translateX(-50%)';
  messageDiv.style.color = isCorrect ? 'green' : 'red';
  messageDiv.style.fontFamily = 'fantasy';
  messageDiv.style.fontSize = '30px';
  messageDiv.style.textAlign = 'center';
  
  if (isCorrect) {
    messageDiv.innerHTML = "Correct! Password accepted. Door is open.";
  } else {
    messageDiv.innerHTML = "Wrong password! Try again.";
  }

  document.body.appendChild(messageDiv);

  // Remove the message after 3 seconds
  setTimeout(() => {
    document.body.removeChild(messageDiv);
  }, 3000);
}

// Open the password door (trigger animation or door movement)
// Open the password door (trigger animation or door movement)
function openPasswordDoor() {
  // Play the door sound only if it's not already playing
  if (doorOpenSound1.paused || doorOpenSound1.ended) {
    doorOpenSound1.play();
  }

  // Animate the door opening (slide the door very slightly upward on the y-axis)
  const openDoorAnimation = new TWEEN.Tween(texturedPasswordDoor.position)
    .to({ y: texturedPasswordDoor.position.y + 11 }, 6000)  // Slide the door by a very small amount on the y-axis
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  // Ensure the sound plays for the duration of the door opening animation
  setTimeout(() => {
    // Stop the sound after the animation is complete
    doorOpenSound1.pause();
    doorOpenSound1.currentTime = 0;  // Reset sound to the beginning
  }, 6000); // Match this duration with the animation time (6000ms)
}


// Quit the interaction (if the player presses Q)
function quitInteraction() {
  isInteracting = false;
  enteredPassword = ""; // Reset password input
  interactionUI.innerHTML = "";  // Hide the interaction prompt
  
  // Stop the device interaction sound if it's playing
  if (!deviceInteractionSound.paused) {
    deviceInteractionSound.pause();
    deviceInteractionSound.currentTime = 0;  // Reset sound to the beginning
  }
  
  if (inputDiv) {
    document.body.removeChild(inputDiv);
  }
}

// Update the interaction UI based on proximity to the device
function updateInteractionUI() {
  if (passwordDevice && isNearDevice() && !isInteracting && !deviceInteracted) {
    interactionUI.innerHTML = "Press E to Interact with the Device Manager";  // Show message when near
  } else if (!isNearDevice() || deviceInteracted) {
    interactionUI.innerHTML = "";  // Hide message when not near or already interacted
  }
}

// Define sound functions outside the animate loop
function playWrongPasswordSound() {
  wrongPasswordSound.play();
}

function playCorrectPasswordSound() {
  correctPasswordSound.play();
}

function playTypingSound() {
  if (typingTimeout) clearTimeout(typingTimeout);  // Stop any previous typing sound
  typingSound.play();
}

function stopTypingSound() {
  typingSound.pause();
  typingSound.currentTime = 0;  // Reset sound to start
}

function resetTypingSoundTimeout() {
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(stopTypingSound, 1000);  // Stop sound if no typing happens in 1 second
}

function playDeviceInteractionSound() {
  deviceInteractionSound.play();
}














//================================================================
// Animation Loop
//================================================================
function animate() {
  if (gameOverState) return; // Stop everything if the game is over

  requestAnimationFrame(animate);
  TWEEN.update();  // Ensure TWEEN animations are updated in the loop
  updateInteractionUI(); // Check proximity to device and update UI

  const delta = clock.getDelta();

  // Update any animations that are playing
  if (mixer) mixer.update(delta); // Update zombie animation mixer, if exists
  if (waterMixer) waterMixer.update(delta); // Update water animation mixer, if exists

  updateZombie(); // Update zombie behavior

  const playerPosition = camera.position;
  checkProximityToKey(playerPosition);
  checkProximityToDoor(playerPosition);

  // Player's distance to the password device
  if (isNearDevice() && !isInteracting) {
    interactionUI.innerHTML = "Press E to Interact with the Device Manager"; // Prompt to interact
  }

  // If in first-person mode, allow zombie interaction
  if (isFirstPerson) {
    const distanceToZombie = camera.position.distanceTo(zombie.position);
    if (distanceToZombie < 100) {
      zombieFollowPlayer(); // Update zombie to follow player
    }
    fpsControls.update(delta); // Update first-person controls
  } else {
    orbitControls.update(); // Update orbit controls
  }

  // Add the flickering candlelight effect
  if (pointLight) {
    pointLight.intensity = Math.random() * 0.5 + 0.5; // Flickering effect
  }

  // Handle animation and render the scene
  renderer.render(scene, camera);
}
// SCreate additional elements (e.g., chairs)
 

createChair(scene);
    createdesk(scene);
    createaircon(scene);
    createblood(scene);
    createflower(scene);
    createframe(scene);
    createdispenser(scene);
    created_design1(scene);
    created_design2(scene);
    created_design3(scene);
    created_floor(scene);
    created_hallchairs(scene);
    created_fence(scene);
    created_cheaproom(scene);
    created_nearstatue(scene);
    
    created_ceiling(scene);
    created_statue(scene)
  
//SPAWN POINT-------------------------------------------------------------------
// First wall (with texture)
loadWall(scene, { x: 45, y: 2, z: 25 }, '/images/texture/tile.jpg'); // Apply texture to the first wall

// Second wall (with 180° rotation and texture)
loadWall(scene, { x: 20, y: 2, z: 30 }, '/images/texture/tile.jpg').then(wallLeft => {
  wallLeft.rotation.y = Math.PI / 2; // Rotate left segment of the wall
                     
  wallLeft.scale.set(0.453, 1, 2); // Shrink width to create space for the door
  wallLeft.position.set(24, 2, 33.6); // Adjust position to the left side
});
//left
loadWall(scene, { x: 20, y: 2, z: 20 }, '/images/texture/tile.jpg').then(wallLeft => {
  wallLeft.rotation.y = Math.PI / 2; // Rotate left segment of the wall                 
  wallLeft.scale.set(0.1, 0.5, 2); // Shrink width to create space for the door
  wallLeft.position.set(24, 2, 50); // Adjust position to the left side
});
//top
loadWall(scene, { x: 3, y: 2, z: 3 }, '/images/texture/tile.jpg').then(wallRight => {
  wallRight.rotation.y = Math.PI / 2; // Rotate right segment of the wall
  wallRight.scale.set(0.3, 0.4, 2); // Shrink width to create space for the door
  wallRight.position.set(24, 16, 45); // Adjust position to the right side
});
//ceiling room
loadWall(scene, { x: 3, y: 2, z: 3 }, '/images/texture/tile.jpg').then(wallRight => {
  wallRight.rotation.x = Math.PI / 2; // Rotate right segment of the wall
  wallRight.scale.set(0.8, 1, 0.5); // Shrink width to create space for the door
  wallRight.position.set(42, 13.4, 45); // Adjust position to the right side
});
//carpet
loadWall(scene, { x: 3, y: 2, z: 3 }, '/images/texture/carpet2.jpg').then(wallRight => {
  wallRight.rotation.x = Math.PI / 2; // Rotate right segment of the wall
  wallRight.scale.set(0.4, 0.5, 0.2); // Shrink width to create space for the door
  wallRight.position.set(37, -0, 35); // Adjust position to the right side
});

//OFFICE AREA-------------------------------------------------------------------

//right wall second path
loadWall(scene, { x: 20, y: 2, z: 30 }, '/images/texture/tile.jpg').then(wallLeft => {
  wallLeft.rotation.y = Math.PI / 2; // Rotate left segment of the wall
                     
  wallLeft.scale.set(1.2, 1, 2); // Shrink width to create space for the door
  wallLeft.position.set(24, 2, 17); // Adjust position to the left side
});
//left wall second path
loadWall(scene, { x: 20, y: 2, z: 30 }, '/images/texture/tile.jpg').then(wallLeft => {
  wallLeft.rotation.y = Math.PI / 2; // Rotate left segment of the wall
                     
  wallLeft.scale.set(0.5, 1, 2); // Shrink width to create space for the door
  wallLeft.position.set(24, 2, -24); // Adjust position to the left side
});

//top second path
loadWall(scene, { x: 3, y: 2, z: 3 }, '/images/texture/tile.jpg').then(wallRight => {
  wallRight.rotation.y = Math.PI / 2; // Rotate right segment of the wall
  wallRight.scale.set(2, 0.4, 2); // Shrink width to create space for the door
  wallRight.position.set(24, 16, -11); // Adjust position to the right side
});
//entrance wall
loadWall(scene, { x: 20, y: 2, z: 30 }, '/images/texture/tile.jpg').then(wallLeft => {                
  wallLeft.scale.set(0.453, 1, 2); // Shrink width to create space for the door
  wallLeft.position.set(22, 2, 23.6); // Adjust position to the left side
});
//entrance wall 2
loadWall(scene, { x: 20, y: 2, z: 30 }, '/images/texture/tile.jpg').then(wallLeft => {   
               
  wallLeft.scale.set(0.5, 1, 2); // Shrink width to create space for the door
  wallLeft.position.set(14, 2, -30); // Adjust position to the left side
});



animate();
