import * as THREE from 'three';
import {GLTFLoader}  from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// ----- 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기

export default function example() {
	var textureLoader = new THREE.TextureLoader();
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.x = 5;
	camera.position.y = 90.5;
	camera.position.z = 4;
	scene.add(camera);
	var axesHelper = new THREE.AxesHelper(100); // 길이를 조절할 수 있습니다
	scene.add(axesHelper);
	var gridHelper = new THREE.GridHelper(100, 100,100); // 첫 번째 매개변수: 그리드 전체 크기, 두 번째 매개변수: 그리드 셀의 크기
	scene.add(gridHelper);
	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	//바닥
	const boxGeometry = new THREE.BoxGeometry(150, 1, 150);
	const roughnessMapTexture = textureLoader.load('/models/1.png');
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 'white' , roughnessMap: roughnessMapTexture });
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box2';

	const boxGeometry2 = new THREE.BoxGeometry(150, 6, 10);
	const boxMesh2 = new THREE.Mesh(boxGeometry2, boxMaterial);
	boxMesh2.name = 'box2';
	boxMesh2.position.set(0,2.5,-10);

	const boxGeometry3 = new THREE.BoxGeometry(150, 11, 10);
	const boxMesh3 = new THREE.Mesh(boxGeometry3, boxMaterial);
	boxMesh3.name = 'box3';
	boxMesh3.position.set(0,5,-15);

	const boxGeometry4 = new THREE.BoxGeometry(150, 16, 10);
	const boxMesh4 = new THREE.Mesh(boxGeometry4, boxMaterial);
	boxMesh4.name = 'box4';
	boxMesh4.position.set(0,7.5,-20);

	const boxGeometry5 = new THREE.BoxGeometry(150, 21, 50);
	const boxMesh5 = new THREE.Mesh(boxGeometry5, boxMaterial);
	boxMesh5.name = 'box5';
	boxMesh5.position.set(0,10,-45);


	 //////////////////영화 스크린
	 
	 var texture = textureLoader.load('/models/original.gif');
	 texture.wrapS = THREE.RepeatWrapping;
     texture.wrapT = THREE.RepeatWrapping;
	 
	 const planeGeometry = new THREE.PlaneGeometry(130, 75);
	 //비디오
	 var video = document.createElement('video');
	 video.src = '/models/video.mp4'; // 비디오 파일 경로 설정
	 video.volume = 0;
	 video.crossOrigin = 'anonymous'; // 크로스 오리진 설정
	 video.addEventListener('canplay', () => {
		// 비디오가 로드되고 재생할 수 있는 상태
		//init();
	  });
	  var videoTexture = new THREE.VideoTexture(video);
		var planeMaterial = new THREE.MeshStandardMaterial({ color: "white" ,map:videoTexture });
		let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
		 planeMesh.rotation.y = Math.PI; // 90도 회전
	 	planeMesh.position.set(0,40,80);
		scene.add(planeMesh);
		video.autoplay = true;
		video.loop = true;
	  function init(){
		
		video.play();
	  }

	 
	 
	//비디오

	 
	 
	 
	 

	 const planeGeometry2 = new THREE.PlaneGeometry(20, 20);
	 
	 const planeMaterial2 = new THREE.MeshStandardMaterial({ color: "white" ,side: THREE.DoubleSide});
	 let planeMesh2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
	 
	 // 직접 위치 설정
	
		// 카메라가 바라보는 방향 벡터 계산
		var cameraDirection = new THREE.Vector3();
		camera.getWorldDirection(cameraDirection);

		// 물체를 카메라의 위치에서 일정 거리만큼 뒤로 이동
		var distanceBehind = -20;
		var newPosition = new THREE.Vector3();
		newPosition.copy(camera.position).sub(cameraDirection.multiplyScalar(distanceBehind));

		// 물체의 위치를 설정
		planeMesh2.position.copy(newPosition);
		
		//scene.add(planeMesh2);
		//planeMesh2.position.z -= 5
		//planeMesh2.lookAt(camera)
	//////////////////영화 스크린

	const rectangleLight = new THREE.RectAreaLight(0xffffff, 1,5,5);
	rectangleLight.position.set(0, 100, -50);  // 위치 설정
	//rectangleLight.target.position.set(0, 50, 100);  // 빛이 향하는 방향 설정
	rectangleLight.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI ); 
	rectangleLight.intensity = 1000;
	//const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	//scene.add(spotLightHelper);
	const rectAreaLightHelper = new RectAreaLightHelper(rectangleLight);
	
	scene.add(boxMesh, boxMesh2, boxMesh3, boxMesh4 , boxMesh5  ,rectangleLight, rectAreaLightHelper);
	const meshes = [boxMesh];
	
	const raycaster = new THREE.Raycaster();

	//
	const gltfLoader = new GLTFLoader();

	var originalMesh ;

	
	gltfLoader.load('/models/pitsOffice.glb', 
		gltf=>{
			var pitsOffice = gltf.scene.children[0];
			pitsOffice.scale.set(20, 20, 20);
			pitsOffice.position.set(-75,20,-35)
			
			var pitsOffice2 = pitsOffice.clone();
			pitsOffice2.position.set(-55,20,-35)
			
			scene.add(pitsOffice,pitsOffice2);
			//scene.add(pitsOffice2);
		}
	);
	gltfLoader.load('/models/camera_exclusive.glb', 
		gltf=>{
			
			gltf.scene.traverse(function (child) {
				if (child.isMesh) {
		
		
					// 물체의 현재 재질을 새로운 재질로 교체
					//child.material.emissive = new THREE.Color("white");
				}
			});
			var cameraMesh = gltf.scene.children[0];
			cameraMesh.scale.set(70, 20, 10);
			cameraMesh.position.set(0,0,20)
			
			scene.add(cameraMesh);
		}
	);
	gltfLoader.load('/models/doorwayFront.glb', 
		gltf=>{
			 originalMesh = gltf.scene.children[0];
			 var originalMesh2 = originalMesh.clone();
			
			
			originalMesh.scale.set(10, 10, 10);
			originalMesh.position.set(-75,0,25)
			originalMesh.rotation.y =  THREE.MathUtils.degToRad(90);

			originalMesh2.scale.set(10, 10, 10);
			originalMesh2.position.set(-76,0,15)
			originalMesh2.rotation.y =  THREE.MathUtils.degToRad(-90);
			
			
			//originalMesh2.rotation.y = -(Math.PI / 2); // 90도 회전
			scene.add(originalMesh);
			scene.add(originalMesh2);
	});
	gltfLoader.load(
		'/models/loungeChair.glb',
		gltf=>{
			// Assuming the mesh is the first child of the glTF scene
			var originalMesh = gltf.scene.children[0];
			
			var redColor = new THREE.Color("black");
			var numberOfInstances = 15;
			// Create multiple instances of the mesh
			for (let i = -15; i < numberOfInstances; i++) {

				if(i==0 || i==-1)continue;
				if(i==12 || i==-12)continue;

				// Clone the original mesh
				var clonedMesh = originalMesh.clone();
				var clonedMesh2 = originalMesh.clone();
				var clonedMesh3 = originalMesh.clone();
				var clonedMesh4 = originalMesh.clone();
				var clonedMesh5 = originalMesh.clone();
		
				// Optionally, set individual properties for each instance
				clonedMesh.position.set(5*i,0,0);
								
				// Scale each instance if needed
				clonedMesh.scale.set(10, 10, 10);

				clonedMesh2.position.set(5*i,5,-5);				
				clonedMesh2.scale.set(10, 10, 10);
				clonedMesh3.position.set(5*i,10,-10);				
				clonedMesh3.scale.set(10, 10, 10);
				clonedMesh4.position.set(5*i,15,-15);				
				clonedMesh4.scale.set(10, 10, 10);
				clonedMesh5.position.set(5*i,20,-20);				
				clonedMesh5.scale.set(10, 10, 10);
		
				
				
				scene.add(clonedMesh);
				scene.add(clonedMesh2);
				scene.add(clonedMesh3);
				scene.add(clonedMesh4);
				scene.add(clonedMesh5);
				
			}
		}
	)
	//

	// 그리기
	const clock = new THREE.Clock();
	var offset = 0;
	function draw() {
		
		cameraDirection = new THREE.Vector3();
		camera.getWorldDirection(cameraDirection);
		

		// 물체를 카메라의 위치에서 일정 거리만큼 뒤로 이동
		var distanceBehind = -40;
		var newPosition = new THREE.Vector3();
		newPosition.copy(camera.position).sub(cameraDirection.multiplyScalar(distanceBehind));

		// 물체의 위치를 설정
		planeMesh2.position.copy(newPosition);


		
		// 카메라를 향하도록 설정
	planeMesh2.lookAt(camera.position);

		offset += 0.001;
		if(videoTexture)videoTexture.needsUpdate = true;
		//texture.offset.set(0, offset);
		// const delta = clock.getDelta();
		const time = clock.getElapsedTime();
		/*
		boxMesh.position.y = Math.sin(time) * 2;
		torusMesh.position.y = Math.cos(time) * 2;
		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');

		const origin = new THREE.Vector3(0, 0, 100);
		// const direction = new THREE.Vector3(0, 0, -1);
		const direction = new THREE.Vector3(0, 0, -100);
		// console.log(direction.length());
		direction.normalize();
		// console.log(direction.length());
		raycaster.set(origin, direction);

		const intersects = raycaster.intersectObjects(meshes);
		intersects.forEach(item => {
			// console.log(item.object.name);
			item.object.material.color.set('red');
		});
		*/
		
		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
