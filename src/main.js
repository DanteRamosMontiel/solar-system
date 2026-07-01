import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import {createScene} from "./scene.js";
import {createPointLight, createAmbientLight} from "./lights.js";
import {createBasicSphere, createStandardSphere} from "./objects.js";
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
const pointLight = createPointLight(scene, 0xFFFFFF, 50000);
pointLight.position.set(0,0,0);

const AmbientLight = createAmbientLight(scene, 0xFFFFFF,.3);

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
const uranusTexture = textureLoader.load("./public/textures/uranus.jpg");
const venusTexture = textureLoader.load("./public/textures/venus.jpg");

//Planets values
const PLANETS_VALUES = [
  { name: "Mercury", radius: 12, distance: 100,  texture: mercuryTexture },
  { name: "Venus",   radius: 20, distance: 170,  texture: venusTexture   },
  { name: "Earth",   radius: 22, distance: 240,  texture: earthTexture   },
  { name: "Mars",    radius: 16, distance: 320,  texture: marsTexture    },
  { name: "Jupiter", radius: 32, distance: 500,  texture: jupiterTexture },
  { name: "Saturn",  radius: 28, distance: 820,  texture: saturnTexture  },
  { name: "Uranus",  radius: 22, distance: 1120, texture: uranusTexture  },
  { name: "Neptune", radius: 21, distance: 1500, texture: neptuneTexture }
];

const PLANETS = new Array(PLANETS_VALUES.length);


//Create sphere for each planet
const sunSphere = createBasicSphere(scene, sunTexture, 50, 64, 64);
sunSphere.position.set(0,0,0);

for(let i = 0; i<PLANETS_VALUES.length; i++){
    PLANETS[i] = { name: PLANETS_VALUES[i].name, object: createStandardSphere(scene, PLANETS_VALUES[i].texture, PLANETS_VALUES[i].radius, 64, 64) };
    PLANETS[i].object.position.set(0, 0, PLANETS_VALUES[i].distance);
}

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
    controls.update();
    renderer.render(scene, camera);
}

animate();