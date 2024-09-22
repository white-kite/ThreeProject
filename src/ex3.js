import * as THREE from 'three';
import { createCanvas, loadImage } from 'canvas';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader}  from 'three/examples/jsm/loaders/GLTFLoader';
import { PreventDragClick } from './PreventDragClick';
import { cm1 } from './common';
import { Road } from './meshs/Road';
import { Building } from './meshs/Building';
import { Building2 } from './meshs/Building2';
import { Enemy1 } from './meshs/Enemy1';

import { HolyWater } from './meshs/HolyWater';
import { Shuriken  } from './meshs/Shuriken';


import {gsap} from 'gsap';
import { Car } from './meshs/Car';
import { World, Body, Sphere , Vec3 , Box  } from 'cannon-es';



// ----- 주제: 클릭한 Mesh 선택하기

export default function example() {
	// Renderer
    const cubeTextureLoader = new THREE.CubeTextureLoader();
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,		
		
	});
	renderer.setClearColor(0xabcdef); // 단색 배경 (예: 연한 파랑)
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
	// Scene
    const world = new World();
	world.gravity.set(0, -10, 0); // y축 방향으로 중력을 설정 (지구의 중력 가속도와 유사하게 설정)

	const noActiveWorld = new World();
	noActiveWorld.gravity.set(0, -10, 0); // y축 방향으로 중력을 설정 (지구의 중력 가속도와 유사하게 설정)



	//cm1.scene.background = new THREE.Color(0xffffff); // 흰색 배경
	// Camera
	let aspectRatio = window.innerWidth / window.innerHeight;
    const cameraHeight = 6; // 기본 단위 높이
	//const cameraHeight = 20; // 기본 단위 높이
    const camera = new THREE.OrthographicCamera(
        -cameraHeight * aspectRatio, cameraHeight * aspectRatio,
        cameraHeight, -cameraHeight,
        0, 10
    );
	
	/*
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	*/
	
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 0;
	cm1.scene.add(camera);

	//cm1.scene.fog = new THREE.FogExp2(0x000000, 1); // 색상은 검은색 (0x000000), 밀도는 0.01


	// Light
	/*
	const ambientLight = new THREE.AmbientLight('red', 20000);
	cm1.scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('red', 10000);
	directionalLight.position.x = 0;
	directionalLight.position.z = 0;
	directionalLight.position.z = 0;
	cm1.scene.add(directionalLight);
	*/
	//const controls = new OrbitControls(camera, renderer.domElement);

	
	
	
	
	




	
	const loader = new THREE.TextureLoader();
	var idleArray = [];

	//산타 애니메이션 이미지 배열
	const santaRightWalkArray = [];
	const idleRightArray = [];
	const idleLeftArray = [];
	const walkLeftArray = [];

	const santaFrontIdleArray =[];
	const santaFrontWalkArray =[];

	const santaBackIdleArray =[];
	const santaBackWalkArray =[];
	
	
	//산타 애니메이션 이미지 배열 끝

	//산타 애니메이션 프레임 수 
	const frameCount = 4; 
	const idleRightCount = 4;
	const idleLeftCount = 4;
	const walkLeftCount = 4;

	const santaFrontIdleCount = 4;
	const santaFrontWalkCount = 4;

	const santaBackIdleCount = 4;
	const santaBackWalkCount = 4;
	//산타 애니메이션 프레임 수 끝


	for (let i = 0; i < frameCount; i++) {
		
		const texture = loader.load(`/models/kenney/character/santaRightWalk${i}.png`);
		santaRightWalkArray.push(texture);
	}
	
	for (let i = 0; i < idleRightCount; i++) {
		
		const texture = loader.load(`/models/kenney/character/idle${i}.png`);
		idleRightArray.push(texture);
	}

	for (let i = 0; i < idleLeftCount; i++) {	
		const texture = loader.load(`/models/kenney/character/idleLeft${i}.png`);
		idleLeftArray.push(texture);
	}

	for (let i = 0; i < walkLeftCount; i++) {	
		const texture = loader.load(`/models/kenney/character/walkLeft${i}.png`);
		walkLeftArray.push(texture);
	}


	for (let i = 0; i < santaFrontIdleCount; i++) {	
		const texture = loader.load(`/models/kenney/character/santaFrontIdle${i}.png`);
		santaFrontIdleArray.push(texture);
	}
	for (let i = 0; i < santaFrontWalkCount; i++) {	
		const texture = loader.load(`/models/kenney/character/santaFrontWalk${i}.png`);
		santaFrontWalkArray.push(texture);
	}
	for (let i = 0; i < santaBackIdleCount; i++) {	
		const texture = loader.load(`/models/kenney/character/santaBackIdle${i}.png`);
		santaBackIdleArray.push(texture);
	}
	for (let i = 0; i < santaBackWalkCount; i++) {	
		const texture = loader.load(`/models/kenney/character/santaBackWalk${i}.png`);
		santaBackWalkArray.push(texture);
	}
	
	
	
	idleArray = idleRightArray;


	const tileArray = [];
	


	for (let i = 1; i <= 63; i++) {
		// 숫자를 세 자리 문자열로 변환
		let str = i.toString().padStart(3, '0');
		const tile = loader.load(`/models/kenney/road/tile${str}.png`);
		tileArray.push(tile);
	}


	const spriteMaterial2 = new THREE.SpriteMaterial({ map: tileArray[1] }); // 첫 번째 프레임으로 초기화
	
	
	const sprite2 = new THREE.Sprite(spriteMaterial2);
	sprite2.scale.set(32, 32, 0); 
	
	//cm1.scene.add(sprite2);

	function getRandomInt() {
		return Math.floor(Math.random() * 30); // 0부터 63까지의 난수 생성
	}
		
	// 반복해서 배치할 스프라이트 생성
	const numSpritesX = 15; // x 축으로 필요한 스프라이트 개수
	const numSpritesY = 15; // y 축으로 필요한 스프라이트 개수
	const spacingX = 1;     // x 축 스프라이트 간의 간격
	const spacingY = 1;     // y 축 스프라이트 간의 간격

	for(var i = -numSpritesX ; i < numSpritesX ; i++){
		for(var j = -numSpritesY ; j < numSpritesY ; j++){
			var sp = sprite2.clone();
			sp.position.z = -3;
			const newMaterial = new THREE.SpriteMaterial({ map: tileArray[getRandomInt()] }); // 변경할 SpriteMaterial 생성
			newMaterial.map = tileArray[getRandomInt()]
			sp.material = newMaterial;
		}		
	}
	
	let sprites = []; // 스프라이트를 담을 배열
	const back1 = new THREE.Object3D();
	const back2 = new THREE.Object3D();
	const back3 = new THREE.Object3D();
	const back4 = new THREE.Object3D();

	back1.position.set(0, 0, 0);
	for (let i = -numSpritesX; i < numSpritesX; i++) {
        for (let j = -numSpritesY; j < numSpritesY; j++) {
			for(let k = 0 ; k < 4 ; k++){				
				var sp = sprite2.clone();
				const newMaterial = new THREE.SpriteMaterial({ map: tileArray[getRandomInt()] }); // 변경할 SpriteMaterial 생성
				newMaterial.map = tileArray[getRandomInt()]
				sp.material = newMaterial;

				// 스프라이트 위치 설정 (x, y 축 반복해서 배치)
				sp.position.set(i * spacingX, j * spacingY, 0);
				sp.scale.set(1,1,0);
				// 스프라이트 크기 조절
				

				// 스프라이트를 scene에 추가
				//cm1.scene.add(sp);
				if(k==0){
					back1.add(sp);
				}else if(k == 1){
					back2.add(sp);
				}else if(k == 2){
					back3.add(sp);
				}else if(k == 3){
					back4.add(sp);
				}
				
				// 스프라이트를 배열에 저장
				//sprites.push(sp);
			}
        }
    }
	back1.position.set(0, 0, -1);
	back2.position.set(30, 0, -1);
	back3.position.set(0, 30, -1);
	back4.position.set(30, 30, -1);
	cm1.scene.add(back1, back2 , back3 , back4);

	const spriteMaterial = new THREE.SpriteMaterial({ map: santaRightWalkArray[0] }); // 첫 번째 프레임으로 초기화

	const sprite = new THREE.Sprite(spriteMaterial);
	
	
	sprite.material.side = THREE.DoubleSide;
	sprite.scale.set(1, 1, 1); // 스프라이트 크기 조정
	sprite.rotation.z = -Math.PI; // z 축을 기준으로 180도 반대 방향 회전 (라디안 값)
	
	/*사탕 발사 start*/
	const weapon1Image = loader.load(`/models/kenney/item/weapon/weapon1.png`);
	const spriteMaterialWeapon1 = new THREE.SpriteMaterial({ map: weapon1Image }); // 첫 번째 프레임으로 초기화
	const Weapon1sprite = new THREE.Sprite(spriteMaterialWeapon1);
	camera.add(Weapon1sprite);
	
	const weapon1sphereShape = new Sphere(0.5); // Radius 1
	const weapon1sphereBody = new Body({ mass: 1000, position: new Vec3(50, 0, 0) });
	weapon1sphereBody.name="사탕";
	//weapon1sphereBody.addShape(weapon1sphereShape); --주석해제 필요
	world.addBody(weapon1sphereBody);
	/*사탕 발사 start */

	//HP
	const panelGeometry2 = new THREE.PlaneGeometry(1, 0.1);
    const panelMaterial2 = new THREE.MeshBasicMaterial({ color: 'black' }); // 녹색 패널
    const panel2 = new THREE.Mesh(panelGeometry2, panelMaterial2);
	panel2.position.set(0,0.7,0);

	// HP 게이지 전경 (초기 HP 100%)
	const hpGeometry = new THREE.PlaneGeometry(1, 0.1);
	const hpMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const hpMesh = new THREE.Mesh(hpGeometry, hpMaterial);	
	hpMesh.position.set(0,0.7,0);
	
	sprite.add(hpMesh,panel2);

	
    // 패널을 장면에 추가
    //cm1.scene.add(panel);
	
	//HP끝


	var cameraTarget = new THREE.Vector3();
    cameraTarget.copy(sprite.position);  // 초기에는 캐릭터의 위치로 설정

	
	//state 정의
	var ArrowRight = false;
	var ArrowLeft = false;
	var ArrowUp = false;
	var ArrowDown = false;
	var idleState = true;
	//state 정의 끝
	
	// 그리기
	const clock = new THREE.Clock();

	let currentFrame = 0;
	let lastFrameTime = 0;
	const frameDuration = 0.2; // 각 프레임 간 시간 간격 (초)


	///////////////

	const geometry = new THREE.SphereGeometry(10, 32, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const sphereMesh = new THREE.Mesh(geometry, material);
	
	cm1.scene.add(sphereMesh);

	//산타 물리 엔진
	const santaShape = new Sphere(0.1); // Radius 1
	const santaBody = new Body({ mass: 1000, position: new Vec3(5000, 0, -1) });
	santaBody.name="산타";
	santaBody.addShape(santaShape);
	world.addBody(santaBody);
	//산타 물리 엔진



	const geometry2 = new THREE.SphereGeometry(10, 32, 32);
	const material2 = new THREE.MeshBasicMaterial({ color: 0x000000  });
	const sphereMesh2 = new THREE.Mesh(geometry2, material2);
	
	cm1.scene.add(sphereMesh2);
	/*
	const sphereShape2 = new Sphere(10); // Radius 1
	const sphereBody2 = new Body({ mass: 1000, position: new Vec3(50, 0, -1) });
	sphereBody2.addShape(sphereShape2);
	world.addBody(sphereBody2);
	*/
	
	var enemy1 = new Enemy1({three:THREE , attakFunc : updateHP , world:world , hp: 10 , camera: camera});
	
	var holyWater = new HolyWater({three:THREE , world2:world , noActiveWorld : noActiveWorld});
	var shuriken = new Shuriken({three:THREE , world2:world , noActiveWorld : noActiveWorld , target: sprite, damage: 1});		
	shuriken.objectVisible(true, 1);
	
	shuriken.objectVisible(true, 2);
	shuriken.objectVisible(true, 3);
	shuriken.objectVisible(true, 4);
	//innerSanta.add();
	//innerSanta.add(shuriken.sprite , shuriken.sprite1 , shuriken.sprite2 , shuriken.sprite3);

	cm1.scene.add(sprite);
	//충돌 애니메이션
	world.addEventListener('beginContact', (event) => {		
			const { bodyA, bodyB } = event;			
			if(bodyA.name == "enemy" ){
				if(bodyB.name == "holyWater"){
					//bodyA.object.HitMe(10);
					//console.log("1. bodyA : " + bodyA.name + " bodyB: " + bodyB.name);
					//bodyA.sprite.visible = false;
				}else if(bodyB.name == "사탕"){
					//bodyA.object.HitMe(10);
					//console.log("2. bodyA : " + bodyA.name + " bodyB: " + bodyB.name);
					//bodyA.sprite.visible = false;
				}				
			}
			if(bodyB.name == "enemy" ){
				if(bodyA.name == "holyWater"){
					//bodyB.object.HitMe(10);
					
					//console.log("3. bodyA : " + bodyA.name + " bodyB: " + bodyB.name);
					//bodyB.sprite.visible = false;
				}else if(bodyA.name == "사탕"){
					//bodyB.object.HitMe(10);
					
					//console.log("4. bodyA : " + bodyA.name + " bodyB: " + bodyB.name);
					//bodyB.sprite.visible = false;
				}
				
			}

			if(bodyA.name == "산타" ){				
				if(bodyB.name == "선물"){					
					
					//console.log("5. bodyA : " + bodyA.name + " bodyB: " + bodyB.name);
					//bodyB.sprite.visible = false;
				}
			}
			if(bodyB.name == "산타" ){				
				if(bodyA.name == "선물"){					
					
					//console.log("6. bodyA : " + bodyA.name + " bodyB: " + bodyB.name);
					//bodyA.sprite.visible = false;
				}
			}
			
			
	  });

	//////////////////////
	
	setInterval(function(){
		holyWater.fireInTheHole(sprite);
	}, 2000);
	let velocity = new THREE.Vector3(0.2, 0.1, 0);
	const wallThickness = 1;
	const wallMaterial = new THREE.MeshBasicMaterial({ color: "red" });

	const wallTop = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 0), wallMaterial);
	wallTop.position.y = 6.5;
	camera.add(wallTop);
	

	const wallBottom = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 0), wallMaterial);
	wallBottom.position.y = -6.5;
	camera.add(wallBottom);

	const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 0), wallMaterial);
	wallLeft.position.x = -14.5;
	camera.add(wallLeft);

	const wallRight = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 0), wallMaterial);
	wallRight.position.x = 14.5;
	camera.add(wallRight);

	function updateWallPositions() {
		const aspect = window.innerWidth / window.innerHeight;
		const frustumHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
		const frustumWidth = frustumHeight * aspect;

		wallTop.position.set(camera.position.x, frustumHeight / 2 - wallThickness / 2, 0);
		wallBottom.position.set(camera.position.x, -frustumHeight / 2 + wallThickness / 2, 0);
		wallLeft.position.set(camera.position.x - frustumWidth / 2 + wallThickness / 2, 0, 0);
		wallRight.position.set(camera.position.x + frustumWidth / 2 - wallThickness / 2, 0, 0);
	}
	function draw(time) {			
		updateBackgroundPosition(sprite);
		//산타물리		
		santaBody.position.copy(sprite.position);		

		weapon1sphereBody.position.copy(Weapon1sprite.position);
		

		Weapon1sprite.position.add(velocity);	
		if (Weapon1sprite.position.y >= wallTop.position.y || Weapon1sprite.position.y <= wallBottom.position.y) {
			velocity.y = -velocity.y;
		}
		if (Weapon1sprite.position.x >= wallRight.position.x || Weapon1sprite.position.x <= wallLeft.position.x) {
			velocity.x = -velocity.x;
		}

		const delta = clock.getDelta();
		

		world.step(1 / 120 , delta , 10);
		noActiveWorld.step(1 / 120 , delta , 10);
		
		
		// Update three.js sphere position based on cannon.js simulation
		//sphereMesh.position.copy(sphereBody.position);
		//sphereMesh.quaternion.copy(sphereBody.quaternion);
		//sphereBody.position.copy(sprite.position);


		//sphereBody.quaternion.copy(sprite.position);

		/*
		sphereMesh2.position.copy(sphereBody2.position);
		sphereMesh2.quaternion.copy(sphereBody2.quaternion);
		sphereBody2.position.set(0,1,0);
		*/

		//sprite.position.x += 0.01; // Move sprite horizontally
   	 //sprite.position.y += 0.005; // Move sprite vertically
		
		
		
		
		
		if (time - lastFrameTime > frameDuration * 500) {
			currentFrame = (currentFrame + 1) % frameCount; // 다음 프레임 인덱스 계산

			enemy1.Animation(currentFrame , sprite , delta);
			//particle1.Animation(currentFrame , sprite , delta);
			holyWater.Animation(currentFrame , sprite , delta);
			if(idleState == true){
				sprite.material.map = idleArray[currentFrame];
			}else{
				
				if(ArrowRight == true){
					sprite.material.map = santaRightWalkArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
					idleArray = idleRightArray;
				}
				if(ArrowLeft == true){
					sprite.material.map = walkLeftArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
					idleArray = idleLeftArray;
				}


				if(ArrowUp == true){
					
					sprite.material.map = santaBackWalkArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
					idleArray = santaBackIdleArray;
				}
				if(ArrowDown == true){
					sprite.material.map = santaFrontWalkArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
					idleArray = santaFrontIdleArray;
				}
				
			}
			

			
			lastFrameTime = time;
		}
		if(ArrowRight == true){
			sprite.position.x += 0.1;
		}

		if(ArrowLeft == true){
			sprite.position.x -= 0.1;
		}

		if(ArrowUp == true){
			sprite.position.y += 0.1;
		}

		if(ArrowDown == true){
			sprite.position.y -= 0.1;
		}

		

		
		const lerpFactor = 0.1;  // lerp 계수 (0에 가까울수록 부드러움)
		cameraTarget.lerp(sprite.position, lerpFactor);
		camera.position.copy(cameraTarget);
		//camera.position.z = 0.001;
		

		shuriken.Animation(time);

		renderer.render(cm1.scene, camera);
		renderer.setAnimationLoop(draw);
	}



	function updateBackgroundPosition(character) {
		const charX = character.position.x;
		const charY = character.position.y;
	
		const tileSize = 30;
	
		// 오른쪽 이동 시 왼쪽 타일을 오른쪽으로 이동
		if (charX - back1.position.x > tileSize) {
			back1.position.x += tileSize * 2;
		}
		if (charX - back3.position.x > tileSize) {
			back3.position.x += tileSize * 2;
		}
		if (charX - back2.position.x > tileSize) {
			back2.position.x += tileSize * 2;
		}
		if (charX - back4.position.x > tileSize) {
			back4.position.x += tileSize * 2;
		}
	
		// 왼쪽 이동 시 오른쪽 타일을 왼쪽으로 이동
		if (back1.position.x - charX > tileSize) {
			back1.position.x -= tileSize * 2;
		}
		if (back3.position.x - charX > tileSize) {
			back3.position.x -= tileSize * 2;
		}
		if (back2.position.x - charX > tileSize) {
			back2.position.x -= tileSize * 2;
		}
		if (back4.position.x - charX > tileSize) {
			back4.position.x -= tileSize * 2;
		}
	
		// 위로 이동 시 아래 타일을 위로 이동
		if (charY - back1.position.y > tileSize) {
			back1.position.y += tileSize * 2;
		}
		if (charY - back2.position.y > tileSize) {
			back2.position.y += tileSize * 2;
		}
		if (charY - back3.position.y > tileSize) {
			back3.position.y += tileSize * 2;
		}
		if (charY - back4.position.y > tileSize) {
			back4.position.y += tileSize * 2;
		}
	
		// 아래로 이동 시 위 타일을 아래로 이동
		if (back1.position.y - charY > tileSize) {
			back1.position.y -= tileSize * 2;
		}
		if (back2.position.y - charY > tileSize) {
			back2.position.y -= tileSize * 2;
		}
		if (back3.position.y - charY > tileSize) {
			back3.position.y -= tileSize * 2;
		}
		if (back4.position.y - charY > tileSize) {
			back4.position.y -= tileSize * 2;
		}
	}
	

	document.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowRight') {
			ArrowRight = true;
			idleState = false; 
		}

		if (event.key === 'ArrowLeft') {						
			ArrowLeft = true;
			idleState = false; 
		}

		if (event.key === 'ArrowUp') {						
			
			ArrowUp = true;
			idleState = false; 
		}

		if (event.key === 'ArrowDown') {									
			ArrowDown = true;
			idleState = false; 
		}
		if (event.key === 'k') {
			
		}

	

	});
	document.addEventListener('keyup', (event) => {
		if (event.key === 'ArrowRight') {			
			ArrowRight = false;
			idleState = true;
			
		}
		if (event.key === 'ArrowLeft') {								
			ArrowLeft = false;
			idleState = true;
		}

		if (event.key === 'ArrowUp') {						
			ArrowUp = false;
			idleState = true;
		}

		if (event.key === 'ArrowDown') {						
			ArrowDown = false;
			idleState = true;
		}
	});

	

	// HP 게이지 업데이트 함수
	function updateHP(hp) {
		// hp는 0과 1 사이의 값이어야 합니다.
		const width = 1 * hp;
		hpMesh.scale.x = hp;
		hpMesh.position.x = (1 - width) / 2; // 중심에서 오른쪽으로 이동하도록 위치를 업데이트
	}

	function setSize() {
		
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(cm1.scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);
	
	draw();
}

