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
        linewidth: 1, // píxeles
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

export function createRandomStars(scene) {

    const geometry = new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 5000; i++) {

        // Dirección aleatoria
        const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();

        // Distancia al origen
        const distance = THREE.MathUtils.randFloat(3000, 3900);

        direction.multiplyScalar(distance);

        positions.push(
            direction.x,
            direction.y,
            direction.z
        );
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: true,
        opacity: 0.2
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

export function createAsteroidsRing(scene, texture, innerRadius, outerRadius) {

    const asteroidCount = 4000;

    // Una geometría sencilla que parece una roca
    const geometry = new THREE.IcosahedronGeometry(7, 0);

    const material = new THREE.MeshStandardMaterial({
        //color: 0x6f6f6f,
        map: texture,
        roughness: 1,
        metalness: 0
    });

    const asteroids = new THREE.InstancedMesh(
        geometry,
        material,
        asteroidCount
    );

    const dummy = new THREE.Object3D();

    for (let i = 0; i < asteroidCount; i++) {

        // Ángulo alrededor del Sol
        const angle = Math.random() * Math.PI * 2;

        // Radio del cinturón
        const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);

        // Espesor vertical
        const y = THREE.MathUtils.randFloat(-20, 20);

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        dummy.position.set(x, y, z);

        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        const scale = THREE.MathUtils.randFloat(0.2, 0.8);

        dummy.scale.setScalar(scale);

        dummy.updateMatrix();

        asteroids.setMatrixAt(i, dummy.matrix);
    }

    asteroids.instanceMatrix.needsUpdate = true;

    scene.add(asteroids);

    return asteroids;
}
