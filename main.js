// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let scene, camera, renderer, controls;
let animationCamera;
let verticalAnimationCamera;

let cgear1, ogear2;
let cgear3, ogear4;
let cgear5, ogear6;
let igear7, cgear8;

let inputshaft, countershaft, outputshaft, drivetrain_shaft, shaft_to_wheels;
let connector1, connector2;
let right_shiftfork, left_shiftfork;
let gearlever;

let tire_back_left, tire_back_right, tire_front_left, tire_front_right;
let roadPlane;
let roadTexture; 
let skyboxSphere;
let car;
let roofLeft, roofRight;


// Lighting references
let ambientLight, headlight, directionalLight;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    shift: false,
    g: false
};

// Movement speed
const moveSpeed = 0.2;
const fastMoveSpeed = 0.4; // Speed when holding Shift

// Gear system
let currentGear = 0; // Current active gear (0=neutral, 1-4)
let selectedGear = null; // Gear selected while G is held
let isGearshiftOpen = false;

// Store connector positions
let connector1NeutralPos = null; // Neutral position (first position)
let connector2NeutralPos = null;
let connector1OriginalPos = null; // Original position before adjustment
let connector2OriginalPos = null;

// Store gear lever neutral rotation
let gearLeverNeutralRotX = null;
let gearLeverNeutralRotZ = null;

// Store car original position
let carOriginalPosition = null;

// H-pattern movement state for gear lever
let gearLeverTargetRotX = null;
let gearLeverTargetRotZ = null;
let gearLeverMovementState = 'idle'; // States: 'idle', 'toNeutralZ', 'toNeutralX', 'toTargetX', 'toTargetZ'
let previousGear = null; // Track previous gear to detect changes

// GUI settings object
const guiSettings = {
    camera: {
        fov: 60,
        cameraMode: 'main' // 'main', 'animation1', 'animation2', 'thirdPerson'
    },
    lighting: {
        ambientEnabled: true,
        ambientIntensity: 3.5,
        directionalEnabled: true,
        directionalIntensity: 3.5,
        headlightEnabled: true,
        headlightIntensity: 10,
        headlightColor: '#ffffff',
        headlightDistance: 100,
        headlightAngle: 30,
        headlightPenumbra: 0.3,
        headlightDecay: 1
    },
    car: {
        bodyVisible: false, // Show/hide car body
        bodyHeight: 100, // Height above ground when visible (will be animated)
        roofVisible: true, // Show/hide roof
        roadVisible: true, // Show/hide road
        engineSpeed: 1.0 // Engine speed (0.5 to 3)
    }
};

let gui;
// Store main camera position when switching modes
let savedMainCameraPosition = null;
let positionSaved = false;

// ============================================================================
// INITIALIZATION
// ============================================================================

init();
setupCamera();
setupLighting();
setupSceneObjects();
setupSettingsMenu(); 
loadGears();
setupKeyboardControls();
setupAboutModal();
setupGearshiftGUI();
animate();

// ============================================================================
// CAMERA SETUP AND CONTROLS
// ============================================================================

function setupCamera() {
    // Main camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    camera.position.set(30, 30, 60);

    // OrbitControls - Set target to be in front of camera so it rotates around camera's own center
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    controls.target.copy(camera.position).add(forward.multiplyScalar(1));

    // Animation horizontal around transmission
    animationCamera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    animationCamera.position.set(10, 20, 50);

    // Animation vertical around transmission
    verticalAnimationCamera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    verticalAnimationCamera.position.set(50, 50, 0); 

    setupCameraAnimation();
    setupVerticalCameraAnimation();
}

function setupCameraAnimation() {
    const positions = [
        { x: 10, y: 20, z: 50 },
        { x: 50, y: 20, z: 0 },
        { x: 10, y: 20, z: -50 },
        { x: -50, y: 20, z: 0 },
        { x: 10, y: 20, z: 50 } 
    ];
    
    const duration = 3; // Duration for each segment in seconds
    const centerX = 10, centerY = 0, centerZ = 0; // Transmission center

    // Create infinite animation timeline
    const tl = gsap.timeline({ repeat: -1, ease: "none" });

    // Set initial position
    animationCamera.position.set(positions[0].x, positions[0].y, positions[0].z);
    animationCamera.lookAt(centerX, centerY, centerZ);

    // Animate through each position
    for (let i = 1; i < positions.length; i++) {
        tl.to(animationCamera.position, {
            x: positions[i].x,
            y: positions[i].y,
            z: positions[i].z,
            duration: duration,
            ease: "none",
            onUpdate: function() {
                // Make camera look at transmission 
                animationCamera.lookAt(centerX, centerY, centerZ);
            }
        });
    }
}

function setupVerticalCameraAnimation() {
    const positions = [
        { x: 10, y: 20, z: 50 },
        { x: 10, y: 40, z: 0 },
        { x: 10, y: 20, z: -50 },
        { x: 10, y: -20, z: 0 },
        { x: 10, y: 20, z: 50 }
    ];
    
    const duration = 3; // Duration for each segment in seconds
    const centerX = 10, centerY = 0, centerZ = 0; // Transmission center

    // Create infinite animation timeline
    const tl = gsap.timeline({ repeat: -1, ease: "none" });

    // Set initial position
    verticalAnimationCamera.position.set(positions[0].x, positions[0].y, positions[0].z);
    verticalAnimationCamera.lookAt(centerX, centerY, centerZ);

    // Animate through each position
    for (let i = 1; i < positions.length; i++) {
        tl.to(verticalAnimationCamera.position, {
            x: positions[i].x,
            y: positions[i].y,
            z: positions[i].z,
            duration: duration,
            ease: "none",
            onUpdate: function() {
                // Make camera look at transmission 
                verticalAnimationCamera.lookAt(centerX, centerY, centerZ);
            }
        });
    }
}

function handleCameraMovement() {
    const direction = new THREE.Vector3();

    // Get camera's forward direction (negative Z in camera space)
    camera.getWorldDirection(direction);

    // Get camera's right direction (cross product of forward and up)
    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    // Determine current movement speed (faster if shift is held)
    const currentSpeed = keys.shift ? fastMoveSpeed : moveSpeed;

    // Calculate movement vector
    const moveVector = new THREE.Vector3();

    if (keys.w) {
        // Move forward
        moveVector.add(direction.clone().multiplyScalar(currentSpeed));
    }
    if (keys.s) {
        // Move backward
        moveVector.add(direction.clone().multiplyScalar(-currentSpeed));
    }
    if (keys.a) {
        // Move left (strafe)
        moveVector.add(right.clone().multiplyScalar(-currentSpeed));
    }
    if (keys.d) {
        // Move right (strafe)
        moveVector.add(right.clone().multiplyScalar(currentSpeed));
    }
    if (keys.arrowup) {
        // Move up
        moveVector.add(camera.up.clone().multiplyScalar(currentSpeed));
    }
    if (keys.arrowdown) {
        // Move down
        moveVector.add(camera.up.clone().multiplyScalar(-currentSpeed));
    }

    if (moveVector.length() > 0) {
        camera.position.add(moveVector);
        return true; // Camera moved
    }
    return false; // Camera didn't move
}

function updateCamera() {
    // Handle WASD camera movement
    const cameraMoved = handleCameraMovement();

    // Update OrbitControls target to follow camera when it moves via WASD
    // This keeps rotation centered around camera position
    if (cameraMoved) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        controls.target.copy(camera.position).add(forward.multiplyScalar(1));
    }

    controls.update();
}

function onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    if (animationCamera) {
        animationCamera.aspect = aspect;
        animationCamera.updateProjectionMatrix();
    }
    if (verticalAnimationCamera) {
        verticalAnimationCamera.aspect = aspect;
        verticalAnimationCamera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================================================
// LIGHTING SETUP
// ============================================================================

function setupLighting() {
    ambientLight = new THREE.AmbientLight(0xffffff, 3.5);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(10, 20, 10); 
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = -40;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -70;
    directionalLight.shadow.camera.right = 70;
    directionalLight.shadow.camera.top = 60;
    directionalLight.shadow.camera.bottom = -70;
    directionalLight.shadow.bias = -0.0005;  // Prevents shadow acne
    directionalLight.shadow.normalBias = 0.02;  // Additional bias to prevent shadow acne
    scene.add(directionalLight);

    // Headlight (Spotlight) 
    headlight = new THREE.SpotLight(0xffffff, 10, 150, (45 * Math.PI) / 180, 0.5, 2);
    headlight.castShadow = true;
    headlight.shadow.mapSize.width = 1024;
    headlight.shadow.mapSize.height = 1024;
    headlight.shadow.bias = -0.0005;  // Prevents shadow acne
    headlight.shadow.normalBias = 0.02;  // Additional bias to prevent shadow acne
    scene.add(headlight);

}

function updateLighting() {
    // Update headlight to follow active camera and point where you're looking
    if (headlight) {
        // Get the active camera
        let activeCamera;
        if (guiSettings.camera.cameraMode === 'animation1') {
            activeCamera = animationCamera;
        } else if (guiSettings.camera.cameraMode === 'animation2') {
            activeCamera = verticalAnimationCamera;
        } else {
            activeCamera = camera;
        }
        
        // Position headlight slightly above camera
        const headlightOffset = new THREE.Vector3(0, 0.3, 0);
        headlight.position.copy(activeCamera.position).add(headlightOffset);

        // Point headlight in camera's forward direction (where you're looking)
        const direction = new THREE.Vector3();
        activeCamera.getWorldDirection(direction);
        const targetPosition = activeCamera.position.clone().add(direction.clone().multiplyScalar(10));
        headlight.target.position.copy(targetPosition);
        // Update the target's matrix so the spotlight points correctly
        headlight.target.updateMatrixWorld();
    }
}


// ============================================================================
// SCENE OBJECTS CREATION
// ============================================================================

function setupSceneObjects() {
    const texLoader = new THREE.TextureLoader();
    texLoader.load("white.jpg", (skyTexture) => {
        const geometrySphere = new THREE.SphereGeometry(150, 150, 150);
        const materialSphere = new THREE.MeshBasicMaterial({
            map: skyTexture,
            side: THREE.DoubleSide
        });
        skyboxSphere = new THREE.Mesh(geometrySphere, materialSphere);
        skyboxSphere.position.set(0, 0, 0);
        scene.add(skyboxSphere);
    }, undefined, (error) => {
        console.warn("Failed to load skybox texture, using gradient background:", error);
        scene.background = new THREE.Color(0x87CEEB); 
    });
    scene.environment = skyboxSphere;

    createRoadPlane(texLoader);
}

function createRoadPlane(texLoader) {
    const roadWidth = 100; 
    const roadLength = 200; 
    const geometryRoadPlane = new THREE.PlaneGeometry(roadLength, roadWidth);
    
    roadTexture = texLoader.load("road.jpg", (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(roadLength / 100, roadWidth / 100); 
    });

    const roadMaterial = new THREE.MeshStandardMaterial({
        map: roadTexture,
        color: 0x333333, 
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide 
    });

    roadPlane = new THREE.Mesh(geometryRoadPlane, roadMaterial);
    roadPlane.rotation.x = -Math.PI / 2; 
    roadPlane.position.set(10, -6.5, 0); 
    roadPlane.receiveShadow = true; 

    scene.add(roadPlane);

}

// ============================================================================
// GEAR LOADING AND ANIMATION
// ============================================================================

function loadGears() {
    const loader = new THREE.GLTFLoader();

    loader.load(
        "gearbox16.glb",
        function (gltf) {
            scene.add(gltf.scene);

            gltf.scene.traverse((obj) => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

            console.log("=== ALL OBJECTS IN GLB ===");
            gltf.scene.traverse(o => console.log(o.name));

        // Load all gears
        cgear1 = gltf.scene.getObjectByName("cgear1");
        ogear2 = gltf.scene.getObjectByName("ogear2");
        cgear3 = gltf.scene.getObjectByName("cgear3");
        ogear4 = gltf.scene.getObjectByName("ogear4");
        cgear5 = gltf.scene.getObjectByName("cgear5");
        ogear6 = gltf.scene.getObjectByName("ogear6");
        igear7 = gltf.scene.getObjectByName("igear7");
        cgear8 = gltf.scene.getObjectByName("cgear8");

        // Connectors
        connector1 = gltf.scene.getObjectByName("connector1");
        connector2 = gltf.scene.getObjectByName("connector2");

        // Shafts
        outputshaft = gltf.scene.getObjectByName("outputshaft");
        countershaft = gltf.scene.getObjectByName("countershaft");
        inputshaft = gltf.scene.getObjectByName("inputshaft");
        drivetrain_shaft = gltf.scene.getObjectByName("drivetrain_shaft");
        shaft_to_wheels = gltf.scene.getObjectByName("shaft_to_wheels");

        // Shift forks
        right_shiftfork = gltf.scene.getObjectByName("right_shiftfork");
        left_shiftfork = gltf.scene.getObjectByName("left_shiftfork");

        // Tires
        tire_front_left = gltf.scene.getObjectByName("tire_front_left");
        tire_front_right = gltf.scene.getObjectByName("tire_front_right");
        tire_back_left = gltf.scene.getObjectByName("tire_back_left");
        tire_back_right = gltf.scene.getObjectByName("tire_back_right");

        // Car
        car = gltf.scene.getObjectByName("car_root");

        roofLeft = gltf.scene.getObjectByName("top001");
        roofRight = gltf.scene.getObjectByName("top");
        
        // Store car's original position and set initial state (hidden in sky)
        if (car) {
            carOriginalPosition = car.position.clone();
            car.position.y = carOriginalPosition.y + 200; 
            car.visible = false; 
            
            car.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
        }

        gearlever = gltf.scene.getObjectByName("gearlever");

        console.log("Loaded:", {
            cgear1, ogear2,
            cgear3, ogear4,
            cgear5, ogear6,
            outputshaft, countershaft, inputshaft, connector1, connector2, right_shiftfork, left_shiftfork, tire_front_left, tire_front_right, tire_back_left, tire_back_right, gearlever, drivetrain_shaft, shaft_to_wheels
        });

    if (!cgear1 || !ogear2 || !cgear3 || !ogear4 || !cgear5 || !ogear6 || !igear7 || !cgear8 || !outputshaft || !countershaft || !inputshaft || !connector1 || !connector2 || !right_shiftfork || !left_shiftfork || !tire_front_left || !tire_front_right || !tire_back_left || !tire_back_right || !gearlever || !drivetrain_shaft || !shaft_to_wheels) {
            console.warn("Some components not found.");
        } else {
            connector1.position.x += 0.65;
            connector2.position.x -= 0.9;

            right_shiftfork.position.x += 0.65;
            left_shiftfork.position.x -= 0.9;

            // Store neutral positions (after adjustment)
            connector1NeutralPos = connector1.position.clone();
            connector2NeutralPos = connector2.position.clone();
            
            // Store gear lever neutral rotation
            gearLeverNeutralRotX = gearlever.rotation.x;
            gearLeverNeutralRotZ = gearlever.rotation.z;
            
            // Initialize gear lever target rotations to neutral
            gearLeverTargetRotX = gearLeverNeutralRotX;
            gearLeverTargetRotZ = gearLeverNeutralRotZ;
            
            // Initialize previous gear to current gear
            previousGear = currentGear;


            createShaftLines(inputshaft, countershaft, outputshaft);

            // Inputshaft

            // Add inputshaft as child of igear7 while preserving world position
            // Get world position before adding as child
            inputshaft.updateMatrixWorld();
            igear7.updateMatrixWorld();
            const worldPosition1 = new THREE.Vector3();
            inputshaft.getWorldPosition(worldPosition1);

            // Add as child
            igear7.add(inputshaft);
            inputshaft.rotation.z = Math.PI / 2;

            // Convert world position to local position relative to parent
            // worldToLocal modifies the vector in place, converting from world to local space
            igear7.worldToLocal(worldPosition1);
            inputshaft.position.copy(worldPosition1);


            // Countershaft
            countershaft.updateMatrixWorld();
            cgear8.updateMatrixWorld();
            const worldPosition2 = new THREE.Vector3();
            countershaft.getWorldPosition(worldPosition2);

            cgear8.add(countershaft);
            countershaft.rotation.z = Math.PI / 2;

            cgear8.worldToLocal(worldPosition2);
            countershaft.position.copy(worldPosition2);

            // Left shiftfork
            left_shiftfork.updateMatrixWorld();
            connector2.updateMatrixWorld();
            const worldPosition3 = new THREE.Vector3();
            left_shiftfork.getWorldPosition(worldPosition3);

            connector2.add(left_shiftfork);
            connector2.worldToLocal(worldPosition3);
            left_shiftfork.position.copy(worldPosition3);


            // Right shiftfork
            right_shiftfork.updateMatrixWorld();
            connector1.updateMatrixWorld();
            const worldPosition4 = new THREE.Vector3();
            right_shiftfork.getWorldPosition(worldPosition4);

            connector1.add( right_shiftfork);
            connector1.worldToLocal(worldPosition4);
            right_shiftfork.position.copy(worldPosition4);


        }
    },
    undefined, // onProgress
    function (error) {
        console.error("Error loading gearbox16.glb:", error);
        console.error("Attempted to load from: gearbox16.glb");
    });
}
function createShaftLines(shaft1, shaft2, shaft3) {

    const lineWidth = 0.5; 

    const diameterLineGeometry1 = new THREE.CylinderGeometry(lineWidth / 2, lineWidth / 2, 4, 8);
    const diameterLineGeometry2 = new THREE.CylinderGeometry(lineWidth / 2, lineWidth / 2, 11, 8);
    const diameterLineGeometry3 = new THREE.CylinderGeometry(lineWidth / 2, lineWidth / 2, 16, 8);
    const diameterLineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000 // Red color
    });

    // First diameter line
    const diameterLine1_1 = new THREE.Mesh(diameterLineGeometry1, diameterLineMaterial);
    diameterLine1_1.rotation.z = Math.PI / 2; 
    shaft1.add(diameterLine1_1); 
    diameterLine1_1.position.set(3.6, 2.2, 0); 
    const diameterLine1_2 = new THREE.Mesh(diameterLineGeometry1, diameterLineMaterial);
    diameterLine1_2.rotation.z = Math.PI / 2; 
    shaft1.add(diameterLine1_2); 
    diameterLine1_2.position.set(3.6, -2.2, 0); 

    // Second diameter line (duplicate)
    const diameterLine2_1 = new THREE.Mesh(diameterLineGeometry2, diameterLineMaterial);
    diameterLine2_1.rotation.z = Math.PI / 2; 
    shaft2.add(diameterLine2_1); 
    diameterLine2_1.position.set(-8, 1.2, 0); 
    const diameterLine2_2 = new THREE.Mesh(diameterLineGeometry2, diameterLineMaterial);
    diameterLine2_2.rotation.z = Math.PI / 2; 
    shaft2.add(diameterLine2_2); 
    diameterLine2_2.position.set(-8, -1.2, 0); 

    const diameterLine2_3 = new THREE.Mesh(diameterLineGeometry2, diameterLineMaterial);
    diameterLine2_3.rotation.z = Math.PI / 2; 
    shaft2.add(diameterLine2_3); 
    diameterLine2_3.position.set(12.8, 0.4, 0); 
    const diameterLine2_4 = new THREE.Mesh(diameterLineGeometry2, diameterLineMaterial);
    diameterLine2_4.rotation.z = Math.PI / 2; 
    shaft2.add(diameterLine2_4); 
    diameterLine2_4.position.set(12.8, -0.4, 0); 

    // Third diameter line (duplicate)
    const diameterLine3_1 = new THREE.Mesh(diameterLineGeometry3, diameterLineMaterial);
    diameterLine3_1.rotation.z = Math.PI / 2; 
    shaft3.add(diameterLine3_1); 
    diameterLine3_1.position.set(-7.7, 1.7, 0); 

    const diameterLine3_2 = new THREE.Mesh(diameterLineGeometry3, diameterLineMaterial);
    diameterLine3_2.rotation.z = Math.PI / 2; 
    shaft3.add(diameterLine3_2); 
    diameterLine3_2.position.set(-7.7, -1.7, 0); 

    const diameterLine3_3 = new THREE.Mesh(diameterLineGeometry3, diameterLineMaterial);
    diameterLine3_3.rotation.z = Math.PI / 2; 
    shaft3.add(diameterLine3_3); 
    diameterLine3_3.position.set(8, 1, 0); 

    const diameterLine3_4 = new THREE.Mesh(diameterLineGeometry3, diameterLineMaterial);
    diameterLine3_4.rotation.z = Math.PI / 2; 
    shaft3.add(diameterLine3_4); 
    diameterLine3_4.position.set(8, -1, 0); 
}


function updateGearRotation() {
    if (cgear1 && ogear2 && cgear3 && ogear4 && cgear5 && ogear6 && igear7 && cgear8) {
        const T = {
            c1: 14,
            o2: 36,
            c3: 21,
            o4: 29,
            c5: 25,
            o6: 25,
            i7: 23,
            c8: 27
        };

        // Countershaft input speed
        const baseSpeed = guiSettings.car.engineSpeed * 0.039;

        // Calculate speeds for each pair
        const speed12 = baseSpeed * (T.c1 / T.o2);
        const speed34 = baseSpeed * (T.c3 / T.o4);
        const speed56 = baseSpeed * (T.c5 / T.o6);
        const inputSpeed = baseSpeed * (T.c8 / T.i7); 

        cgear1.rotation.x += baseSpeed;
        ogear2.rotation.x -= speed12; 

        cgear3.rotation.x += baseSpeed;
        ogear4.rotation.x -= speed34;

        cgear5.rotation.x += baseSpeed;
        ogear6.rotation.x -= speed56;

        igear7.rotation.x -= inputSpeed;
        cgear8.rotation.x += baseSpeed;
    }
}

function updateGearSystem() {
    if (!connector1 || !connector2 || connector1NeutralPos === null || connector2NeutralPos === null || !gearlever) {
        return;
    }

    const T = {
        c1: 14,
        o2: 36,
        c3: 21,
        o4: 29,
        c5: 25,
        o6: 25,
        i7: 23,
        c8: 27
    };

    // Countershaft input speed
    const baseSpeed = guiSettings.car.engineSpeed * 0.039;

    // Calculate speeds for each gear pair
    const speed12 = baseSpeed * (T.c1 / T.o2);
    const speed34 = baseSpeed * (T.c3 / T.o4);
    const speed56 = baseSpeed * (T.c5 / T.o6);
    const inputSpeed = baseSpeed * (T.c8 / T.i7); 

    let targetX1, targetX2;

    // Detect gear change and initialize H-pattern movement state
    if (previousGear !== currentGear) {
        if (currentGear === 0) {
            // Going to neutral: first move vertically to neutral, then horizontally to neutral
            gearLeverMovementState = 'toNeutralZ';
        } else {
            
            // Determine which side the current gear is on (based on previousGear)
            let currentSide = 0; // 0 = neutral, 1 = left (gears 1, 2), -1 = right (gears 3, 4)
            if (previousGear === 1 || previousGear === 2) {
                currentSide = 1; // Left side
            } else if (previousGear === 3 || previousGear === 4) {
                currentSide = -1; // Right side
            }
            
            // Determine which side the target gear is on (based on currentGear)
            let targetSide = 0;
            if (currentGear === 1 || currentGear === 2) {
                targetSide = 1; // Left side
            } else if (currentGear === 3 || currentGear === 4) {
                targetSide = -1; // Right side
            }
            
            const isSwitchingSides = previousGear !== 0 && currentSide !== 0 && targetSide !== 0 && currentSide !== targetSide;
            
            if (isSwitchingSides) {
                // Switching sides: ALWAYS go through neutral first
                gearLeverMovementState = 'toNeutralZ';
            } else {
                gearLeverMovementState = 'toTargetX';
            }
        }
        previousGear = currentGear;
    }

    // Update connector positions and output shaft rotation based on current gear
    switch(currentGear) {
        case 0: 
            targetX1 = connector1NeutralPos.x;
            targetX2 = connector2NeutralPos.x;
            gearLeverTargetRotX = gearLeverNeutralRotX;
            gearLeverTargetRotZ = gearLeverNeutralRotZ;
            break;
        case 1: 
            targetX1 = connector1NeutralPos.x+0.8;
            targetX2 = connector2NeutralPos.x;
            gearLeverTargetRotX = gearLeverNeutralRotX + 0.3; 
            gearLeverTargetRotZ = gearLeverNeutralRotZ + 0.3; 
            tire_front_left.rotation.z += speed12;
            tire_front_right.rotation.x -= speed12;
            tire_back_left.rotation.z += speed12;
            tire_back_right.rotation.z += speed12;
            if (roadTexture) {
                roadTexture.offset.x -= speed12/4; 
            }
            if (outputshaft) {
                outputshaft.rotation.x -= speed12;
            }
            break;
        case 2: 
            targetX1 = connector1NeutralPos.x-0.75;
            targetX2 = connector2NeutralPos.x;
            gearLeverTargetRotX = gearLeverNeutralRotX + 0.3; 
            gearLeverTargetRotZ = gearLeverNeutralRotZ - 0.3; 
            tire_front_left.rotation.z += speed34;
            tire_front_right.rotation.x -= speed34;
            tire_back_left.rotation.z += speed34;
            tire_back_right.rotation.z += speed34;

            if (roadTexture) {
                roadTexture.offset.x -= speed34/4; 
            }
            if (outputshaft) {
                outputshaft.rotation.x -= speed34;
            }
            break;
        case 3: 
            targetX1 = connector1NeutralPos.x;
            targetX2 = connector2NeutralPos.x+0.85;
            gearLeverTargetRotX = gearLeverNeutralRotX - 0.3; 
            gearLeverTargetRotZ = gearLeverNeutralRotZ + 0.3; 
            tire_front_left.rotation.z += speed56;
            tire_front_right.rotation.x -= speed56;
            tire_back_left.rotation.z += speed56;
            tire_back_right.rotation.z += speed56;
            if (roadTexture) {
                roadTexture.offset.x -= speed56/4; 
            }
            if (outputshaft) {
                outputshaft.rotation.x -= speed56;
            }
            break;
        case 4: 
            targetX1 = connector1NeutralPos.x;
            targetX2 = connector2NeutralPos.x-1.1;
            gearLeverTargetRotX = gearLeverNeutralRotX - 0.3; 
            gearLeverTargetRotZ = gearLeverNeutralRotZ - 0.3; 
            tire_front_left.rotation.z += inputSpeed;
            tire_front_right.rotation.x -= inputSpeed;
            tire_back_left.rotation.z += inputSpeed;
            tire_back_right.rotation.z += inputSpeed;
            if (roadTexture) {
                roadTexture.offset.x -= inputSpeed/4; 
            }
            if (outputshaft) {
                outputshaft.rotation.x -= inputSpeed;
            }
            break;
        default:
            targetX1 = connector1NeutralPos.x;
            targetX2 = connector2NeutralPos.x;
            gearLeverTargetRotX = gearLeverNeutralRotX;
            gearLeverTargetRotZ = gearLeverNeutralRotZ;
            break;
    }

    const lerpSpeed = 0.1;
    connector1.position.x += (targetX1 - connector1.position.x) * lerpSpeed;
    connector2.position.x += (targetX2 - connector2.position.x) * lerpSpeed;

    // ================================================================
    // Gear lever movement
    if (gearlever && gearLeverNeutralRotX !== null && gearLeverNeutralRotZ !== null && gearLeverTargetRotX !== null && gearLeverTargetRotZ !== null) {
        const threshold = 0.02; // Threshold to determine when movement is complete
        
        if (currentGear === 0) {
            // Going to neutral: first move vertically to neutral, then horizontally to neutral
            if (gearLeverMovementState === 'toNeutralZ') {
                // First phase: move vertically to neutral Z
                gearlever.rotation.z += (gearLeverNeutralRotZ - gearlever.rotation.z) * lerpSpeed;
                if (Math.abs(gearlever.rotation.z - gearLeverNeutralRotZ) < threshold) {
                    gearLeverMovementState = 'toNeutralX';
                }
            } else if (gearLeverMovementState === 'toNeutralX') {
                // Second phase: move horizontally to neutral X
                gearlever.rotation.x += (gearLeverNeutralRotX - gearlever.rotation.x) * lerpSpeed;
                if (Math.abs(gearlever.rotation.x - gearLeverNeutralRotX) < threshold) {
                    gearLeverMovementState = 'idle';
                }
            }
        } else {
            // Going to a gear: follow H-pattern path
            if (gearLeverMovementState === 'toNeutralZ') {
                // First: move vertically to neutral Z (if not already there)
                gearlever.rotation.z += (gearLeverNeutralRotZ - gearlever.rotation.z) * lerpSpeed;
                if (Math.abs(gearlever.rotation.z - gearLeverNeutralRotZ) < threshold) {
                    gearLeverMovementState = 'toNeutralX';
                }
            } else if (gearLeverMovementState === 'toNeutralX') {
                // Second: move horizontally to neutral X (to switch sides)
                gearlever.rotation.x += (gearLeverNeutralRotX - gearlever.rotation.x) * lerpSpeed;
                if (Math.abs(gearlever.rotation.x - gearLeverNeutralRotX) < threshold) {
                    gearLeverMovementState = 'toTargetX';
                }
            } else if (gearLeverMovementState === 'toTargetX') {
                // Third: move horizontally to target X
                gearlever.rotation.x += (gearLeverTargetRotX - gearlever.rotation.x) * lerpSpeed;
                if (Math.abs(gearlever.rotation.x - gearLeverTargetRotX) < threshold) {
                    gearLeverMovementState = 'toTargetZ';
                }
            } else if (gearLeverMovementState === 'toTargetZ') {
                // Fourth: move vertically to target Z
                gearlever.rotation.z += (gearLeverTargetRotZ - gearlever.rotation.z) * lerpSpeed;
                if (Math.abs(gearlever.rotation.z - gearLeverTargetRotZ) < threshold) {
                    gearLeverMovementState = 'idle';
                }
            } else if (gearLeverMovementState === 'idle') {
                // Maintain target position
                gearlever.rotation.x += (gearLeverTargetRotX - gearlever.rotation.x) * lerpSpeed;
                gearlever.rotation.z += (gearLeverTargetRotZ - gearlever.rotation.z) * lerpSpeed;
            }
        }
    }
}

// ============================================================================
// INPUT HANDLING
// ============================================================================

function setupKeyboardControls() {
    // Key down event
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            keys[key] = true;
            event.preventDefault();
        }
        if (event.key === 'ArrowUp') {
            keys.arrowup = true;
            event.preventDefault();
        }
        if (event.key === 'ArrowDown') {
            keys.arrowdown = true;
            event.preventDefault();
        }
        if (event.key === 'Shift' || event.shiftKey) {
            keys.shift = true;
        }
        if (key === 'g') {
            keys.g = true;
            if (!isGearshiftOpen) {
                openGearshift();
            }
            event.preventDefault();
        }
    });

    window.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            keys[key] = false;
            event.preventDefault();
        }
        if (event.key === 'ArrowUp') {
            keys.arrowup = false;
            event.preventDefault();
        }
        if (event.key === 'ArrowDown') {
            keys.arrowdown = false;
            event.preventDefault();
        }
        if (event.key === 'Shift') {
            keys.shift = false;
        }
        if (key === 'g') {
            keys.g = false;
            if (isGearshiftOpen) {
                closeGearshift();
            }
            event.preventDefault();
        }
    });
}

// ============================================================================
// GEARSHIFT GUI
// ============================================================================

function setupAboutModal() {
    const aboutButton = document.getElementById('about-button');
    const aboutModal = document.getElementById('about-modal');
    const aboutClose = document.getElementById('about-close');

    aboutButton.addEventListener('click', () => {
        aboutModal.classList.remove('about-modal-hidden');
    });

    aboutClose.addEventListener('click', () => {
        aboutModal.classList.add('about-modal-hidden');
    });

    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.add('about-modal-hidden');
        }
    });
}

// Setup gearshift GUI and handle mouse movement for gear selection
function setupGearshiftGUI() {
    const gearshiftGUI = document.getElementById('gearshift-gui');
    const gearPattern = document.querySelector('.gearshift-h-pattern');
    const gearDot = document.getElementById('gear-dot');

    selectedGear = currentGear;
    updateGearIndicator();

    // Track mouse movement to update gear selection dot position
    window.addEventListener('mousemove', (e) => {
        if (isGearshiftOpen) {
            updateDotPosition(e);
        }
    });

    // Update dot position based on mouse movement, following H-pattern constraints
    function updateDotPosition(e) {
        if (!isGearshiftOpen) return;

        const patternRect = gearPattern.getBoundingClientRect();
        const mouseX = e.clientX - patternRect.left;
        const mouseY = e.clientY - patternRect.top;

        // Get gear position elements
        const gear1 = document.querySelector('.gear-position[data-gear="1"]');
        const gear2 = document.querySelector('.gear-position[data-gear="2"]');
        const gear3 = document.querySelector('.gear-position[data-gear="3"]');
        const gear4 = document.querySelector('.gear-position[data-gear="4"]');
        const gearN = document.querySelector('.gear-position[data-gear="0"]');

        // Calculate center coordinates of each gear position
        const getGearCenter = (gear) => {
            const rect = gear.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2 - patternRect.left,
                y: rect.top + rect.height / 2 - patternRect.top
            };
        };

        const g1 = getGearCenter(gear1);
        const g2 = getGearCenter(gear2);
        const g3 = getGearCenter(gear3);
        const g4 = getGearCenter(gear4);
        const gN = getGearCenter(gearN);

        // H-pattern path coordinates
        const LEFT_X = 50;
        const RIGHT_X = 150;
        const MIDDLE_Y = 150;

        // Calculate distance to each H-pattern path segment
        const distToLeftVertical = Math.abs(mouseX - LEFT_X);
        const distToRightVertical = Math.abs(mouseX - RIGHT_X);
        const distToHorizontal = Math.abs(mouseY - MIDDLE_Y);

        let dotX, dotY;
        let closestGear = 0;
        let minDistToGear = Infinity;

        // Define all gear positions
        const snapThreshold = 40;
        const gears = [
            { gear: 1, pos: g1 },
            { gear: 2, pos: g2 },
            { gear: 3, pos: g3 },
            { gear: 4, pos: g4 },
            { gear: 0, pos: gN }
        ];

        // Find closest gear to mouse position
        gears.forEach(({ gear, pos }) => {
            const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
            if (dist < minDistToGear) {
                minDistToGear = dist;
                closestGear = gear;
            }
        });

        // Snap to gear if close enough, otherwise constrain to H-pattern paths
        if (minDistToGear < snapThreshold) {
            const closestGearData = gears.find(g => g.gear === closestGear);
            dotX = closestGearData.pos.x;
            dotY = closestGearData.pos.y;
            selectedGear = closestGear;
        } else {
            // Constrain dot to H-pattern: follow left or right vertical, or horizontal middle
            if (distToLeftVertical < distToRightVertical) {
                dotX = LEFT_X;
                dotY = Math.max(g1.y, Math.min(g2.y, mouseY));

                if (Math.abs(mouseY - MIDDLE_Y) < 30 && mouseX > LEFT_X) {
                    dotY = MIDDLE_Y;
                    dotX = Math.max(LEFT_X, Math.min(RIGHT_X, mouseX));
                }
            } else {
                dotX = RIGHT_X;
                dotY = Math.max(g3.y, Math.min(g4.y, mouseY));

                if (Math.abs(mouseY - MIDDLE_Y) < 30 && mouseX < RIGHT_X) {
                    dotY = MIDDLE_Y;
                    dotX = Math.max(LEFT_X, Math.min(RIGHT_X, mouseX));
                }
            }

            // Handle horizontal path (middle section connecting left and right)
            if (distToHorizontal < 30) {
                dotY = MIDDLE_Y;
                dotX = Math.max(LEFT_X, Math.min(RIGHT_X, mouseX));
            }

            // Select gear closest to constrained dot position
            let minDist = Infinity;
            gears.forEach(({ gear, pos }) => {
                const dist = Math.sqrt((dotX - pos.x) ** 2 + (dotY - pos.y) ** 2);
                if (dist < minDist) {
                    minDist = dist;
                    selectedGear = gear;
                }
            });
        }

        // Update dot visual position
        gearDot.style.left = dotX + 'px';
        gearDot.style.top = dotY + 'px';

        updateGearIndicator();
    }
}

// Open gearshift GUI and position dot at current gear
function openGearshift() {
    isGearshiftOpen = true;
    selectedGear = currentGear; 
    updateGearIndicator();

    // Show gearshift GUI
    const gearshiftGUI = document.getElementById('gearshift-gui');
    gearshiftGUI.classList.remove('gearshift-hidden');

    // Position dot at current gear location
    const gearPattern = document.querySelector('.gearshift-h-pattern');
    const gearDot = document.getElementById('gear-dot');
    const currentGearElement = document.querySelector(`.gear-position[data-gear="${currentGear}"]`);

    if (currentGearElement) {
        const patternRect = gearPattern.getBoundingClientRect();
        const elementRect = currentGearElement.getBoundingClientRect();
        const dotX = elementRect.left + elementRect.width / 2 - patternRect.left;
        const dotY = elementRect.top + elementRect.height / 2 - patternRect.top;

        gearDot.style.left = dotX + 'px';
        gearDot.style.top = dotY + 'px';
    }

    // Disable camera controls while gearshift is open
    controls.enabled = false;
}

function closeGearshift() {
    isGearshiftOpen = false;

    if (selectedGear !== null) {
        currentGear = selectedGear;
        console.log(`Gear changed to: ${currentGear}`);
    }

    const gearshiftGUI = document.getElementById('gearshift-gui');
    gearshiftGUI.classList.add('gearshift-hidden');

    controls.enabled = true;
}

function updateGearIndicator() {
    const gearPositions = document.querySelectorAll('.gear-position');
    gearPositions.forEach(position => {
        const gear = parseInt(position.getAttribute('data-gear'));
        if (gear === selectedGear) {
            position.classList.add('active');
        } else {
            position.classList.remove('active');
        }
    });
}

// ============================================================================
// GUI SETUP
// ============================================================================

function setupSettingsMenu() {
    gui = new dat.GUI({ autoPlace: false });

    const guiContainer = gui.domElement;
    guiContainer.style.position = 'fixed';
    guiContainer.style.top = '140px'; 
    guiContainer.style.right = '20px';
    guiContainer.style.zIndex = '2000';
    document.body.appendChild(guiContainer);

    setupCameraGUI();

    setupLightingGUI();

    setupCarGUI();
}

function setupCameraGUI() {
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(guiSettings.camera, 'cameraMode', ['main', 'animation1', 'animation2', 'thirdPerson'])
        .name('Camera Mode')
        .onChange((value) => {

            if (value === 'main') {
                if (savedMainCameraPosition != null) {
                    camera.position.copy(savedMainCameraPosition);
                    camera.lookAt(10, 0, 0);
                } else {
                    camera.position.set(30, 30, 60);
                    camera.lookAt(10, 0, 0);
                }
                positionSaved = false;
                if (controls) {
                    const forward = new THREE.Vector3();
                    camera.getWorldDirection(forward);
                    controls.target.copy(camera.position).add(forward.multiplyScalar(1));
                    controls.update();
                }
                if (controls) controls.enabled = true;
                if (car) {
                    car.visible = guiSettings.car.bodyVisible;
                }
                if (roadPlane) {
                    roadPlane.visible = guiSettings.car.roadVisible;
                }
            } else if (value === 'animation1' || value === 'animation2') {
                if (controls) controls.enabled = false;
                if (car) {
                    car.visible = false;
                }
                if (roadPlane) {
                    roadPlane.visible = false;
                }
            } else if (value === 'thirdPerson') {
                if(!positionSaved) {
                    savedMainCameraPosition = camera.position.clone();
                    positionSaved = true;
                }
                if (controls) controls.enabled = false;
                const targetPosition = { x: 70, y: 50, z: -1 };
                gsap.to(camera.position, {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z,
                    duration: 1,
                    ease: "power2.inOut"
                });
                if (car) {
                    updateCarBodyVisibility(true);
                }
                if (roofLeft) {
                    roofLeft.visible = false;
                }
                if (roofRight) {
                    roofRight.visible = false;
                }
                if (roadPlane) {
                    roadPlane.visible = true;
                }
            }
        });
    cameraFolder.add(guiSettings.camera, 'fov', 10, 120).name('Field of View').onChange((value) => {
        camera.fov = value;
    camera.updateProjectionMatrix();
        if (animationCamera) {
            animationCamera.fov = value;
            animationCamera.updateProjectionMatrix();
        }
        if (verticalAnimationCamera) {
            verticalAnimationCamera.fov = value;
            verticalAnimationCamera.updateProjectionMatrix();
        }
    });
    cameraFolder.open();
}

function setupLightingGUI() {
    const lightingFolder = gui.addFolder('Lighting');

    // Ambient Light
    const ambientFolder = lightingFolder.addFolder('Ambient Light');
    ambientFolder.add(guiSettings.lighting, 'ambientEnabled').name('Enabled').onChange((value) => {
        if (ambientLight) ambientLight.visible = value;
    });
    ambientFolder.add(guiSettings.lighting, 'ambientIntensity', 0, 10).name('Intensity').onChange((value) => {
        if (ambientLight) ambientLight.intensity = value;
    });

    // Directional Light
    const directionalFolder = lightingFolder.addFolder('Directional Light');
    directionalFolder.add(guiSettings.lighting, 'directionalEnabled').name('Enabled').onChange((value) => {
        if (directionalLight) directionalLight.visible = value;
    });
    directionalFolder.add(guiSettings.lighting, 'directionalIntensity', 0, 10).name('Intensity').onChange((value) => {
        if (directionalLight) directionalLight.intensity = value;
    });

    // Headlight (Spotlight - follows camera)
    const headlightFolder = lightingFolder.addFolder('Headlight');
    headlightFolder.add(guiSettings.lighting, 'headlightEnabled').name('Enabled').onChange((value) => {
        if (headlight) headlight.visible = value;
    });
    headlightFolder.add(guiSettings.lighting, 'headlightIntensity', 5, 15).name('Intensity').onChange((value) => {
        if (headlight) headlight.intensity = value;
    });
    headlightFolder.add(guiSettings.lighting, 'headlightDistance', 100, 200).name('Distance').onChange((value) => {
        if (headlight) headlight.distance = value;
    });
    headlightFolder.add(guiSettings.lighting, 'headlightAngle', 5, 90).name('Angle (degrees)').onChange((value) => {
        if (headlight) headlight.angle = (value * Math.PI) / 180; // Convert degrees to radians
    });
    headlightFolder.add(guiSettings.lighting, 'headlightPenumbra', 0, 1).name('Penumbra').onChange((value) => {
        if (headlight) headlight.penumbra = value;
    });
    headlightFolder.addColor(guiSettings.lighting, 'headlightColor').name('Color').onChange((value) => {
        if (headlight) headlight.color.setHex(value.replace('#', '0x'));
    });
    headlightFolder.add(guiSettings.lighting, 'headlightDecay', 0, 1).name('Decay').onChange((value) => {
        if (headlight) headlight.decay = value;
    });
}


function setupCarGUI() {
    const carFolder = gui.addFolder('Car');
    carFolder.add(guiSettings.car, 'bodyVisible').name('Body (Karoséria)').onChange((value) => {
        updateCarBodyVisibility(value);
    });
    carFolder.add(guiSettings.car, 'roofVisible').name('Roof').onChange((value) => {
        updateRoofVisibility(value);
    });
    carFolder.add(guiSettings.car, 'roadVisible').name('Road').onChange((value) => {
        if (roadPlane) roadPlane.visible = value;
    });
    carFolder.add(guiSettings.car, 'engineSpeed', 0, 10).name('Engine speed').onChange((value) => {
        // The baseSpeed will automatically use this value in updateGearRotation()
    });
    carFolder.open();
}

function updateRoofVisibility(visible) {
    if (roofLeft) roofLeft.visible = visible;
    if (roofRight) roofRight.visible = visible;
}

function updateCarBodyVisibility(visible) {
    if (!car || !carOriginalPosition) return;
    
    if (visible) {
        // Animate car body descending from sky to original position
        const targetY = carOriginalPosition.y;
        const startY = carOriginalPosition.y + 200;
        car.position.y = startY; 
        car.visible = true;
        
        // Animate descent using GSAP
        gsap.to(car.position, {
            y: targetY,
            duration: 2,
            ease: "power2.out"
        });
    } else {
        // Animate car body ascending back to sky
        const targetY = carOriginalPosition.y + 200;
        
        gsap.to(car.position, {
            y: targetY,
            duration: 2,
            ease: "power2.in",
            onComplete: () => {
                car.visible = false;
            }
        });
    }
}


// ============================================================================
// MAIN INITIALIZATION AND ANIMATION LOOP
// ============================================================================

function init() {
    // Scene
    scene = new THREE.Scene();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.physicallyCorrectLights = false;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById("canvas1").appendChild(renderer.domElement);

    window.addEventListener("resize", onResize);
}

function animate() {
    requestAnimationFrame(animate);

    updateGearRotation();

    if (connector1 && connector2 && cgear1 && ogear2 && cgear3 && ogear4 && cgear5 && ogear6 && igear7 && cgear8) {
        updateGearSystem();
    }

    if (guiSettings.camera.cameraMode === 'main') {
        updateCamera();
    } else if (guiSettings.camera.cameraMode === 'thirdPerson') {
        camera.lookAt(0, 0, 0);
        if (controls) controls.enabled = false;
    }

    updateLighting();

    let activeCamera;
    if (guiSettings.camera.cameraMode === 'animation1') {
        activeCamera = animationCamera;
    } else if (guiSettings.camera.cameraMode === 'animation2') {
        activeCamera = verticalAnimationCamera;
    } else {
        activeCamera = camera;
    }
    renderer.render(scene, activeCamera);
    
}
