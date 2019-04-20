
;(() => {

   const orbitData = [
        {rotateZ: -0.01, lightY: -2, cameraZ: 0.5},
        {rotateZ: 0.01, lightY: 0, cameraZ: -0.5}
    ];

	const globeContainer = document.getElementById('globe-container');
	const scene = new THREE.Scene();
	const color1 = new THREE.DirectionalLight(0xFFFFFF);

	const camera = new THREE.PerspectiveCamera(
		55, window.innerWidth / window.innerHeight, 0.1, 1000
	);

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	globeContainer.appendChild(renderer.domElement);

 	const geometry = new THREE.SphereGeometry(40, 50, 50);
    THREE.ImageUtils.crossOrigin = true;
     
    const circle = new THREE.CircleGeometry(1, 50, 50);
 	const meshLambertCircle = new THREE.MeshLambertMaterial({ color: 0xdddddd });
 	const meshCircle = new THREE.Mesh(circle, meshLambertCircle);
	scene.add(meshCircle);

	meshCircle.position.x = -11;
	meshCircle.position.y = 10;
	meshCircle.position.z = 50;


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

		// Make texture repeat
		// May not actually need this
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 1);

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

	const light = color1;
 	light.position.set(10, 0, 25);
 	scene.add(light);

	// Change autoRotateSpeed to negative for reverse
    controls.autoRotateSpeed = -6;

    // Event handler for animations in scroll
	const animateCamera = () => {
		let elems, windowHeight;
		const init = () => {
		    elems = document.getElementsByClassName('trigger');
		    windowHeight = window.innerHeight;
		    _addEventHandlers();
		}
	    const _addEventHandlers = () =>  {
	    	window.addEventListener('scroll', _checkPosition);
	    	// window.addEventListener('resize', init)
	  	}
	  	const _checkPosition = () => {
	    	for (let i = 0; i < elems.length; i++) {
	      		let posFromTop = elems[i].getBoundingClientRect().top
		      	if (posFromTop - windowHeight <= 0) {

					geometry.rotateZ(orbitData[i].rotateZ);
					light.position.y += orbitData[i].lightY;
                    camera.position.z += orbitData[i].cameraZ;
                    console.log(orbitData[i].rotateZ);
		      	}
	    	}
  		}
			return {
			    init: init
			}
	}
	animateCamera().init();


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