import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Player } from './Player';
import { House } from './House';
import gsap from 'gsap';
import { ImagePanel } from './ImagePanel';

// 사업실적 - 고객 레퍼런스
// 2024-02-07 이하진, 최초 작성
// 2024-02-19 백재원, merge

export default function CustRefCanvas() {

    // Texture
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('/images/custRef/grid.png');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.x = 10;
    floorTexture.repeat.y = 10;

    //버튼
    const btnWrapper = document.createElement('div');
    btnWrapper.classList.add('btns');

    const publicCompanyBtn = document.createElement('button');
    publicCompanyBtn.dataset.type = 'public';
    publicCompanyBtn.style.cssText = 'position: absolute; left: 40%; top: 70%; transform: translate(-50%, -50%); background-color: #2c3e50; color: #ecf0f1; border: 1px solid #ecf0f1; padding: 10px 20px; font-size: 16px; font-family: "Arial", sans-serif; cursor: pointer;';
    publicCompanyBtn.innerHTML = '공공기관';
    btnWrapper.append(publicCompanyBtn);

    const privatecompanyBtn = document.createElement('button');
    privatecompanyBtn.dataset.type = 'private';
    privatecompanyBtn.style.cssText = 'position: absolute; left: 60%; top: 70%; transform: translate(-50%, -50%); background-color: #3498db; color: #ecf0f1; border: 1px solid #ecf0f1; padding: 10px 20px; font-size: 16px; font-family: "Arial", sans-serif; cursor: pointer;';
    privatecompanyBtn.innerHTML = '일반기업';


    // Renderer
    const canvas = document.querySelector('#CustRefCanvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.OrthographicCamera(
        -(window.innerWidth / window.innerHeight), // left
        window.innerWidth / window.innerHeight, // right,
        1, // top
        -1, // bottom
        -1000,
        1000
    );

    const cameraPosition = new THREE.Vector3(1, 5, 5);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
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
    floorMesh.rotation.x = -Math.PI / 2;
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
    pointerMesh.rotation.x = -Math.PI / 2;
    pointerMesh.position.y = 0.01;
    pointerMesh.receiveShadow = true;
    scene.add(pointerMesh);


    // CanvasTexture
    const texCanvas = document.createElement('canvas');
    const texContext = texCanvas.getContext('2d'); // Canvas에 그림을 그릴때 사용
    texCanvas.width = 100;
    texCanvas.height = 100;
    const canvasTexture = new THREE.CanvasTexture(texCanvas); // Canvas가 적용된 Texture가 만들어짐

    const spotMesh3 = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        new THREE.MeshStandardMaterial({
            color: 'yellow',
            transparent: true,
            opacity: 0.5,
            map: canvasTexture
        })
    );
    spotMesh3.position.set(7, 0.005, 5);
    spotMesh3.rotation.x = -Math.PI / 2;
    spotMesh3.receiveShadow = true;
    scene.add(spotMesh3);


    const gltfLoader = new GLTFLoader();

    const house3 = new House({
        gltfLoader,
        scene,
        modelSrc: '/models/house.glb',
        x: 7,
        y: -1.3,
        z: 2
    });

    const player = new Player({
        scene,
        meshes,
        gltfLoader,
        modelSrc: '/models/ilbuni.glb'
    });

    

    const raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let destinationPoint = new THREE.Vector3();
    let angle = 0;
    let isPressed = false; // 마우스를 누르고 있는 상태


    // Mesh
    const planeGeometry = new THREE.PlaneGeometry(4, 1);
    // 레퍼런스 공공기관 
    const publicCompanyimagePanels = [];
    let publicCompany;
    for (let i = 0; i < 32; i++) {
        publicCompany = new ImagePanel({
            textureLoader,
            scene,
            geometry: planeGeometry,
            imageSrc: `/images/custRef/${i + 1}.png`,
            x: 15,
            y: 0.005,
            z: 2
        });
        publicCompany.mesh.visible = false;
        publicCompanyimagePanels.push(publicCompany);
    }

    // 레퍼런스 일반기업
    const privateCompanyimagePanels = [];
    let privateCompany;
    for (let i = 0; i < 33; i++) {
        privateCompany = new ImagePanel({
            textureLoader,
            scene,
            geometry: planeGeometry,
            imageSrc: `/images/custRef/p${i + 1}.png`,
            x: 15,
            y: 0.005,
            z: 2
        });
        privateCompany.mesh.visible = false;
        privateCompanyimagePanels.push(privateCompany);
    }

    // 그리기
    const clock = new THREE.Clock();
    let array;
    function draw() {
        const delta = clock.getDelta();

        texContext.fillRect(0, 0, 100, 100); // 이거 매테리얼보다 크기 줄이면 덜 그려지게 됨
        texContext.fillStyle = 'white';  // 하얀색으로 설정
        texContext.font = 'bold 14px sans-serif';
        texContext.fillText('고객레퍼런스', 10, 50);

        if (player.mixer) player.mixer.update(delta);

        if (player.modelMesh) {
            camera.lookAt(player.modelMesh.position);
        }

        if (player.modelMesh) {
            

            if (isPressed) {
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

                player.actions[0].stop();
                player.actions[1].play();

                if (
                    Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
                    Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
                ) {
                    player.moving = false;
                }

                // 고객 레퍼런스
                if (
                    Math.abs(spotMesh3.position.x - player.modelMesh.position.x) < 1.5 &&
                    Math.abs(spotMesh3.position.z - player.modelMesh.position.z) < 1.5
                ) {
                    if (!house3.visible) {
                        house3.visible = true;
                        spotMesh3.material.color.set('seagreen');
                        gsap.to(
                            house3.modelMesh.position,
                            {
                                duration: 1,
                                y: 1,
                                ease: 'Bounce.easeOut'
                            }
                        );
                        btnWrapper.append(privatecompanyBtn);
                        document.body.append(btnWrapper);
                        gsap.to(
                            camera.position,
                            {
                                duration: 1,
                                y: 2

                            }
                        );
                    }
                } else if (house3.visible) {
                    privatecompanyBtn.style.backgroundColor = "#3498db";
                    publicCompanyBtn.style.backgroundColor = "#3498db";

                    privatecompanyBtn.remove();
                    btnWrapper.remove();

                    house3.visible = false;
                    spotMesh3.material.color.set('yellow');
                    gsap.to(
                        house3.modelMesh.position,
                        {
                            duration: 0.5,
                            y: -1.3
                        }
                    );
                    for (let i = 0; i < publicCompanyimagePanels.length; i++) {

                        // 위치 이동
                        gsap.to(
                            publicCompanyimagePanels[i].mesh.position,
                            {
                                duration: 1,
                                x: 15,
                                y: 1,
                                z: 2
                            }
                        );

                        // mesh의 y축을 중심으로 180도 회전
                        gsap.to(publicCompanyimagePanels[i].mesh.rotation, {
                            duration: 1,
                            y: Math.PI // y 축을 중심으로 180도 회전
                        });

                        publicCompanyimagePanels[i].mesh.visible = false;
                    }
                    for (let i = 0; i < privateCompanyimagePanels.length; i++) {
                        // 위치 이동
                        gsap.to(
                            privateCompanyimagePanels[i].mesh.position,
                            {
                                duration: 1,
                                x: 15,
                                y: 1,
                                z: 2
                            }
                        );
                        privateCompanyimagePanels[i].mesh.visible = false;
                        privateCompanyimagePanels[i].mesh.lookAt(camera.position);
                    }

                    gsap.to(
                        camera.position,
                        {
                            duration: 1,
                            y: 5
                        }
                    );
                }
            }

            else {
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
                destinationPoint.y = 0.3;
                destinationPoint.z = item.point.z;
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

    // 상태 변수 추가
    let activeCompanyType = null;

    function resetCompanyState() {
        // 버튼의 배경색을 초기 상태로 리셋
        publicCompanyBtn.style.backgroundColor = "#3498db"; // 예시 색상, 실제 프로젝트에 맞게 조정 필요
        privatecompanyBtn.style.backgroundColor = "#3498db"; // 예시 색상, 실제 프로젝트에 맞게 조정 필요

        // 모든 공공기관 이미지 패널 숨기기
        for (let i = 0; i < publicCompanyimagePanels.length; i++) {
            publicCompanyimagePanels[i].mesh.visible = false;
        }

        // 모든 일반기업 이미지 패널 숨기기
        for (let i = 0; i < privateCompanyimagePanels.length; i++) {
            privateCompanyimagePanels[i].mesh.visible = false;
        }

    }

    // 공공기관, 일반기업 선택
    function setCompany(e) {
        const type = e.target.dataset.type;
        console.log(type);
        // 버튼이 이미 활성화되어 있고, 같은 버튼을 다시 클릭한 경우 초기 상태로 돌아감
        if (activeCompanyType === type) {
            resetCompanyState();
            activeCompanyType = null;
        } else {
            activeCompanyType = type; // 활성화된 버튼 타입 업데이트
            switch (type) {
                case "public":
                    publicCompanyBtn.style.backgroundColor = "#2c3e50";
                    privatecompanyBtn.style.backgroundColor = "#3498db";
                    for (let i = 0; i < publicCompanyimagePanels.length; i++) {
                        let row = (Math.floor(i / 5)) * 3;
                        let column = i % 5;

                        // 위치 이동
                        publicCompanyimagePanels[i].mesh.visible = true;
                        gsap.to(
                            publicCompanyimagePanels[i].mesh.position,
                            {
                                duration: 1,
                                x: (column * 4),
                                y: 3,
                                z: row
                            }
                        );
                        publicCompanyimagePanels[i].mesh.rotation.y = 2*Math.PI;
                        publicCompanyimagePanels[i].mesh.rotation.z = 2*Math.PI;
                        //publicCompanyimagePanels[i].mesh.lookAt(camera.position);
                    }
                    for (let i = 0; i < privateCompanyimagePanels.length; i++) {
                        // 위치 이동
                        gsap.to(
                            privateCompanyimagePanels[i].mesh.position,
                            {
                                duration: 1,
                                x: 15,
                                y: 1,
                                z: 2
                            }
                        );
                        privateCompanyimagePanels[i].mesh.visible = false;
                        privateCompanyimagePanels[i].mesh.rotation.y = 2*Math.PI;
                        privateCompanyimagePanels[i].mesh.rotation.z = 2*Math.PI;
                        //privateCompanyimagePanels[i].mesh.lookAt(camera.position);
                    }
                    break;

                case "private":
                    privatecompanyBtn.style.backgroundColor = "#2c3e50";
                    publicCompanyBtn.style.backgroundColor = "#3498db";
                    for (let i = 0; i < privateCompanyimagePanels.length; i++) {
                        let row = (Math.floor(i / 5)) * 3;
                        let column = i % 5;

                        // 위치 이동
                        privateCompanyimagePanels[i].mesh.visible = true;
                        gsap.to(
                            privateCompanyimagePanels[i].mesh.position,
                            {
                                duration: 1,
                                x: (column * 4),
                                y: 3,
                                z: row
                            }
                        );
                        privateCompanyimagePanels[i].mesh.rotation.y = 2*Math.PI;
                        privateCompanyimagePanels[i].mesh.rotation.z = 2*Math.PI;
                        //privateCompanyimagePanels[i].mesh.lookAt(camera.position);
                    }
                    for (let i = 0; i < publicCompanyimagePanels.length; i++) {
                        // 위치 이동
                        gsap.to(
                            publicCompanyimagePanels[i].mesh.position,
                            {
                                duration: 1,
                                x: 15,
                                y: 1,
                                z: 2
                            }
                        );
                        publicCompanyimagePanels[i].mesh.visible = false;
                        //publicCompanyimagePanels[i].mesh.lookAt(camera.position);
                    }
                    break;
            }
        }
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

    btnWrapper.addEventListener('click', setCompany);

    draw();
}