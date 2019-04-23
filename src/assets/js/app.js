;(() => {

    // const orbitData = [
    //     {rotateZ: -0.01, lightY: -2, cameraZ: 0.5},
	// 	{rotateZ: 0.01, lightY: 0, cameraZ: -0.5},
	// 	{rotateZ: 0.05, lightY: 7, cameraZ: -0.7},
	// 	{rotateZ: -0.05, lightY: 0, cameraZ: 0.7}
	// ];

	const orbitData = [
		{cameraZ: 0.01, cameraZReverse: 0.01},
		{cameraZ: -0.01, cameraZReverse: -0.01}
	];

	const coneData = [
		{coneX: -29, coneY: 0, coneZ: 30},
		{coneX: -25, coneY: -7, coneZ: 35},
		{coneX: -28, coneY: 4, coneZ: 30},
		{coneX: -13, coneY: -8, coneZ: 40}
	];

	let i;
	let posFromTop;
	let cone;
	let meshLambertCone;
	let meshCone;

	const windowHeight = window.innerHeight;
	let trigger = document.getElementsByClassName('trigger');
	let triggerCones = document.getElementsByClassName('trigger-cone');

	const controller = new ScrollMagic.Controller({
		vertical: false,
		globalSceneOptions: {
			triggerHook: 'onEnter'
		}
	});
	
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
	// for (i = 0; i < 4; i++) {
	
	// 	cone = new THREE.CylinderGeometry(1, 0, 10, 50, false);
	// 	meshLambertCone = new THREE.MeshLambertMaterial({ color: 0x13a31a });
	// 	meshCone = new THREE.Mesh(cone, meshLambertCone);
	// 	scene.add(meshCone);
	// 	meshCone.geometry.rotateX(Math.PI * 0.5);
	// 	meshCone.visible = false;
	// }

	var meshCones = coneData.map(function(c) {
		var cone = new THREE.CylinderGeometry(1, 0, 10, 50, false);
		var meshLambertCone = new THREE.MeshLambertMaterial({ color: 0x13a31a });
		var meshCone = new THREE.Mesh(cone, meshLambertCone)

		meshCone.geometry.rotateX(Math.PI * 0.5);
		meshCone.visible = false;

		scene.add(meshCone);

		return {
			cone: cone,
			meshLambertCone: meshLambertCone,
			meshCone: meshCone,
		}

	});
	console.log(meshCones);


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

	const group = new THREE.Group();
	// group.add(geometry);
	group.add(camera);
	// group.add(light);
	scene.add(group);
	
	// Sphere rotate
	function sphereRotate() {
		for (i = 0; i < trigger.length; i++) {
			// console.log(trigger[i],i);
			posFromTop = trigger[i].getBoundingClientRect().top;
				
			console.log({ i, posFromTop }, posFromTop - windowHeight)
			if (posFromTop - windowHeight <= 0) {

				// group.rotateZ(orbitData[i].rotateZ);
				// light.position.y += orbitData[i].lightY;
				group.rotation.x += orbitData[i].cameraZ;
				// console.log(orbitData[i].rotateZ);
			// } else if (posFromTop < windowHeight) {
			// 	// geometry.rotateZ(orbitData[i].rotateZ);
			// 	// light.position.y += orbitData[i].lightY;
			// 	// camera.position.z += orbitData[i].cameraZ;
			// 	group.rotation.z += orbitData[i].cameraZReverse;
			}
		}

		meshCones.forEach((coneObj) => {
			const { cone, meshCone } = coneObj
			meshCone.traverse((elem) => {
				if (elem instanceof THREE.Mesh) {
					elem.visible = false;
				}
			});
		});
	}

	// Cone visibility
	function coneVisibility() {
		for (i = 0; i < triggerCones.length; i++) {
			posFromTop = triggerCones[i].getBoundingClientRect().top;
			// debugger;
			var matchingCone = meshCones[i];
			var meshCone = matchingCone.meshCone;

			if (posFromTop - windowHeight <= 0) {
				meshCone.position.x = coneData[i].coneX;
				meshCone.position.y = coneData[i].coneY;
				meshCone.position.z = coneData[i].coneZ;

				meshCone.traverse((elem) => {
					if (elem instanceof THREE.Mesh) {
						elem.visible = true;
					}
				 });
			} else if (posFromTop - windowHeight > 0) {
				meshCone.traverse((elem) => {
					if (elem instanceof THREE.Mesh) {
						elem.visible = false;
					}
				});
			}
	  	}
	}

	// Event handler for moon animations on scroll
	window.addEventListener('scroll', sphereRotate);
	// window.addEventListener('resize', init)

	// Event handler for showing cones on scroll
	window.addEventListener('scroll', coneVisibility);

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
// https://github.com/vaneenige/THREE.Phenomenon
// https://tympanus.net/codrops/2019/03/22/how-to-create-smooth-webgl-transitions-on-scroll-using-phenomenon/