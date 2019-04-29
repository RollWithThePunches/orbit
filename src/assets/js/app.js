;(() => {

	const moonRotate = [
		{moonX: 0, moonY: -0.8, moonZ: 0, class: '.moon-rotate_luna9'},
		{moonX: 0, moonY: -0.5, moonZ: 0, class: '.moon-rotate_surveyor1'},
		{moonX: 0, moonY: 0, moonZ: 0, class: '.moon-rotate_front'},
		{moonX: -1.5, moonY: 0, moonZ: -1.5, class: '.moon-rotate-down'},
		{moonX: 0, moonY: 0, moonZ: 0, class: '.moon-rotate-up'}
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
	let triggerCones = document.getElementsByClassName('show-marker');


	var mouseTopPerc = 0;
	function getMousePos() {
		return (mouseTopPerc * 400) + '100%';
	}
	document.body.addEventListener('mousemove', (e) => {
		mouseTopPerc = e.clientY / this.innerHeight();
	});

	// Scrollmagic controller
	const controller = new ScrollMagic.Controller({
		globalSceneOptions: {
			duration: getMousePos
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

	// Cube example
	const cube = new THREE.BoxGeometry(5, 5, 5);
	const cubeMaterial = new THREE.MeshNormalMaterial();
	const cubeMesh = new THREE.Mesh(cube, cubeMaterial);
	scene.add(cubeMesh);

	cubeMesh.position.z = 500;
	cubeMesh.position.y = -100;
	cubeMesh.position.x = -100;

	// Moon
 	const moon = new THREE.SphereGeometry(40, 50, 50);
	moon.rotateZ(-0.3);
	moon.rotateY(0.25);

	// Earth
	const earth = new THREE.SphereGeometry(90, 50, 50);
	earth.rotateZ(-0.3);
	earth.rotateY(0.25);

	// Landing site markers
	const meshCones = coneData.map((c) => {

		cone = new THREE.CylinderGeometry(1, 0, 10, 50, false);
		meshLambertCone = new THREE.MeshLambertMaterial({ color: 0x13a31a });
		meshCone = new THREE.Mesh(cone, meshLambertCone)
		meshCone.geometry.rotateX(Math.PI * 0.5);
		meshCone.visible = false;
		scene.add(meshCone);

		return {
			cone: cone,
			meshLambertCone: meshLambertCone,
			meshCone: meshCone
		}
	});
	// console.log(meshCones);


 	// Camera controls - Get rid of this
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


 	// Moon image texture
	const moonTextureLoader = new THREE.TextureLoader();
	moonTextureLoader.crossOrigin = true; //Used for CORS
	moonTextureLoader.load('assets/img/moon-4k-web.jpg', (texture) => {

	 	const material = new THREE.MeshLambertMaterial({
	 		map: texture
	 	});
	 	const mesh = new THREE.Mesh(moon, material);
	 	scene.add(mesh);
	 	mesh.rotation.set(-0.08, 4.5, 0);

	 	render();
	});


	// Earth image texture
	const earthTextureLoader = new THREE.TextureLoader();
	earthTextureLoader.crossOrigin = true;
	earthTextureLoader.load('assets/img/world.topo.bathy.200407.3x5400x2700-web.jpg', (texture) => {

	 	const material = new THREE.MeshLambertMaterial({
	 		map: texture
	 	});
	 	meshEarth = new THREE.Mesh(earth, material);
	 	scene.add(meshEarth);
		meshEarth.rotation.set(-0.08, 4.5, 0);
		 
		meshEarth.position.y = -300;
		meshEarth.position.z = 100;

		// Make earth rise
		const earthVisibile = TweenMax.fromTo(meshEarth.position, 10, {y: -300}, {y: -100});
		const earthHidden = TweenMax.to(meshEarth.position, 1, {y: -300});

		new ScrollMagic.Scene({
			triggerElement: '.earth-show'
		})
		.setTween(earthVisibile)
		.addTo(controller);

		new ScrollMagic.Scene({
			triggerElement: '.earth-hide'
		})
		.setTween(earthHidden)
		.addTo(controller);

	 	render();
	});

	// Light
	const light = color;
 	light.position.set(0, 0, 25);
 	scene.add(light);

	// Change autoRotateSpeed to negative for reverse
	// controls.autoRotateSpeed = -6;

	// Group
	const group = new THREE.Group();
	group.add(camera);
	scene.add(group);
	// group.add(moon);
	// group.add(light);

	var rectangle = document.getElementsByClassName('rect');
	var rectTween = TweenMax.to(rectangle, 2.5, {rotation: 180});

	new ScrollMagic.Scene({
		triggerElement: '.moon-rotate_front'
	})
	.setTween(rectTween)
	.addTo(controller);

	// Rotating moon
	function rotatingMoon() {

		new ScrollMagic.Scene({
			triggerElement: '.opening'
		})
		.setClassToggle('.canvas', 'fixed')
		// .addIndicators()
		.addTo(controller);

		const opening = TweenMax.from(group.rotation, 4.5, { y: -3});

		new ScrollMagic.Scene({
			triggerElement: globeContainer
		})
		.setTween(opening)
		// .addIndicators()
		.addTo(controller);

		const cameraZoomOutTween = TweenMax.to(camera.position, 1, {z: 200});
		const cameraZoomInTween = TweenMax.to(camera.position, 1, {z: 100});
		
		new ScrollMagic.Scene({
			triggerElement: '.moon-zoom-out'
		})
		.setTween(cameraZoomOutTween)
		.addTo(controller);

		for (i in moonRotate) {
			const moonRotationTween = TweenMax.to(group.rotation, 1, {x: moonRotate[i].moonX, y: moonRotate[i].moonY, z: moonRotate[i].moonZ, ease:Power2.easeOut}, 0.25);
			console.log(moonRotationTween);

			new ScrollMagic.Scene({
				triggerElement: moonRotate[i].class
			})
			.setTween(moonRotationTween)
			.addIndicators()
			.addTo(controller);
		}

		new ScrollMagic.Scene({
			triggerElement: '.moon-zoom-in'
		})
		.setTween(cameraZoomInTween)
		.addTo(controller);

	}

	// Rocket travel
	function rocketTravel() {
		
			const rocketLeftTween = TweenMax.to(cubeMesh.position, 3, {x: 50, y: 0, z: 0});
			const rocketBackTween = TweenMax.to(cubeMesh.position, 3, {bezier:[{x: 50, y: 0, z: 0}, {x: 0, y: 0, z: -50}, {x: -50, y: 0, z: 0}] });
			const rocketFrontTween = TweenMax.to(cubeMesh.position, 3, {bezier:[{x: -50, y: 0, z: 0}, {x: 0, y: 0, z: 50}, {x: 20, y: 0, z: 40}] });

			new ScrollMagic.Scene({
				triggerElement: '.rocket-right'
			})
			.setTween(rocketLeftTween)
			.addTo(controller);

			new ScrollMagic.Scene({
				triggerElement: '.rocket-back'
			})
			.setTween(rocketBackTween)
			.addTo(controller);

			new ScrollMagic.Scene({
				triggerElement: '.rocket-front'
			})
			.setTween(rocketFrontTween)
			.addTo(controller);
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

 	// Render spinning animation function
 	const render = () => {
 		requestAnimationFrame(render);
 		controls.update();
 		renderer.render(scene, camera);
	 }

	 function resize() {
		 camera.aspect = window.innerWidth / window.innerHeight;
		 camera.updateProjectionMatrix();
		 renderer.setSize(window.innerWidth, window.innerHeight);
	 }

	 render();
	 rotatingMoon();
	 rocketTravel();

	window.addEventListener('scroll', coneVisibility);
	window.addEventListener('resize', resize);

})();

// https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
// https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
// https://stackoverflow.com/questions/25308943/limit-orbitcontrols-horizontal-rotation/25311658#25311658
// https://stackoverflow.com/questions/37482231/camera-position-changes-in-three-orbitcontrols-in-three-js
// https://threejs.org/docs/#api/en/math/Quaternion
// https://github.com/vaneenige/THREE.Phenomenon
// https://tympanus.net/codrops/2019/03/22/how-to-create-smooth-webgl-transitions-on-scroll-using-phenomenon/
// https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another