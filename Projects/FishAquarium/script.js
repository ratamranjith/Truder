import * as THREE from 'https://threejs.org/build/three.module.js';
import { OBJLoader } from './OBJLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new OBJLoader();
let fishModel;

loader.load('/Projects/FishAquarium/images/Fish.obj', (obj) => {
    fishModel = obj;
    scene.add(fishModel);
    console.log('Fish model loaded successfully:', fishModel);
}, undefined, (error) => {
    console.error('Error loading fish model:', error);
});

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    if (fishModel) {
        fishModel.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

animate();
