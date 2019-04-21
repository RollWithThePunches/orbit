;(() => {

    const orbitData = [
        {rotateZ: -0.01, lightY: -2, cameraZ: 0.5},
		{rotateZ: 0.01, lightY: 0, cameraZ: -0.5},
		{rotateZ: 0.05, lightY: 7, cameraZ: -0.7},
		{rotateZ: -0.05, lightY: 0, cameraZ: 0.7},
	];

	const coneX = -14; 
	const coneY = 16; 
	const coneZ = 40;

	const windowHeight = window.innerHeight;
	let trigger = document.getElementsByClassName('trigger');
	let triggerCones = document.getElementsByClassName('trigger-cone');
	
	// Scene
	const globeContainer = document.getElementById('globe-container');
	const scene = new THREE.Scene();
	const color = new THREE.DirectionalLight(0xFFFFFF);

	// Camera
	const camera = new THREE.PerspectiveCamera(
		55, window.innerWidth / window.innerHeight, 0.1, 1000
	);

	// Render
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	globeContainer.appendChild(renderer.domElement);

	// Sphere
 	const geometry = new THREE.SphereGeometry(40, 50, 50);
	THREE.ImageUtils.crossOrigin = true;
	geometry.rotateZ(-0.3);
	geometry.rotateY(0.25);
	 
	// Cone shape
	const cone = new THREE.CylinderGeometry(1, 0, 10, 50, false);
	const meshLambertCone = new THREE.MeshLambertMaterial({ color: 0x13a31a });
	const meshCone = new THREE.Mesh(cone, meshLambertCone);
	scene.add(meshCone);

	meshCone.position.x = coneX;
	meshCone.geometry.rotateX(Math.PI * 0.5);
	meshCone.position.y = coneY;
	meshCone.position.z = coneZ;
	meshCone.visible = false;

 	// Camera controls
 	const controls = new THREE.OrbitControls(camera);
    // No vertical rotating
    controls.minPolarAngle = Math.PI / 2;
	controls.maxPolarAngle = Math.PI / 2;
	
    // Rotation has minimum starting in dark side
    // and maximum from front Moon angle
    controls.minAzimuthAngle = - Math.PI;
    controls.maxAzimuthAngle = Math.PI / 40;
        
    controls.update();
	controls.autoRotate = true;
	controls.enableZoom = false;

 	// Use for adding image texture
	const textureLoader = new THREE.TextureLoader();
	textureLoader.crossOrigin = true;

	// Load image
	textureLoader.load('assets/img/moon-4k.png', (texture) => {

	 	const material = new THREE.MeshLambertMaterial({
	 		map: texture
	 	});

	 	const mesh = new THREE.Mesh(geometry, material);
	 	scene.add(mesh);
	 	mesh.rotation.set(-0.08, 4.5, 0);

	 	render();
	});

	camera.position.set(-0.41, 0, -120);
	camera.lookAt(scene.position.set);

	// Light
	const light = color;
 	light.position.set(10, 0, 25);
 	scene.add(light);

	// Change autoRotateSpeed to negative for reverse
	controls.autoRotateSpeed = -6;
	
	// Sphere rotate
	function sphereRotate() {
		for (let i = 0; i < trigger.length; i++) {
			let posFromTop = trigger[i].getBoundingClientRect().top
				
			if (posFromTop - windowHeight <= 0) {

				geometry.rotateZ(orbitData[i].rotateZ);
				light.position.y += orbitData[i].lightY;
				camera.position.z += orbitData[i].cameraZ;
				console.log(orbitData[i].rotateZ);
			}
		}
	}
	
	// Cone visibility
	function coneVisibility() {
		for (let i = 0; i < triggerCones.length; i++) {
			let posFromTop = triggerCones[i].getBoundingClientRect().top

		  meshCone.traverse((elem) => {
			  if (elem instanceof THREE.Mesh) {
				  if (posFromTop - windowHeight <= 0) {
					  elem.visible = true;
				  } else if (posFromTop - windowHeight > 0) {
					  elem.visible = false;
				  }
			  }
		  });
	  }
	}

	// Event handler for moon animations on scroll
	function animateSphere() {
			window.addEventListener('scroll', checkPositionSphere);
			// window.addEventListener('resize', init)
			function checkPositionSphere() {
			sphereRotate()
			}
	}
	animateSphere();

	// Event handler for showing cones on scroll
	function animateCones() {
	    window.addEventListener('scroll', checkPositionCones);

	  	function checkPositionCones() {
	    	coneVisibility();
  		}
	}
	animateCones();

 	// Render spinning animation function
 	const render = () => {
 		requestAnimationFrame(render);
 		controls.update();
 		renderer.render(scene, camera);
 	}

})();

// https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
// https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
// https://stackoverflow.com/questions/25308943/limit-orbitcontrols-horizontal-rotation/25311658#25311658
// https://stackoverflow.com/questions/37482231/camera-position-changes-in-three-orbitcontrols-in-three-js
// https://threejs.org/docs/#api/en/math/Quaternion