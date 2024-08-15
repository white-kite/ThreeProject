import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 클릭한 Mesh 선택하기

export default function example2() {
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

    
	const camera = new THREE.OrthographicCamera(-window.innerWidth / 100, window.innerWidth / 100, window.innerHeight / 100, -window.innerHeight / 100, 0, 10);


    camera.position.set(0, 0, 0);

	
	

	const loader = new THREE.TextureLoader();
	loader.load('/models/kenney/background/Background.png', function (texture) {
		// 텍스처 필터링 설정
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		// 색상 조정을 위한 재질 생성
		const backgroundMaterial = new THREE.SpriteMaterial({
			map: texture,
			color: new THREE.Color(0xd8d8d8) // 어두운 회색으로 색상 조정 (더 어두운 색상으로 조정 가능)
		});
	
		// 스프라이트 생성
		const backgroundSprite = new THREE.Sprite(backgroundMaterial);
		backgroundSprite.material.side = THREE.DoubleSide;
		backgroundSprite.scale.set(30, 25, 1);
		backgroundSprite.position.set(0, -1, 0);
	
		// 씬에 추가
		scene.add(backgroundSprite);
	});

	
	
    scene.add(camera);

    

	
	
    //scene.add(cube); // 큐브를 장면에 추가

    // Animation
    const clock = new THREE.Clock();
	let timeAccumulator = 0;
	const frameDuration = 0.3; // 프레임당 지속 시간 (초)
	let currentFrame = 0;
	const numFrames = 3; // 프레임 수
	

    function draw() {
        

		const deltaTime = clock.getDelta();

		// Update sprite animation based on deltaTime
		timeAccumulator += deltaTime;
		if (timeAccumulator >= frameDuration) {
			currentFrame = (currentFrame + 1) % numFrames;
			//sprite.material.map = textures[currentFrame];
			//console.log(currentFrame);

			if(currentFrame == 1){				
				//startBtn.classList.add('btn-success');
			}else if(currentFrame == 2){
				//startBtn.classList.remove('btn-success');				
			}
			//document.documentElement.style.setProperty('--button-width', '200px');

			timeAccumulator -= frameDuration;
		}
		
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    // Resize event
    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', setSize);

    draw();
}
