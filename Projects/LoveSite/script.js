// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Your previous setup code remains unchanged...

// Create a plane geometry (as a background)
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/Projects/LoveSite/images/hearts.jpg');
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Include the necessary water-related components from three.js-water library
const Water = new THREE.Water(renderer, camera, scene);

// Create a water mesh
const waterGeometry = new THREE.PlaneGeometry(10, 10);
const water = new Water(waterGeometry, {
  color: 0x001e0f,
  scale: 4,
  flowDirection: new THREE.Vector2(1, 1),
});

water.rotation.x = -Math.PI / 2;
scene.add(water);

// Function to toggle water effect
function toggleWaterEffect(activate) {
  if (activate) {
    water.visible = true;
    // Add logic to start the water effect when mouse is over
  } else {
    water.visible = false;
    // Add logic to stop the water effect when mouse leaves
  }
}

// Event listener for mouse over
planeMesh.addEventListener('mouseenter', () => {
  toggleWaterEffect(true);
});

// Event listener for mouse out
planeMesh.addEventListener('mouseleave', () => {
  toggleWaterEffect(false);
});

// Animate function
function animate() {
  requestAnimationFrame(animate);

  // Update water material
  water.material.uniforms.time.value += 1.0 / 60.0;

  renderer.render(scene, camera);
}
animate();
