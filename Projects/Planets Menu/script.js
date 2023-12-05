// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create planets
const createPlanet = (radius, color, position) => {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(position.x, position.y, position.z);
    scene.add(planet);
    return planet;
};

// Create stars (a starry background)
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF });

const starVertices = [];
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('path/to/your/earth.jpg');

// Create Earth with the loaded texture
const earthGeometry = new THREE.SphereGeometry(1.6, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Position the camera
camera.position.set(0, 0, 5); // Place the camera 5 units away from the scene's origin along the z-axis
camera.lookAt(scene.position); // Make the camera look at the center of the scene

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1); // Set light position
scene.add(directionalLight);

// ... (Other parts of your code remain unchanged)


// Create Mars (assuming you have defined the createPlanet function)
const mars = createPlanet(0.7, 0xff0000, { x: 10, y: 0, z: 0 });
scene.add(mars); // Add Mars to the scene


starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Handle click events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Assuming the first object intersected is the planet
        const selectedObject = intersects[0].object;

        // Display your menu or perform actions for the clicked planet
        // For example:
        displayMenu(selectedObject.name);
    }
}

function displayMenu(planetName) {
    // Implement your logic to display a menu or information about the clicked planet
    console.log(`Clicked on ${planetName}`);
}

// Event listener for click
window.addEventListener('click', onClick);

// Set camera position
camera.position.z = 10;

// Render loop
function animate() {
    requestAnimationFrame(animate);
    // Rotate planets or perform other animations here
    // Rotate planets
    earth.rotation.y += 0.01; // Rotating Earth around its y-axis
    mars.rotation.y -= 0.01; // Rotating Mars around its y-axis in the opposite direction

    renderer.render(scene, camera);
}
animate();