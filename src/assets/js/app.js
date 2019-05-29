;(() => {

	const moonRotate = [
		{moonX: 0, moonY: -0.8, moonZ: 0, class: '.moon-rotate_luna9'},
		{moonX: 0, moonY: -0.5, moonZ: 0, class: '.moon-rotate_surveyor1'},
		{moonX: 0, moonY: 0, moonZ: 0, class: '.moon-rotate_front'},
		{moonX: -1.5, moonY: 0, moonZ: 0, class: '.moon-rotate-down'},
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
	// const manager = new THREE.LoadingManager();

	// manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	// 	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	// };
	
	// manager.onLoad = function ( ) {
	// 	console.log( 'Loading complete!');
	// };
	
	
	// manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	// 	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	// };
	
	// manager.onError = function ( url ) {
	// 	console.log( 'There was an error loading ' + url );
	// };

	// const loader = new THREE.OBJLoader(manager);
	// const mtlLoader = new THREE.MTLLoader(manager);
	const loader = new THREE.OBJLoader();
	const mtlLoader = new THREE.MTLLoader();

	let mouseTopPerc = 0;
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
		75, window.innerWidth / window.innerHeight, 0.1, 1000
	);
	// camera.position.set(0, 0, -120);
	// camera.lookAt(scene.position.set);
	camera.position.z = 100;

	// Render
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	globeContainer.appendChild(renderer.domElement);

	// Moon
	//  const moon = new THREE.SphereGeometry(40, 50, 50);
	//  scene.add(moon);
	// moon.rotateZ(-0.3);
	// moon.rotateY(0.25);


	

	// Earth
	const earth = new THREE.SphereGeometry(90, 50, 50);
	earth.rotateZ(-0.3);
	earth.rotateY(0.25);
	
	// Moon obj
	function moonOBJ() {
		mtlLoader
		.setPath('assets/img/obj/')
		.load(
			'Moon-2K-smooth.mtl',
			(materials) => {
				materials.preload();

				loader.setMaterials(materials)
				.setPath('assets/img/obj/')
				.load(
					'Moon-2K-smooth.obj',
					(object) => {
						scene.add(object);
						object.scale.set(13, 13, 13);	
						object.rotateX(-1.1);					
						object.rotateY(2.9);
						object.rotateZ(2);
					} 
				);
			}
		);
	}

	// Earth obj
	// function earthOBJ() {
	// 	mtlLoader
	// 	.setPath('assets/img/obj/')
	// 	.load(
	// 		'Earth-2K.mtl',
	// 		(materials) => {
	// 			materials.preload();

	// 			loader.setMaterials(materials)
	// 			.setPath('assets/img/obj/')
	// 			.load(
	// 				'Earth-2K.obj',
	// 				(object) => {
	// 					scene.add(object);
	// 					object.scale.set(30, 30, 30);
	// 					object.position.y = -100;						
	// 					object.rotateY(0.25);
	// 					object.rotateZ(-0.3);
	// 				} 
	// 			);
	// 		}
	// 	);
	// }


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

	
 	// Moon image texture
	// const moonTextureLoader = new THREE.TextureLoader();
	// moonTextureLoader.crossOrigin = true; //Used for CORS
	// moonTextureLoader.load('assets/img/moon-4k-web2.jpg', (texture) => {

	//  	const material = new THREE.MeshLambertMaterial({
	//  		map: texture
	//  	});
	//  	const mesh = new THREE.Mesh(moon, material);
	//  	scene.add(mesh);
	//  	mesh.rotation.set(-0.08, 4.5, 0);

	//  	render();
	// });
	// moonTextureLoader.anisotropy = renderer.capabilities.getMaxAnisotropy();


	// Earth image texture
	const earthTextureLoader = new THREE.TextureLoader();
	earthTextureLoader.crossOrigin = true;
	earthTextureLoader.load('assets/img/world.topo.bathy.200407.3x5400x2700-web2.jpg', (texture) => {

	 	const material = new THREE.MeshLambertMaterial({
	 		map: texture
	 	});
	 	meshEarth = new THREE.Mesh(earth, material);
	 	scene.add(meshEarth);
		meshEarth.rotation.set(-0.08, 4.5, 0);
		 
		meshEarth.position.y = -300;
		meshEarth.position.z = 100;


		var customMaterial = new THREE.ShaderMaterial( 
			{
				uniforms: 
				{
					"c":   { type: "f", value: 0.01 },
					"p":   { type: "f", value: 6 },
					glowColor: { type: "c", value: new THREE.Color(0x508dff) },
					viewVector: { type: "v3", value: camera.position }
				},
				vertexShader:   document.getElementById('vertexShader').textContent,
				fragmentShader: document.getElementById('fragmentShader').textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	
		var earthAtmosphere = new THREE.Mesh(earth.clone(), customMaterial.clone());
		earthAtmosphere.position = meshEarth.position;
		earthAtmosphere.scale.multiplyScalar(1.2);
		scene.add(earthAtmosphere);

		earthAtmosphere.position.y = -108;
		earthAtmosphere.position.z = 100;
		earthAtmosphere.rotateX(11.5);					
		earthAtmosphere.rotateY(18.9);
		earthAtmosphere.rotateZ(2);

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
 	light.position.set(0, 5, 25);
 	scene.add(light);

	// Group
	const group = new THREE.Group();
	group.add(camera);
	scene.add(group);


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
			triggerElement: '.opening-rotate'
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
			// .addIndicators()
			.addTo(controller);
		}

		new ScrollMagic.Scene({
			triggerElement: '.moon-zoom-in'
		})
		.setTween(cameraZoomInTween)
		.addTo(controller);

	}


	// Rotating moon
	// function rotatingMoon() {

	// 	new ScrollMagic.Scene({
	// 		triggerElement: '.opening'
	// 	})
	// 	.setClassToggle('.canvas', 'fixed')
	// 	// .addIndicators()
	// 	.addTo(controller);

	// 	const opening = TweenMax.from(group.rotation, 4.5, { y: -3});

	// 	new ScrollMagic.Scene({
	// 		triggerElement: globeContainer
	// 	})
	// 	.setTween(opening)
	// 	// .addIndicators()
	// 	.addTo(controller);

	// 	const cameraZoomOutTween = TweenMax.to(camera.position, 1, {z: 200});
	// 	const cameraZoomInTween = TweenMax.to(camera.position, 1, {z: 100});
		
	// 	new ScrollMagic.Scene({
	// 		triggerElement: '.moon-zoom-out'
	// 	})
	// 	.setTween(cameraZoomOutTween)
	// 	.addTo(controller);

	// 	for (i in moonRotate) {
	// 		const moonRotationTween = TweenMax.to(group.rotation, 1, {x: moonRotate[i].moonX, y: moonRotate[i].moonY, z: moonRotate[i].moonZ, ease:Power2.easeOut}, 0.25);
	// 		console.log(moonRotationTween);

	// 		new ScrollMagic.Scene({
	// 			triggerElement: moonRotate[i].class
	// 		})
	// 		.setTween(moonRotationTween)
	// 		// .addIndicators()
	// 		.addTo(controller);
	// 	}

	// 	new ScrollMagic.Scene({
	// 		triggerElement: '.moon-zoom-in'
	// 	})
	// 	.setTween(cameraZoomInTween)
	// 	.addTo(controller);

	// }

	// Rocket
	function rocket() {

		loader.load(
			'assets/img/bottle-reduced.obj',
			(object) => {
				object.position.z = 500;
				object.position.y = -100;
				object.position.x = -100;
				object.rotateY(20);
				object.rotateZ(80.5);
				scene.add(object);

				const rocketRightTween = TweenMax.to(object.position, 3, {x: 50, y: 0, z: 0});
				const rocketRotateRight = TweenMax.to(object.rotation, 3, {y: 1.2});
				const rocketBackTween = TweenMax.to(object.position, 3, {bezier:[{x: 50, y: 0, z: 0}, {x: 0, y: 0, z: -50}, {x: -50, y: 0, z: 0}] });
				const rocketRotateCenter = TweenMax.to(object.rotation, 3, {y: 5.2});
				const rocketFrontTween = TweenMax.to(object.position, 3, {bezier:[{x: -50, y: 0, z: 0}, {x: 0, y: 0, z: 50}, {x: 20, y: 0, z: 40}] });
				const rocketRotateLeft = TweenMax.to(object.rotation, 3, {y: 8.2});

				new ScrollMagic.Scene({
					triggerElement: '.rocket-right'
				})
				.setTween(rocketRightTween)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-right'
				})
				.setTween(rocketRotateRight)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-back'
				})
				.setTween(rocketBackTween)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-back'
				})
				.setTween(rocketRotateCenter)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-front'
				})
				.setTween(rocketFrontTween)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-front'
				})
				.setTween(rocketRotateLeft)
				.addTo(controller);

			}
		);

		loader.load(
			'assets/img/bottle-reduced-duplicate.obj',
			(object) => {
				// object.position.z = 500;
				object.position.y = -90;
				object.position.x = -96;
				object.rotateY(20);
				object.rotateZ(80.5);
				scene.add(object);

				const rocketRightTween = TweenMax.to(object.position, 3, {x: 46, y: -4, z: 10});
				const rocketRotateRight = TweenMax.to(object.rotation, 3, {y: 1.2});
				const rocketBackTween = TweenMax.to(object.position, 3, {x: 50, y: -100, z: 10});

				new ScrollMagic.Scene({
					triggerElement: '.rocket-right'
				})
				.setTween(rocketRightTween)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-right'
				})
				.setTween(rocketRotateRight)
				.addTo(controller);

				new ScrollMagic.Scene({
					triggerElement: '.rocket-back'
				})
				.setTween(rocketBackTween)
				.addTo(controller);
			}
		);
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
 		renderer.render(scene, camera);
	 }

	 function resize() {
		 camera.aspect = window.innerWidth / window.innerHeight;
		 camera.updateProjectionMatrix();
		 renderer.setSize(window.innerWidth, window.innerHeight);
	 }

	 render();
	 moonOBJ();
	//  earthOBJ();
	 rotatingMoon();
	 rocket();
	//  rocketTravel();

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
// http://stemkoski.github.io/Three.js/