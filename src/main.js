import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { createScene } from "./scene.js";
import { createPointLight, createAmbientLight, createLensFlare } from "./lights.js";
import { createRandomStars, createAsteroidsRing, createBasicSphere, createStandardSphere, createStandardRing, createStandardOrbitalRing, createBasicOrbitalRing, createBackgroundSphere } from "./objects.js";
import { createControl } from "./controls.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";
import { CSS2DRenderer, CSS2DObject } from "jsm/renderers/CSS2DRenderer.js";


//Dimensions
const w = window.innerWidth;
const h = window.innerHeight;

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement);

//Label Renderer (for planets names)
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(w, h);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

//Function to create labels
function createPlanetLabel(text) {
    const div = document.createElement("div");
    div.className = "planet-label";
    div.textContent = text;

    return new CSS2DObject(div);
}

//To check if labels must be hidden
const raycaster = new THREE.Raycaster();
const labelEntries = []; //{label, mesh}

//Camera
const camera = new THREE.PerspectiveCamera(90, w / h, 0.1, 8000);
camera.position.set(150, 10, 100);
camera.lookAt(0, 0, 0);

//Scene
const scene = createScene(0x000000);

//Composer (for blooming)
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2, //strength
    0.35, //radius
    0.86  //threshold
);

composer.addPass(bloomPass);

//Lights
const pointLight = createPointLight(scene, 0xFFFFFF, 500, 0, 0.9);
pointLight.position.set(0, 0, 0);

const AmbientLight = createAmbientLight(scene, 0xFFFFFF, .3);

/*************************************************************/
/************************** TEXTURES *************************/
/*************************************************************/

//Loading screen
const loadingScreen = document.querySelector("#loading-screen");
const loadingBarFill = document.querySelector("#loading-bar-fill");
const loadingPercent = document.querySelector("#loading-percent");

const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const pct = Math.round((itemsLoaded / itemsTotal) * 100);
    loadingBarFill.style.width = pct + "%";
    loadingPercent.textContent = pct + "%";
};

loadingManager.onLoad = () => {
    loadingBarFill.style.width = "100%";
    loadingPercent.textContent = "100%";
    setTimeout(() => {
        loadingScreen.classList.add("loaded");
    }, 300);
};

//Texture Loaders
const textureLoader = new THREE.TextureLoader(loadingManager);
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
const backgroundTexture = textureLoader.load("./public/textures/milky_way.jpg", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace
});

saturnRingTexture.wrapS = THREE.ClampToEdgeWrapping;
saturnRingTexture.wrapT = THREE.ClampToEdgeWrapping;
saturnRingTexture.colorSpace = THREE.SRGBColorSpace;
saturnRingTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

createLensFlare(pointLight);

//Sphere for background
const background = createBackgroundSphere(scene, backgroundTexture);


/*************************************************************/
/******************* SOLAR SYSTEM & PLANETS ******************/
/*************************************************************/

//Create random stars
createRandomStars(scene);

//Create asteroids ring (between mars an jupiter)
const asteroidsRingPivot = new THREE.Object3D();
scene.add(asteroidsRingPivot);
createAsteroidsRing(asteroidsRingPivot, moonTexture, 560, 870);

//Planets values
const PLANETS_VALUES = [
    { name: "Mercury", radius: 12, distance: 90, texture: mercuryTexture, orbitSpeed: 0.020, rotationSpeed: 0.0040 },
    { name: "Venus", radius: 20, distance: 160, texture: venusTexture, orbitSpeed: 0.015, rotationSpeed: 0.0015 },
    { name: "Earth", radius: 22, distance: 230, texture: earthTexture, orbitSpeed: 0.010, rotationSpeed: 0.0600 },
    { name: "Mars", radius: 16, distance: 360, texture: marsTexture, orbitSpeed: 0.008, rotationSpeed: 0.0180 },
    { name: "Jupiter", radius: 32, distance: 1120, texture: jupiterTexture, orbitSpeed: 0.004, rotationSpeed: 0.0400 },
    { name: "Saturn", radius: 28, distance: 1700, texture: saturnTexture, orbitSpeed: 0.003, rotationSpeed: 0.0360 },
    { name: "Uranus", radius: 22, distance: 2000, texture: uranusTexture, orbitSpeed: 0.002, rotationSpeed: 0.0240 },
    { name: "Neptune", radius: 21, distance: 2400, texture: neptuneTexture, orbitSpeed: 0.001, rotationSpeed: 0.0220 }
];

const PLANETS = new Array(PLANETS_VALUES.length + 1);


//Create sphere for sun
const sunSphere = createBasicSphere(scene, sunTexture, 50, 64, 64);
sunSphere.position.set(0, 0, 0);
PLANETS[0] = { object: sunSphere, orbitSpeed: 0.000, rotationSpeed: 0.001 };

const sunLabel = createPlanetLabel("Sun");
sunLabel.position.set(0, 60, 0);
sunSphere.add(sunLabel);
labelEntries.push({ label: sunLabel, mesh: sunSphere });


//Create a pivot object for each planet
const PIVOTS = new Array(PLANETS.length - 1);
for (let i = 0; i < PIVOTS.length; i++) {
    PIVOTS[i] = { object: new THREE.Object3D(), orbitSpeed: PLANETS_VALUES[i].orbitSpeed }
    PIVOTS[i].object.rotation.y = Math.random() * Math.PI * 2;
    scene.add(PIVOTS[i].object);
}

//Pivot manual correction
PIVOTS[0].object.position.z = 18;
PIVOTS[1].object.position.x = -5;
PIVOTS[3].object.position.x = -30;

//Now create a sphere for each planet
for (let i = 0; i < PLANETS_VALUES.length; i++) {
    PLANETS[i + 1] = {
        object: createStandardSphere(PIVOTS[i].object, PLANETS_VALUES[i].texture, PLANETS_VALUES[i].radius, 64, 64),
        rotationSpeed: PLANETS_VALUES[i].rotationSpeed
    };
    PLANETS[i + 1].object.position.set(0, 0, PLANETS_VALUES[i].distance);

    const label = createPlanetLabel(PLANETS_VALUES[i].name);
    label.position.set(0, PLANETS_VALUES[i].radius + 10, 0);
    PLANETS[i + 1].object.add(label);
    labelEntries.push({ label, mesh: PLANETS[i + 1].object });
}

//Saturn ring
const ring = createStandardRing(PLANETS[6].object, saturnRingTexture, 32, 55, 64);
ring.rotation.x = Math.PI / 2;

//Moon
const moonPivot = new THREE.Object3D();
PIVOTS[2].object.add(moonPivot);
moonPivot.position.set(0,0,PLANETS_VALUES[2].distance);
const moon = createStandardSphere(moonPivot, moonTexture, 6, 64, 64);
moon.position.z += 31;


//Orbital Rings for each planet
const ORBITAL_RINGS = new Array(PLANETS_VALUES.length);
for (let i = 0; i < ORBITAL_RINGS.length; i++) {
    const distance = PLANETS_VALUES[i].distance;
    ORBITAL_RINGS[i] = createBasicOrbitalRing(
        scene,
        0x9abdf5,
        distance
    );
}

//Orbital Rings manual correction
ORBITAL_RINGS[0].position.z = 18;
ORBITAL_RINGS[1].position.x = -5;
ORBITAL_RINGS[3].position.x = -30;

ORBITAL_RINGS[2].opacity = 0;



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
controls.maxDistance = 3000;
controls.enablePan = false;

//Resize EventListener
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

//Slider 
let timeScale = 1;
const slider = document.querySelector("#slider");
const speedValue = document.querySelector("#speed-value");

function formatSpeed(value) {
    if (value < 0.001) return value.toExponential(1) + "x";
    if (value < 10) return value.toFixed(2) + "x";
    if (value < 100) return value.toFixed(1) + "x";
    return Math.round(value) + "x";
}

speedValue.textContent = formatSpeed(timeScale);

slider.addEventListener("input", () => {
    const t = slider.value / 100;   //0 → 1
    timeScale = Math.pow(1000, t);  //1x → 1000x
    speedValue.textContent = formatSpeed(timeScale);
});

//Zoom in/out buttons
const zoomInBtn = document.querySelector("#zoom-in");
const zoomOutBtn = document.querySelector("#zoom-out");
const zoomDirection = new THREE.Vector3();

function zoomCamera(factor) {
    zoomDirection.subVectors(camera.position, controls.target);
    const currentDistance = zoomDirection.length();
    const newDistance = THREE.MathUtils.clamp(
        currentDistance * factor,
        controls.minDistance,
        controls.maxDistance
    );

    zoomDirection.setLength(newDistance);
    camera.position.copy(controls.target).add(zoomDirection);
    controls.update();
}

zoomInBtn.addEventListener("click", () => zoomCamera(0.8));
zoomOutBtn.addEventListener("click", () => zoomCamera(1.25));

//Hides the label in case that it has a planet in front
const occluders = PLANETS.map((p) => p.object); //sun + planest
const labelWorldPos = new THREE.Vector3();

function updateLabelsVisibility() {
    labelEntries.forEach(({ label, mesh }) => {
        label.getWorldPosition(labelWorldPos);

        const distToLabel = camera.position.distanceTo(labelWorldPos);
        const dir = labelWorldPos.clone().sub(camera.position).normalize();

        raycaster.set(camera.position, dir);
        const hits = raycaster.intersectObjects(occluders, false);

        //If the nearest object in that direction its in front of the label
        const occluded = hits.length > 0 && hits[0].distance < distToLabel - 1;

        label.element.style.opacity = occluded ? 0 : 1;
    });
}

//Animate
function animate() {
    requestAnimationFrame(animate);
    PLANETS.forEach((p) => {
        p.object.rotation.y += p.rotationSpeed * timeScale;
    });
     PIVOTS.forEach((p) => {
         p.object.rotation.y += p.orbitSpeed * timeScale / 4;
     });
    moonPivot.rotation.y += 0.04 * timeScale;
    background.rotation.y += 0.0002 + timeScale * 0.00001;
    asteroidsRingPivot.rotation.y += 0.0001 * timeScale;
    controls.update();
    composer.render();
    labelRenderer.render(scene, camera);
    updateLabelsVisibility();
}

animate();