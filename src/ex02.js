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

    // Camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraHeight = 2; // Orthographic 카메라의 기본 단위 높이
    const camera = new THREE.OrthographicCamera(
        -cameraHeight * aspectRatio, cameraHeight * aspectRatio, 
        cameraHeight, -cameraHeight, 0, 10
    );

    camera.position.set(0, 0, 1);

    const loader = new THREE.TextureLoader();
    loader.load('/models/kenney/background/Background.png', function (texture) {
        // 텍스처 필터링 설정
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        // 색상 조정을 위한 재질 생성
        const backgroundMaterial = new THREE.SpriteMaterial({
            map: texture,
            color: new THREE.Color(0xd8d8d8) // 어두운 회색으로 색상 조정
        });

        // 스프라이트 생성
        const backgroundSprite = new THREE.Sprite(backgroundMaterial);
        backgroundSprite.material.side = THREE.DoubleSide;
        
        // 스프라이트 크기를 캔버스 크기에 맞추기
        const canvasAspectRatio = window.innerWidth / window.innerHeight;
        const imageAspectRatio = texture.image.width / texture.image.height;

        let spriteWidth, spriteHeight;

        if (canvasAspectRatio > imageAspectRatio) {
            // 캔버스의 가로비가 더 클 경우
            spriteWidth = 2 * cameraHeight * canvasAspectRatio;
            spriteHeight = spriteWidth / imageAspectRatio;
        } else {
            // 캔버스의 세로비가 더 클 경우
            spriteHeight = 2 * cameraHeight;
            spriteWidth = spriteHeight * imageAspectRatio;
        }

        backgroundSprite.scale.set(spriteWidth, spriteHeight, 1);

        backgroundSprite.position.set(0, 0, 0); // 스프라이트 위치 조정

        // 씬에 추가
        scene.add(backgroundSprite);
    });

    scene.add(camera);

    // Animation
    const clock = new THREE.Clock();

    function draw() {
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    // Resize event
    function setSize() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        camera.left = -cameraHeight * aspectRatio;
        camera.right = cameraHeight * aspectRatio;
        camera.top = cameraHeight;
        camera.bottom = -cameraHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', setSize);

    draw();
}
