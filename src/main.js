import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import {createScene} from "./scene.js";
import {createPointLight, createAmbientLight} from "./lights.js";
import {createBasicSphere, createStandardSphere, createStandardRing, createStandardOrbitalRing} from "./objects.js";
import {createControl} from "./controls.js";

//Dimensions
const w = window.innerWidth;
const h = window.innerHeight;

//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w,h)
document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(90, w/h, 0.1, 4000);
camera.position.set(150,10,100);
camera.lookAt(0,0,0);

//Scene
const scene = createScene(0x000000);

//Lights
const pointLight = createPointLight(scene, 0xFFFFFF, 500,0,0.9);
pointLight.position.set(0,0,0);

const AmbientLight = createAmbientLight(scene, 0xFFFFFF,.3);

/*************************************************************/
/************************** TEXTURES *************************/
/*************************************************************/

//Texture Loaders
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load("./public/textures/sun.jpg")
const earthTexture = textureLoader.load("./public/textures/earth.jpg");
const jupiterTexture = textureLoader.load("./public/textures/jupiter.jpg");
const marsTexture = textureLoader.load("./public/textures/mars.jpg");
const mercuryTexture = textureLoader.load("./public/textures/mercury.jpg");
const moonTexture = textureLoader.load("./public/textures/moon.jpg");
const neptuneTexture = textureLoader.load("./public/textures/neptune.jpg");
const saturnTexture = textureLoader.load("./public/textures/saturn.jpg");
const saturnRingTexture = textureLoader.load("./public/textures/saturn_ring.png");
const uranusTexture = textureLoader.load("./public/textures/uranus.jpg");
const venusTexture = textureLoader.load("./public/textures/venus.jpg");

saturnRingTexture.wrapS = THREE.ClampToEdgeWrapping;
saturnRingTexture.wrapT = THREE.ClampToEdgeWrapping;
saturnRingTexture.colorSpace = THREE.SRGBColorSpace;
saturnRingTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();


/*************************************************************/
/******************* SOLAR SYSTEM & PLANETS ******************/
/*************************************************************/

//Planets values
const PLANETS_VALUES = [
  { name: "Mercury", radius: 12, distance: 100,  texture: mercuryTexture, orbitSpeed: 0.020, rotationSpeed: 0.0040 },
  { name: "Venus",   radius: 20, distance: 170,  texture: venusTexture,   orbitSpeed: 0.015, rotationSpeed: 0.0015 },
  { name: "Earth",   radius: 22, distance: 240,  texture: earthTexture,   orbitSpeed: 0.010, rotationSpeed: 0.0200 },
  { name: "Mars",    radius: 16, distance: 320,  texture: marsTexture,    orbitSpeed: 0.008, rotationSpeed: 0.0180 },
  { name: "Jupiter", radius: 32, distance: 500,  texture: jupiterTexture, orbitSpeed: 0.004, rotationSpeed: 0.0400 },
  { name: "Saturn",  radius: 28, distance: 820,  texture: saturnTexture,  orbitSpeed: 0.003, rotationSpeed: 0.0360 },
  { name: "Uranus",  radius: 22, distance: 1120, texture: uranusTexture,  orbitSpeed: 0.002, rotationSpeed: 0.0240 },
  { name: "Neptune", radius: 21, distance: 1500, texture: neptuneTexture, orbitSpeed: 0.001, rotationSpeed: 0.0220 }
];

const PLANETS = new Array(PLANETS_VALUES.length + 1);


//Create sphere for sun
const sunSphere = createBasicSphere(scene, sunTexture, 50, 64, 64);
sunSphere.position.set(0,0,0);
PLANETS[0] = {object: sunSphere, orbitSpeed: 0.000, rotationSpeed: 0.008};


//Create a pivot object for each planet
const PIVOTS = new Array(PLANETS.length - 1);
for (let i = 0; i < PIVOTS.length; i++) {
    PIVOTS[i] = {object: new THREE.Object3D(), orbitSpeed: PLANETS_VALUES[i].orbitSpeed}
    PIVOTS[i].object.rotation.y = Math.random() * Math.PI * 2;
    scene.add(PIVOTS[i].object);
}

//Now create a sphere for each planet
for(let i = 0; i<PLANETS_VALUES.length; i++){
    PLANETS[i+1] = {
        object: createStandardSphere(PIVOTS[i].object, PLANETS_VALUES[i].texture, PLANETS_VALUES[i].radius, 64, 64), 
        rotationSpeed: PLANETS_VALUES[i].rotationSpeed 
    };
    PLANETS[i+1].object.position.set(0, 0, PLANETS_VALUES[i].distance);
}

//Saturn ring
const ring = createStandardRing(PLANETS[6].object, saturnRingTexture, 32, 55, 64);
ring.rotation.x = Math.PI / 2;

//Orbital Rings for each planet
const ORBITAL_RINGS = new Array(PLANETS_VALUES.length);
for (let i = 0; i < ORBITAL_RINGS.length; i++) {
    ORBITAL_RINGS[i] = createStandardOrbitalRing(
        scene, 
        0xFFFFFF,
        PLANETS_VALUES[i].distance - 1,
        PLANETS_VALUES[i].distance + 1,
        64
    )
    ORBITAL_RINGS[i].rotation.x = Math.PI / 2;
}

/*************************************************************/
/************************ FUNCTIONALITY **********************/
/*************************************************************/

//Render
renderer.render(scene, camera);

//Controls
const controls = createControl(camera, renderer);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 120;
controls.maxDistance = 1500;
controls.enablePan = true;

//Resize EventListener
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});


//Animate
function animate(){
    requestAnimationFrame(animate);
    PLANETS.forEach((p) =>{
        p.object.rotation.y += p.rotationSpeed;
    });
    PIVOTS.forEach((p) => {
        p.object.rotation.y += p.orbitSpeed / 4;
    });
    controls.update();
    renderer.render(scene, camera);
}

animate();