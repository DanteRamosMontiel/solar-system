import * as THREE from "three";

export function createDirectionalLight(scene, color, intensity){
    const dl = new THREE.DirectionalLight(color, intensity);

    scene.add(dl);

    return dl;
}

export function createPointLight(scene, color, intensity, distance, decay){
    const pl = new THREE.PointLight(color, intensity, distance, decay);

    scene.add(pl);

    return pl;
}

export function createAmbientLight(scene, color, intensity){
    const al = new THREE.AmbientLight(color, intensity);

    scene.add(al);

    return al;
}