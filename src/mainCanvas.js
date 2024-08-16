import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { World, Body, Sphere , Vec3 , Box  } from 'cannon-es';

// ----- 주제: 클릭한 Mesh 선택하기

export default function example2() {

	const world = new World();
	world.gravity.set(0, 0, 0); // y축 방향으로 중력을 설정 (지구의 중력 가속도와 유사하게 설정)

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


    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
	renderer.setClearColor(0x87CEEB, 1); // 파란 하늘색
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene();

    
	let aspectRatio = window.innerWidth / window.innerHeight;
    const cameraHeight = 6; // 기본 단위 높이
    const camera = new THREE.OrthographicCamera(
        -cameraHeight * aspectRatio, cameraHeight * aspectRatio,
        cameraHeight, -cameraHeight,
        0, 10
    );


    camera.position.set(0, 0, 3);

	
	const backgroundImage = loader.load(`/models/kenney/background/lobby-2.png`);
	const backgroundMaterial = new THREE.SpriteMaterial({ map: backgroundImage }); 
	// 스프라이트 생성
	const backgroundSprite = new THREE.Sprite(backgroundMaterial);
	backgroundSprite.material.side = THREE.DoubleSide;
	backgroundSprite.scale.set(28, 13, 1);
	backgroundSprite.position.set(0, 0, -1);



	const spriteMaterial = new THREE.SpriteMaterial({ map: santaRightWalkArray[0] }); // 첫 번째 프레임으로 초기화

	const sprite = new THREE.Sprite(spriteMaterial);	
	sprite.material.side = THREE.DoubleSide;
	sprite.scale.set(2, 2, 2); // 스프라이트 크기 조정
	sprite.position.set(0, -3, 1);

	const santaSphereShape = new Sphere(0.5); // Radius 1
	const santaSphereBody = new Body({ mass: 1000, position: new Vec3(50, 0, 0) });
	santaSphereBody.name="산타";
	santaSphereBody.addShape(santaSphereShape);
	world.addBody(santaSphereBody);


	const doorSphereShape = new Sphere(2); // Radius 1
	const doorSphereBody = new Body({ mass: 1000, position: new Vec3(10, -3, 0) });
	doorSphereBody.name="문";
	doorSphereBody.addShape(doorSphereShape);
	world.addBody(doorSphereBody);

	const doorOutSphereShape = new Sphere(2); // Radius 1
	const doorOutSphereBody = new Body({ mass: 1000, position: new Vec3(5, -3, 0) });
	doorOutSphereBody.name="집";
	doorOutSphereBody.addShape(doorOutSphereShape);
	world.addBody(doorOutSphereBody);

	
	//모닥불
	const fireArray = [];
	for (let i = 1; i <= 5; i++) {		
		const fireImage = loader.load(`/models/kenney/effect/fire/fire${i}.png`);
		fireArray.push(fireImage);
	}	
	const fireMaterial = new THREE.SpriteMaterial({ map: fireArray[0] }); 
	const fireSprite = new THREE.Sprite(fireMaterial);
	fireSprite.material.side = THREE.DoubleSide;
	fireSprite.scale.set(4, 2, 1);
	fireSprite.position.set(-4.4, -2.2, 0);
	//모닥불


	//테이블 추가
	const tableImage = loader.load(`/models/kenney/background/table.gif`);
	const tableMaterial = new THREE.SpriteMaterial({ map: tableImage }); 
	// 스프라이트 생성
	const tableSprite = new THREE.Sprite(tableMaterial);
	tableSprite.material.side = THREE.DoubleSide;
	tableSprite.scale.set(4, 2, 1);
	tableSprite.position.set(3, -3.5, 1);
	//테이블



	// 씬에 추가
	scene.add(backgroundSprite, sprite , fireSprite , tableSprite );

	

	
	
    scene.add(camera);

    

	
	
    //scene.add(cube); // 큐브를 장면에 추가

  

	// 그리기
	const clock = new THREE.Clock();

	let currentFrame = 0;
	let lastFrameTime = 0;
	const frameDuration = 0.2; // 각 프레임 간 시간 간격 (초)

	//state 정의
	var ArrowRight = false;
	var ArrowLeft = false;
	var ArrowUp = false;
	var ArrowDown = false;
	var idleState = true;
	//state 정의 끝
	var isDoorContact = false;
	const btnContainer = document.querySelector('.btn-container');
	//충돌 애니메이션		
	santaSphereBody.addEventListener('collide', (event) => {
		if(event.body.name == "문"){
			console.log("문")
			isDoorContact = true;			
		}else if(event.body.name == "집"){
			isDoorContact = false;			
			console.log("집")
		}
		
	});
	  
	const warehouseBtn = document.getElementById('warehouseBtn');

	warehouseBtn.addEventListener('click', function() {		
		location.href = "/warehouse.html";
	});

	const adventureBtn = document.getElementById('adventureBtn');

	adventureBtn.addEventListener('click', function() {		
		location.href = "/main.html";
	});

	


    function draw(time) {
		
		if(isDoorContact == true){
			if (btnContainer.classList.contains('hide')) {
				btnContainer.classList.remove('hide');
			}
		}else{			
			if (btnContainer.classList.contains('hide') == false) {
				btnContainer.classList.add('hide');
			}			
		}
		//isDoorContact = false;

		santaSphereBody.position.copy(sprite.position);
		
		doorSphereBody.position.set(9.5,-3,0);
		doorOutSphereBody.position.set(5,-3,0);

		const deltaTime = clock.getDelta();
		world.step(1 / 120 , deltaTime , 10);
		if (time - lastFrameTime > frameDuration * 500) {
			currentFrame = (currentFrame + 1) % frameCount; // 다음 프레임 인덱스 계산
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
		fireSprite.material.map = fireArray[currentFrame];

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

		
		
		
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
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
	});

    // Resize event
    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', setSize);

    draw();
}
