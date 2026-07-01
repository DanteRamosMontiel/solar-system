import * as THREE from "three";

export function createBasicSphere(scene, texture, radius, widthSegments, heightSegments){
    const sphrGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sphrMat = new THREE.MeshBasicMaterial({map: texture});
    const sphere = new THREE.Mesh(sphrGeo, sphrMat);

    scene.add(sphere);

    return sphere;
}

export function createStandardSphere(scene, texture, radius, widthSegments, heightSegments){
    const sphrGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sphrMat = new THREE.MeshStandardMaterial({map: texture});
    const sphere = new THREE.Mesh(sphrGeo, sphrMat);

    scene.add(sphere);

    return sphere;
}