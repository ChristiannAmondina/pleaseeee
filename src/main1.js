//================================================================
// Imports
//================================================================
import './assets/styles.css'; // Adjust the path as necessary
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GUI } from 'dat.gui'; // Import dat.GUI
import { createChair, createTable } from './js/objects.js';
import { createChair } from './js/objects.js';
import { FPSControls } from './js/FPSControls'; // Import FPSControls from separate file

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

//================================================================
// Fog Setup
//================================================================
let fogDensity = 0; // Default density for fog
let fogColor = new THREE.Color(0xaaaaaa); // Set initial fog color (light gray)
scene.fog = new THREE.FogExp2(fogColor, fogDensity); // Exponential fog (color, density)

//================================================================
// Lighting Setup
//================================================================
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light to illuminate all objects
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
directionalLight.position.set(10, 10, 10).normalize(); // Light source position
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // For softer shadows

//================================================================
// Wall Setup (Front, Back, Left, Right)
//================================================================

// Front Wall
const frontWallTexture = textureLoader.load('images/texture/tile.jpg'); // Front wall texture
frontWallTexture.wrapS = THREE.RepeatWrapping;
frontWallTexture.wrapT = THREE.RepeatWrapping;
frontWallTexture.repeat.set(30, 10); // Scale texture to fit

const frontWallMaterial = new THREE.MeshStandardMaterial({ map: frontWallTexture, side: THREE.DoubleSide });
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 1), frontWallMaterial);
frontWall.position.z = -50;
frontWall.castShadow = true;
frontWall.receiveShadow = true;
scene.add(frontWall);

// Back Wall
const backWallTexture = textureLoader.load('images/texture/tile.jpg'); // Back wall texture
backWallTexture.wrapS = THREE.RepeatWrapping;
backWallTexture.wrapT = THREE.RepeatWrapping;
backWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const backWallMaterial = new THREE.MeshStandardMaterial({ map: backWallTexture, side: THREE.DoubleSide });
const backWall = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 1), backWallMaterial);
backWall.position.z = 50;
backWall.castShadow = true;
backWall.receiveShadow = true;
scene.add(backWall);

// Left Wall
const leftWallTexture = textureLoader.load('images/texture/tile.jpg'); // Left wall texture
leftWallTexture.wrapS = THREE.RepeatWrapping;
leftWallTexture.wrapT = THREE.RepeatWrapping;
leftWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const leftWallMaterial = new THREE.MeshStandardMaterial({ map: leftWallTexture, side: THREE.DoubleSide });
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), leftWallMaterial);
leftWall.position.x = -50;
leftWall.castShadow = true;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right Wall
const rightWallTexture = textureLoader.load('images/texture/tile.jpg'); // Right wall texture
rightWallTexture.wrapS = THREE.RepeatWrapping;
rightWallTexture.wrapT = THREE.RepeatWrapping;
rightWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const rightWallMaterial = new THREE.MeshStandardMaterial({ map: rightWallTexture, side: THREE.DoubleSide });
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), rightWallMaterial);
rightWall.position.x = 50;
rightWall.castShadow = true;
rightWall.receiveShadow = true;
scene.add(rightWall);

//================================================================
// Ceiling and Floor Setup
//================================================================

// Ceiling
const ceilingTexture = textureLoader.load('images/texture/tile.jpg'); // Ceiling texture
ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(30, 10); // Adjust the repeat scale

const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture, side: THREE.DoubleSide });
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 20; // Place it above the floor
ceiling.receiveShadow = true;
scene.add(ceiling);

// Floor
const floorTexture = textureLoader.load('images/texture/tile.jpg'); // Floor texture (same texture as ceiling)
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(30, 10); // Adjust the repeat scale

const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.DoubleSide });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMaterial);
floor.rotation.x = Math.PI / -2; // Rotate to make it horizontal
floor.position.y = 0; // Place it on the ground
floor.receiveShadow = true;
scene.add(floor);

//================================================================
// Camera Setup
//================================================================
camera.position.set(0, 5, 30); // New height of 5

// Setup OrbitControls for environment editing
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.25;
orbitControls.screenSpacePanning = false;
orbitControls.zoomSpeed = 2;
orbitControls.minDistance = 10;
orbitControls.maxDistance = 200;

// Setup PointerLockControls for first-person movement
const pointerLockControls = new PointerLockControls(camera, renderer.domElement);
scene.add(pointerLockControls.getObject());

// Instantiate FPSControls
const fpsControls = new FPSControls(camera, scene, pointerLockControls);

let isFirstPerson = false;
const clock = new THREE.Clock();

// Event listener to toggle between modes
document.addEventListener('click', () => {
  if (!isFirstPerson) {
    pointerLockControls.lock();
    isFirstPerson = true;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isFirstPerson) {
    pointerLockControls.unlock();
    isFirstPerson = false;
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (isFirstPerson) {
    fpsControls.update(delta); // Update first-person movement
  } else {
    orbitControls.update(); // Update orbit controls
  }

  renderer.render(scene, camera);
}

// Set initial camera position and start animation loop
camera.position.set(0, 10, 30);
// Load models once
createChair(scene);
createTable(scene);
animate();
