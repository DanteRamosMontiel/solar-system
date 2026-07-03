import * as THREE from "three";
import { Line2 } from "jsm/lines/Line2.js";
import { LineMaterial } from "jsm/lines/LineMaterial.js";
import { LineGeometry } from "jsm/lines/LineGeometry.js";

export function createBasicSphere(scene, texture, radius, widthSegments, heightSegments) {
    const sphrGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sphrMat = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphrGeo, sphrMat);

    scene.add(sphere);

    return sphere;
}

export function createStandardSphere(scene, texture, radius, widthSegments, heightSegments) {
    const sphrGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sphrMat = new THREE.MeshStandardMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphrGeo, sphrMat);

    scene.add(sphere);

    return sphere;
}

export function createStandardRing(scene, texture, innerRadius, outerRadius, thetaSegments) {
    const ringGeo = new THREE.RingGeometry(
        innerRadius,
        outerRadius,
        thetaSegments
    );

    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const v = new THREE.Vector3();


    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);

        const r = v.length();

        uv.setXY(
            i,
            (r - innerRadius) / (outerRadius - innerRadius),
            0.5
        );
    }

    uv.needsUpdate = true;

    const ringMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);

    scene.add(ring);

    return ring;
}

export function createStandardOrbitalRing(scene, color, innerRadius, outerRadius, thetaSegments) {
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);

    const ringMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), side: THREE.DoubleSide, transparent: true, depthWrite: false });

    const ring = new THREE.Mesh(ringGeo, ringMat);

    scene.add(ring);

    return ring;
}

export function createBasicOrbitalRing(scene, color, radius) {

    const points = [];

    for (let i = 0; i <= 360; i++) {
        const angle = THREE.MathUtils.degToRad(i);

        points.push(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
    }

    const geometry = new LineGeometry();
    geometry.setPositions(points);

    const material = new LineMaterial({
        color,
        linewidth: 2, // píxeles
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
    });

    material.resolution.set(window.innerWidth, window.innerHeight);

    const ring = new Line2(geometry, material);
    ring.computeLineDistances();

    scene.add(ring);

    return ring;
}

export function createBackgroundSphere(scene, texture) {
    const geometry = new THREE.SphereGeometry(4000, 64, 64);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });

    const background = new THREE.Mesh(geometry, material);

    scene.add(background);

    return background
}