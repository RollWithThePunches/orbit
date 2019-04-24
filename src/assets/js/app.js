;(() => {

	const moonRotate = [
		{moonX: 0, moonY: -0.8, moonZ: 0, class: '.trigger1'},
		{moonX: 0, moonY: -0.5, moonZ: 0, class: '.trigger2'},
		{moonX: -1.5, moonY: 0, moonZ: -1.5, class: '.trigger5'}
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
	let triggerCones = document.getElementsByClassName('trigger-cone');

	const controller = new ScrollMagic.Controller({
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
	camera.position.set(0, 0, -120);
	camera.lookAt(scene.position.set);

	// Render
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	globeContainer.appendChild(renderer.domElement);

	// Sphere
 	const moon = new THREE.SphereGeometry(40, 50, 50);
	THREE.ImageUtils.crossOrigin = true;
	moon.rotateZ(-0.3);
	moon.rotateY(0.25);

	// Landing site markers
	const meshCones = coneData.map(function(c) {

		cone = new THREE.CylinderGeometry(1, 0, 10, 50, false);
		meshLambertCone = new THREE.MeshLambertMaterial({ color: 0x13a31a });
		meshCone = new THREE.Mesh(cone, meshLambertCone)
		meshCone.geometry.rotateX(Math.PI * 0.5);
		meshCone.visible = false;
		scene.add(meshCone);

		return {
			cone: cone,
			meshLambertCone: meshLambertCone,
			meshCone: meshCone,
		}
	});
	// console.log(meshCones);


 	// Camera controls
 	const controls = new THREE.OrbitControls(camera);
    // No vertical rotating
    controls.minPolarAngle = Math.PI / 2;
	controls.maxPolarAngle = Math.PI / 2;
    // Rotation has minimum starting in dark side
    // and maximum from front Moon angle
    controls.minAzimuthAngle = Math.PI / 40;
    controls.maxAzimuthAngle = Math.PI / 40;
        
    controls.update();
	// controls.autoRotate = true;
	controls.enableZoom = false;

 	// Use for adding image texture
	const textureLoader = new THREE.TextureLoader();
	textureLoader.crossOrigin = true;
	// Load image
	textureLoader.load('assets/img/moon-4k.png', (texture) => {

	 	const material = new THREE.MeshLambertMaterial({
	 		map: texture
	 	});
	 	const mesh = new THREE.Mesh(moon, material);
	 	scene.add(mesh);
	 	mesh.rotation.set(-0.08, 4.5, 0);

	 	render();
	});

	// Light
	const light = color;
 	light.position.set(0, 0, 25);
 	scene.add(light);

	// Change autoRotateSpeed to negative for reverse
	// controls.autoRotateSpeed = -6;

	const group = new THREE.Group();
	group.add(camera);
	scene.add(group);
	// group.add(moon);
	// group.add(light);


	function rotatingMoon() {

		const introTween = TweenMax.from(group.rotation, 4.5, { y: -3});

		for (i = 0; i < moonRotate.length; i++) {
			const tween = TweenMax.to(group.rotation, 1, { x: moonRotate[i].moonX, y: moonRotate[i].moonY, z: moonRotate[i].moonZ, ease:Power2.easeOut }, 0.25);

			new ScrollMagic.Scene({
				triggerElement: moonRotate[i].class
			})
			.setTween(tween)
			.addTo(controller);
		}
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

	// Event handler for showing cones on scroll
	window.addEventListener('scroll', coneVisibility);

 	// Render spinning animation function
 	const render = () => {
 		requestAnimationFrame(render);
 		controls.update();
 		renderer.render(scene, camera);
	 }

	 render();
	 rotatingMoon();

})();

// https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
// https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
// https://stackoverflow.com/questions/25308943/limit-orbitcontrols-horizontal-rotation/25311658#25311658
// https://stackoverflow.com/questions/37482231/camera-position-changes-in-three-orbitcontrols-in-three-js
// https://threejs.org/docs/#api/en/math/Quaternion
// https://github.com/vaneenige/THREE.Phenomenon
// https://tympanus.net/codrops/2019/03/22/how-to-create-smooth-webgl-transitions-on-scroll-using-phenomenon/
// https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another