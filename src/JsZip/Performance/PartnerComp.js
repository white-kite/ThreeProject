import * as THREE from 'three';
// gltp 파일 로드르 위해
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Player } from './Player';
import { Man } from './Man';
import gsap from 'gsap';

// 사업실적 - 파트너사
// 2024-02-13 백재원, 최초 작성

export default function PartnerCompCanvas() {
	// Texture
	const textureLoader = new THREE.TextureLoader();
	const floorTexture = textureLoader.load('/images/partnercomp/grid.png');
	// 바닥 반복, repeat.x 와 y로 반복 횟수 조절 가능
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.x = 10;
	floorTexture.repeat.y = 10;


	// Renderer
	const canvas = document.querySelector('#PartnerCompCanvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
	// 그림자 쓸거니까 true
	renderer.shadowMap.enabled = true;
	// 그림자 부드럽게
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Scene
	const scene = new THREE.Scene();

	// Camera - 직교 카메라 :원근감 x
	const camera = new THREE.OrthographicCamera(
		-(window.innerWidth / window.innerHeight), // left
		window.innerWidth / window.innerHeight, // right,
		1, // top
		-1, // bottom
		-1000,
		1000
	);

	// 카메라 위치
	const cameraPosition = new THREE.Vector3(1, 5, 5);
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
	// 직교 카메라는 zoom 설정 가능
	camera.zoom = 0.2;
	camera.updateProjectionMatrix();
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.7);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 0.5);
	const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
	directionalLight.position.x = directionalLightOriginPosition.x;
	directionalLight.position.y = directionalLightOriginPosition.y;
	directionalLight.position.z = directionalLightOriginPosition.z;
	directionalLight.castShadow = true;

	// mapSize 세팅으로 그림자 퀄리티 설정
	// 클수록 버벅거림 커짐
	directionalLight.shadow.mapSize.width = 2048;
	directionalLight.shadow.mapSize.height = 2048;
	// 그림자 범위
	directionalLight.shadow.camera.left = -100;
	directionalLight.shadow.camera.right = 100;
	directionalLight.shadow.camera.top = 100;
	directionalLight.shadow.camera.bottom = -100;
	directionalLight.shadow.camera.near = -100;
	directionalLight.shadow.camera.far = 100;
	scene.add(directionalLight);

	// Mesh
	const meshes = [];
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100),
		new THREE.MeshStandardMaterial({
			map: floorTexture
		})
	);
	floorMesh.name = 'floor';
	// 바닥에 깔려고 rotation 돌려줌
	floorMesh.rotation.x = -Math.PI/2;
	floorMesh.receiveShadow = true;
	scene.add(floorMesh);
	meshes.push(floorMesh);

	const pointerMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		new THREE.MeshBasicMaterial({
			color: 'crimson',
			transparent: true,
			opacity: 0.5
		})
	);
	pointerMesh.rotation.x = -Math.PI/2;
	pointerMesh.position.y = 0.01;
	pointerMesh.receiveShadow = true;
	scene.add(pointerMesh);

	// partnerimg
	const partnerimg = textureLoader.load('/images/partnercomp/partner.png', function () {
		const imgAspectRatio = partnerimg.image.width / partnerimg.image.height;

		const partnerMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(8, 10 / imgAspectRatio),
			new THREE.MeshStandardMaterial({
				map: partnerimg
			})
		);

		partnerMesh.name = 'partnerMesh';
		partnerMesh.position.set(1, 2.5, -2);
		partnerMesh.receiveShadow = true;
		scene.add(partnerMesh);
		meshes.push(partnerMesh);

	});


	// 밟는 땅
	const spotMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 3),
		new THREE.MeshStandardMaterial({
			color: 'yellow',
			transparent: true,
			opacity: 0.5
		})
	);
	spotMesh.position.set(5, 0.005, 5);
	spotMesh.rotation.x = -Math.PI/2;
	spotMesh.receiveShadow = true;
	scene.add(spotMesh);

	// redhatMesh
	// 먼저 redhatMesh 정의
	const redhatMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 1),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,  // 기본 색상 설정 
		})
	);

	redhatMesh.name = 'redhatMesh';
	redhatMesh.position.set(5, -2, 3);
	redhatMesh.receiveShadow = true;
	scene.add(redhatMesh);
	meshes.push(redhatMesh);

	// redhatimg
	const redhatimg = textureLoader.load('/images/partnercomp/redhat.png', function () {
		// 이미지 로딩 후 실행될 코드
		// 여기서 Mesh의 map을 업데이트, 이미지의 가로 세로 비율 계산
		const imgAspectRatio = redhatimg.image.width / redhatimg.image.height;
		redhatMesh.geometry = new THREE.PlaneGeometry(3, 6 / imgAspectRatio);
		redhatMesh.material.map = redhatimg;
		redhatMesh.material.needsUpdate = true;
	});



	//밟는 땅 2
	const spotMesh2 = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 3),
		new THREE.MeshStandardMaterial({
			color: '#2ecc71',
			transparent: true,
			opacity: 0.5
		})
	);
	spotMesh2.position.set(10, 0.005, 5);
	spotMesh2.rotation.x = -Math.PI/2;
	spotMesh2.receiveShadow = true;
	scene.add(spotMesh2);



	// aristaMesh
	const aristaMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 1),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,  // 기본 색상 설정 
		})
	);

	aristaMesh.name = 'aristaMesh';
	aristaMesh.position.set(10, -2, 3);
	aristaMesh.receiveShadow = true;
	scene.add(aristaMesh);
	meshes.push(aristaMesh);

	// aristaimg
	const aristaimg = textureLoader.load('/images/partnercomp/arista.png', function () {
		// 이미지 로딩 후 실행될 코드
		// 여기서 Mesh의 map을 업데이트, 이미지의 가로 세로 비율 계산
		const imgAspectRatio = aristaimg.image.width / aristaimg.image.height;
		aristaMesh.geometry = new THREE.PlaneGeometry(3, 6 / imgAspectRatio);
		aristaMesh.material.map = aristaimg;
		aristaMesh.material.needsUpdate = true;
	});


	//밟는 땅 3
	const spotMesh3 = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 3),
		new THREE.MeshStandardMaterial({
			color: 'blue',
			transparent: true,
			opacity: 0.5
		})
	);
	spotMesh3.position.set(15, 0.005, 5);
	spotMesh3.rotation.x = -Math.PI/2;
	spotMesh3.receiveShadow = true;
	scene.add(spotMesh3);


	// tmaxMesh
	const tmaxMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 1),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,  // 기본 색상 설정 
		})
	);

	tmaxMesh.name = 'tmaxMesh';
	tmaxMesh.position.set(15, -2, 3);
	tmaxMesh.receiveShadow = true;
	scene.add(tmaxMesh);
	meshes.push(tmaxMesh);

	// tmaximg
	const tmaximg = textureLoader.load('/images/partnercomp/tmax.png', function () {
		// 이미지 로딩 후 실행될 코드
		// 여기서 Mesh의 map을 업데이트, 이미지의 가로 세로 비율 계산
		const imgAspectRatio = tmaximg.image.width / tmaximg.image.height;
		tmaxMesh.geometry = new THREE.PlaneGeometry(3, 6 / imgAspectRatio);
		tmaxMesh.material.map = tmaximg;
		tmaxMesh.material.needsUpdate = true;
	});


	//밟는 땅 4
	const spotMesh4 = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 3),
		new THREE.MeshStandardMaterial({
			color: 'blue',
			transparent: true,
			opacity: 0.5
		})
	);
	spotMesh4.position.set(5, 0.005, 11);
	spotMesh4.rotation.x = -Math.PI/2;
	spotMesh4.receiveShadow = true;
	scene.add(spotMesh4);


	// ktMesh
	const ktMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 1),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,  // 기본 색상 설정 
		})
	);

	ktMesh.name = 'ktMesh';
	ktMesh.position.set(5, -2, 7);
	ktMesh.receiveShadow = true;
	scene.add(ktMesh);
	meshes.push(ktMesh);

	// ktimg
	const ktimg = textureLoader.load('/images/partnercomp/kt.png', function () {
		// 이미지 로딩 후 실행될 코드
		// 여기서 Mesh의 map을 업데이트, 이미지의 가로 세로 비율 계산
		const imgAspectRatio = ktimg.image.width / ktimg.image.height;
		ktMesh.geometry = new THREE.PlaneGeometry(3, 6 / imgAspectRatio);
		ktMesh.material.map = ktimg;
		ktMesh.material.needsUpdate = true;
	});


	//밟는 땅 5
	const spotMesh5 = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 3),
		new THREE.MeshStandardMaterial({
			color: 'blue',
			transparent: true,
			opacity: 0.5
		})
	);
	spotMesh5.position.set(10, 0.005, 11);
	spotMesh5.rotation.x = -Math.PI/2;
	spotMesh5.receiveShadow = true;
	scene.add(spotMesh5);


	// edbMesh
	const edbMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 1),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,  // 기본 색상 설정 
		})
	);

	edbMesh.name = 'edbMesh';
	edbMesh.position.set(10, -2, 7);
	edbMesh.receiveShadow = true;
	scene.add(edbMesh);
	meshes.push(edbMesh);

	// edbimg
	const edbimg = textureLoader.load('/images/partnercomp/edb.png', function () {
		// 이미지 로딩 후 실행될 코드
		// 여기서 Mesh의 map을 업데이트, 이미지의 가로 세로 비율 계산
		const imgAspectRatio = edbimg.image.width / edbimg.image.height;
		edbMesh.geometry = new THREE.PlaneGeometry(3, 6 / imgAspectRatio);
		edbMesh.material.map = edbimg;
		edbMesh.material.needsUpdate = true;
	});


	//밟는 땅 6
	const spotMesh6 = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 3),
		new THREE.MeshStandardMaterial({
			color: 'blue',
			transparent: true,
			opacity: 0.5
		})
	);
	spotMesh6.position.set(15, 0.005, 11);
	spotMesh6.rotation.x = -Math.PI/2;
	spotMesh6.receiveShadow = true;
	scene.add(spotMesh6);

	// zconMesh
	const zconMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(3, 1),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,  // 기본 색상 설정 
		})
	);

	zconMesh.name = 'zconMesh';
	zconMesh.position.set(15, -2, 7);
	zconMesh.receiveShadow = true;
	scene.add(zconMesh);
	meshes.push(zconMesh);

	// zconimg
	const zconimg = textureLoader.load('/images/partnercomp/zcon.png', function () {
		// 이미지 로딩 후 실행될 코드
		// 여기서 Mesh의 map을 업데이트, 이미지의 가로 세로 비율 계산
		const imgAspectRatio = zconimg.image.width / zconimg.image.height;
		zconMesh.geometry = new THREE.PlaneGeometry(3, 6 / imgAspectRatio);
		zconMesh.material.map = zconimg;
		zconMesh.material.needsUpdate = true;
	});


	const gltfLoader = new GLTFLoader();

	const redhat = new Man({
		gltfLoader,
		scene,
		
		modelSrc: '/models/greeting_man.glb',
		x: 5,
		y: -2,
		z: 2
	});

	const arista = new Man({
		gltfLoader,
		scene,
		modelSrc: '/models/greeting_man.glb',
		x: 10,
		y: -2,
		z: 2
	});

	const tmax = new Man({
		gltfLoader,
		scene,
		modelSrc: '/models/greeting_man.glb',
		x: 15,
		y: -2,
		z: 2
	});

	const kt = new Man({
		gltfLoader,
		scene,
		modelSrc: '/models/greeting_man.glb',
		x: 5,
		y: -2,
		z: 10
	});

	const edb = new Man({
		gltfLoader,
		scene,
		modelSrc: '/models/greeting_man.glb',
		x: 10,
		y: -2,
		z: 10
	});

	const zcon = new Man({
		gltfLoader,
		scene,
		modelSrc: '/models/greeting_man.glb',
		x: 15,
		y: -2,
		z: 10
	});

	const player = new Player({
		scene,
		meshes,
		gltfLoader,
		modelSrc: '/models/ilbuni.glb'
	});

	// 빛으로 쏴서 물체 인식하는 raycaster
	const raycaster = new THREE.Raycaster();
	let mouse = new THREE.Vector2();
	let destinationPoint = new THREE.Vector3();
	let angle = 0;
	let isPressed = false; // 마우스를 누르고 있는 상태

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		// 애니메이션 때문에 mixer.update를 해줘야한다.
		if (player.mixer) player.mixer.update(delta);
		if (redhat.mixer) redhat.mixer.update(delta);
		if (arista.mixer) arista.mixer.update(delta);
		if (tmax.mixer) tmax.mixer.update(delta);
		if (kt.mixer) kt.mixer.update(delta);
		if (edb.mixer) edb.mixer.update(delta);
		if (zcon.mixer) zcon.mixer.update(delta);

		if (player.modelMesh) {
			// 카메라가 모델 메쉬 바라보도록 설정
			camera.lookAt(player.modelMesh.position);
		}

		if (player.modelMesh) {

			// 마우스를 클릭했거나 누르고 있는 상태일때만
			if (isPressed) {
				// 변환된 마우스 좌표를 이용해 래이캐스팅
				raycasting();
			}

			if (player.moving) {
				// 걸어가는 상태
				angle = Math.atan2(
					destinationPoint.z - player.modelMesh.position.z,
					destinationPoint.x - player.modelMesh.position.x
				);
				player.modelMesh.position.x += Math.cos(angle) * 0.05;
				player.modelMesh.position.z += Math.sin(angle) * 0.05;

				camera.position.x = cameraPosition.x + player.modelMesh.position.x;
				camera.position.z = cameraPosition.z + player.modelMesh.position.z;
				
				// 기본 애니메이션은 멈춰주고 움직이는걸 play 해준다.
				player.actions[0].stop();
				player.actions[1].play();

				redhat.actions[0].stop();
				arista.actions[0].stop();
				tmax.actions[0].stop();
				kt.actions[0].stop();
				edb.actions[0].stop();
				zcon.actions[0].stop();
				
				
				if (
					// 목표 지점과 플레이어 위치의 차가  0.03 보다 작으면
					Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
					Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
				) {
					// 멈춘다.
					player.moving = false;
					console.log(player.modelMesh.position);
					console.log('멈춤');
				}

				if (
					// 물체 나오는 노란 발판과 플레이어 위치 비교 1
					Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
					Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1.5
				) {
					if (!redhat.visible) {
						
						// 애니메이션의 루프 모드를 Repeat로 설정
						redhat.actions[0].setLoop(THREE.LoopRepeat);
						
						// 애니메이션을 시작
						redhat.actions[0].play();

						spotMesh.material.color.set('seagreen');
						// 애니메이션 라이브러리 사용
						gsap.to(
							redhat.modelMesh.position,
							{
								duration: 1,
								y: 1,
								// 라이브러리의 효과 사용
								ease: 'Bounce.easeOut'
							}
						);
						gsap.to(
							redhatMesh.position,
							{
								duration: 0.5,
								y: 1, // 이동할 위치의 y 값
								ease: 'Power2.easeInOut' // 움직임의 ease 설정
							}
						);
						// 카메라 각도 살짝 바뀜
						gsap.to(
							camera.position,
							{
								duration: 1,
								y: 3
							}
						);
					}
				} else {
					redhat.actions[0].stop();
					redhat.visible = false;
					spotMesh.material.color.set('yellow');
					gsap.to(
						redhat.modelMesh.position,
						{
							duration: 0.5,
							y: -2
						},
						
					);
					gsap.to(
						redhatMesh.position,
						{
							duration: 0.5,
							y: -2
						},
					);
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 5
						}
					);
				}

				if (
					// 물체 나오는 노란 발판과 플레이어 위치 비교 2
					Math.abs(spotMesh2.position.x - player.modelMesh.position.x) < 1.5 &&
					Math.abs(spotMesh2.position.z - player.modelMesh.position.z) < 1.5
				) {
					if (!arista.visible) {
						// 애니메이션의 루프 모드를 Repeat로 설정
						arista.actions[0].setLoop(THREE.LoopRepeat);
						
						// 애니메이션을 시작
						arista.actions[0].play();
						
						spotMesh2.material.color.set('seagreen');
						// 애니메이션 라이브러리 사용
						gsap.to(
							arista.modelMesh.position,
							{
								duration: 1,
								y: 1,
								// 라이브러리의 효과 사용
								ease: 'Bounce.easeOut'
							}
						);
						gsap.to(
							aristaMesh.position,
							{
								duration: 0.5,
								y: 1, // 이동할 위치의 y 값
								ease: 'Power2.easeInOut' // 움직임의 ease 설정
							}
						);
						// 카메라 각도 살짝 바뀜
						gsap.to(
							camera.position,
							{
								duration: 1,
								y: 3
							}
						);
					}
				} else {
					arista.visible = false;
					spotMesh2.material.color.set('yellow');
					gsap.to(
						arista.modelMesh.position,
						{
							duration: 0.5,
							y: -2
						}
					);
					gsap.to(
						aristaMesh.position,
						{
							duration: 0.5,
							y: -2, // 이동할 위치의 y 값
						}
					);
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 5
						}
					);
				}

				if (
					// 물체 나오는 노란 발판과 플레이어 위치 비교 3
					Math.abs(spotMesh3.position.x - player.modelMesh.position.x) < 1.5 &&
					Math.abs(spotMesh3.position.z - player.modelMesh.position.z) < 1.5
				) {
					if (!tmax.visible) {
						// 애니메이션의 루프 모드를 Repeat로 설정
						tmax.actions[0].setLoop(THREE.LoopRepeat);

						// 애니메이션을 시작
						tmax.actions[0].play();

						spotMesh3.material.color.set('seagreen');
						// 애니메이션 라이브러리 사용
						gsap.to(
							tmax.modelMesh.position,
							{
								duration: 1,
								y: 1,
								// 라이브러리의 효과 사용
								ease: 'Bounce.easeOut'
							}
						);
						gsap.to(
							tmaxMesh.position,
							{
								duration: 0.5,
								y: 1, // 이동할 위치의 y 값
								ease: 'Power2.easeInOut' // 움직임의 ease 설정
							}
						);
						// 카메라 각도 살짝 바뀜
						gsap.to(
							camera.position,
							{
								duration: 1,
								y: 3
							}
						);
					}
				} else {
					tmax.visible = false;
					spotMesh3.material.color.set('yellow');
					gsap.to(
						tmax.modelMesh.position,
						{
							duration: 0.5,
							y: -2
						}
					);
					gsap.to(
						tmaxMesh.position,
						{
							duration: 0.5,
							y: -2 
						}
					);
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 5
						}
					);
				}

				if (
					// 물체 나오는 노란 발판과 플레이어 위치 비교 4
					Math.abs(spotMesh4.position.x - player.modelMesh.position.x) < 1.5 &&
					Math.abs(spotMesh4.position.z - player.modelMesh.position.z) < 1.5
				) {
					if (!kt.visible) {
						// 애니메이션의 루프 모드를 Repeat로 설정
						kt.actions[0].setLoop(THREE.LoopRepeat);

						// 애니메이션을 시작
						kt.actions[0].play();

						spotMesh3.material.color.set('seagreen');
						// 애니메이션 라이브러리 사용
						gsap.to(
							kt.modelMesh.position,
							{
								duration: 1,
								y: 1,
								// 라이브러리의 효과 사용
								ease: 'Bounce.easeOut'
							}
						);
						gsap.to(
							ktMesh.position,
							{
								duration: 1,
								y: 1,
								ease: 'Circ.easeOut'
							}
						);
						// 카메라 각도 살짝 바뀜
						gsap.to(
							camera.position,
							{
								duration: 1,
								y: 3
							}
						);
					}
				} else {
					kt.visible = false;
					spotMesh3.material.color.set('yellow');
					gsap.to(
						kt.modelMesh.position,
						{
							duration: 0.5,
							y: -2
						}
					);
					gsap.to(
						ktMesh.position,
						{
							duration: 1,
							y: -2
						}
					);
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 5
						}
					);
				}

				if (
					// 물체 나오는 노란 발판과 플레이어 위치 비교 5
					Math.abs(spotMesh5.position.x - player.modelMesh.position.x) < 1.5 &&
					Math.abs(spotMesh5.position.z - player.modelMesh.position.z) < 1.5
				) {
					if (!edb.visible) {
						// 애니메이션의 루프 모드를 Repeat로 설정
						edb.actions[0].setLoop(THREE.LoopRepeat);

						// 애니메이션을 시작
						edb.actions[0].play();

						spotMesh5.material.color.set('seagreen');
						// 애니메이션 라이브러리 사용
						gsap.to(
							edb.modelMesh.position,
							{
								duration: 1,
								y: 1,
								// 라이브러리의 효과 사용
								ease: 'Bounce.easeOut'
							}
						);
						gsap.to(
							edbMesh.position,
							{
								duration: 1,
								y: 1,
								ease: 'Elastic.easeOut'
							}
						);
						// 카메라 각도 살짝 바뀜
						gsap.to(
							camera.position,
							{
								duration: 1,
								y: 3
							}
						);
					}
				} else {
					edb.visible = false;
					spotMesh3.material.color.set('yellow');
					gsap.to(
						edb.modelMesh.position,
						{
							duration: 0.5,
							y: -2
						}
					);
					gsap.to(
						edbMesh.position,
						{
							duration: 1,
							y: -2
						}
					);
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 5
						}
					);
				}


				if (
					// 물체 나오는 노란 발판과 플레이어 위치 비교 6
					Math.abs(spotMesh6.position.x - player.modelMesh.position.x) < 1.5 &&
					Math.abs(spotMesh6.position.z - player.modelMesh.position.z) < 1.5
				) {
					if (!zcon.visible) {
						// 애니메이션의 루프 모드를 Repeat로 설정
						zcon.actions[0].setLoop(THREE.LoopRepeat);

						// 애니메이션을 시작
						zcon.actions[0].play();

						spotMesh6.material.color.set('seagreen');
						// 애니메이션 라이브러리 사용
						gsap.to(
							zcon.modelMesh.position,
							{
								duration: 1,
								y: 1,
								// 라이브러리의 효과 사용
								ease: 'Bounce.easeOut'
							}
						);
						gsap.to(
							zconMesh.position,
							{
								duration: 1,
								y: 1,
								ease: 'Elastic.easeOut'
							}
						);
						// 카메라 각도 살짝 바뀜
						gsap.to(
							camera.position,
							{
								duration: 1,
								y: 3
							}
						);
					}
				} else {
					zcon.visible = false;
					spotMesh6.material.color.set('yellow');
					gsap.to(
						zcon.modelMesh.position,
						{
							duration: 0.5,
							y: -2
						}
					);
					gsap.to(
						zconMesh.position,
						{
							duration: 1,
							y: -2
						}
					);
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 5
						}
					);
				}
			} else {
				// 서 있는 상태
				player.actions[1].stop();
				player.actions[0].play();
			}
		}

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function checkIntersects() {
		// raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(meshes);
		for (const item of intersects) {
			if (item.object.name === 'floor') {
				destinationPoint.x = item.point.x;
				// 점프 안하니까 y 고정
				destinationPoint.y = 0.3;
				destinationPoint.z = item.point.z;
				// 마우스로 클릭한 목표 지점 바라보도록 설정
				player.modelMesh.lookAt(destinationPoint);

				player.moving = true;

				pointerMesh.position.x = destinationPoint.x;
				pointerMesh.position.z = destinationPoint.z;
			}
			break;
		}
	}

	function setSize() {
		camera.left = -(window.innerWidth / window.innerHeight);
		camera.right = window.innerWidth / window.innerHeight;
		camera.top = 1;
		camera.bottom = -1;

		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	// 마우스 좌표를 three.js에 맞게 변환
	function calculateMousePosition(e) {
		mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
		mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
	}

	// 변환된 마우스 좌표를 이용해 래이캐스팅
	function raycasting() {
		raycaster.setFromCamera(mouse, camera);
		checkIntersects();
	}

	// 마우스 이벤트
	canvas.addEventListener('mousedown', e => {
		isPressed = true;
		calculateMousePosition(e);
	});
	canvas.addEventListener('mouseup', () => {
		isPressed = false;
	});
	canvas.addEventListener('mousemove', e => {
		if (isPressed) {
			calculateMousePosition(e);
		}
	});

	// 터치 이벤트
	canvas.addEventListener('touchstart', e => {
		isPressed = true;
		calculateMousePosition(e.touches[0]);
	});
	canvas.addEventListener('touchend', () => {
		isPressed = false;
	});
	canvas.addEventListener('touchmove', e => {
		if (isPressed) {
			calculateMousePosition(e.touches[0]);
		}
	});

	draw();
}