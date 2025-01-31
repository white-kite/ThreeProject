import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

// ----- 주제: glb 파일 애니메이션 효과 추가

export default function room02() {
    
    const canvas = document.querySelector("#three-canvas");
    const loadingScreen = document.getElementById('loading-screen');
    const gameDesc = document.getElementById('gameDesc');
    const overlay = document.getElementById('overlay');
    const skipButton = document.getElementById('skipButton');
    const startButton = document.getElementById('startButton');

    // GIF가 일정 시간 동안 표시된 후 canvas가 나타나도록 설정
    /*
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        canvas.style.display = 'block';
        hideLoadingScreen();
    }, 1000); // 3초 후에 canvas를 보여줍니다. (3000 밀리초 = 3초)
    */

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04052F");

    // Camera (2D -> 40, 3D -> 75 )
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 12;
    camera.position.z = 8;

    //camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // 관성 효과 활성화
    controls.dampingFactor = 0.5; // 관성의 정도

    // 회전 범위 설정
    controls.minAzimuthAngle = 0 ; // -90도 -Math.PI / 2
    controls.maxAzimuthAngle = Math.PI / 2;  // 90도

    // 회전 비활성화
    // controls.enableRotate = false;

    // 카메라가 타겟에 가까워질 수 있는 최소 거리 설정
    controls.minDistance = 5;

    // 카메라가 타겟으로부터 멀어질 수 있는 최대 거리 설정
    controls.maxDistance = 20;

    const ambientLight = new THREE.AmbientLight("#ffffff", 1000);
    scene.add(ambientLight); 

    const spotLight1 = new THREE.SpotLight("#FF9E09", 1000);
    spotLight1.castShadow = true;

    spotLight1.position.set(0,15,0);
    spotLight1.angle = Math.PI /8; // 조명의 최대 확산 각도를 30도로 설정 (라디안 단위)
    spotLight1.penumbra = 0.1; 

    // 그림자 좀더 선명하게 보이는 설정
    spotLight1.shadow.mapSize.width = 1024;
    spotLight1.shadow.mapSize.height = 1024;


    scene.add(spotLight1);

    // Add SpotLightHelpers
    // const spotLightHelper1 = new SpotLightHelper(spotLight1);
    // scene.add(spotLightHelper1);
    

    // gltf loader (gltf 파일 불러오기)
    let mixer;
    const gltfLoader = new GLTFLoader();

    let room;
    let letter;
    let box;
    gltfLoader.load("/models/odomak.glb", (gltf) => {
        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {
                if (child.name === "Plane013"
                        //||child.name === "Plane009"   //원통
                        || child.name === "Cube005"     //벽돌
                        || child.name === "Cube006"     //창문 반사효과
                        || child.name === "pngfindcom-medieval-banner-png-1287972"
                        || child.name === "Cube010"     //창문 옆 횟불
                        || child.name === "Cylinder003"
                        || child.name === "Cylinder005"
                        //|| child.name === "Plane010"
                        //|| child.name === "Plane011"
                ) {
                    child.visible = false;
                } else if( child.name === "Cube007"     //벽면
                        || child.name === "Plane"       //판자
                        || child.name === "Plane001"    //판자1
                        || child.name === "Plane002"    //판자2
                        || child.name === "Plane003"    //판자3
                        || child.name === "Plane004"    //판자4
                        || child.name === "Plane005"    //판자5
                ){    // 벽면
                    // 현재 위치를 저장
                    const originalPosition = child.position.clone();

                    // x축 스케일을 1.5배로 늘림
                    const scaleFactor = 1.5;
                    child.scale.x *= scaleFactor;

                    // 새로운 경계 상자를 계산
                    const box = new THREE.Box3().setFromObject(child);
                    const size = box.getSize(new THREE.Vector3());

                    // x축 중심을 기준으로 위치 조정
                    child.position.set(
                        originalPosition.x + (size.x / 2 - (size.x / scaleFactor) / 2),
                        originalPosition.y,
                        originalPosition.z
                    );
                    child.castShadow = true;            
                    child.receiveShadow = true;         
                } else if(child.name === "Plane007"){
                    child.castShadow = true;            
                    child.receiveShadow = true;
                    letter = child;
                } else if(child.name === "Cube011"){
                    child.castShadow = true; 
                    child.receiveShadow = true; 
                    box = child;
                }
                 else {
                    child.castShadow = true; 
                    child.receiveShadow = true;
                }
            });

            // callback 함수
            room = gltf.scene;
            room.position.set(10, 1, 13);
            room.scale.set(0.03, 0.03, 0.03);
            scene.add(room);        

            hideLoadingScreen();
        }else {
            console.error('GLTF 파일 로드 오류: scene이 없습니다.');
        }
    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });

    let tree;
    let initialTreeScale = new THREE.Vector3(0.5, 0.5, 0.5); // 트리 객체의 초기 스케일
    gltfLoader.load("/models/tree3.glb", (gltf) => {

        if (gltf.scene) {
            gltf.scene.castShadow = true;

            gltf.scene.traverse((child) => {
                //Cylinder
                if (child.name === "Cylinder"
                        ||child.name === "Cylinder001"
                        ||child.name.includes("Cube") 
                ) {
                    child.visible = false;
                } else {
                    if (child.isMesh) {
                        child.name = 'tree';
                        child.castShadow = true;
                        child.receiveShadow = true; 
                    }
                }
            });
        }
        tree = gltf.scene;
        tree.position.set(5, 0.5, -3);
        tree.scale.copy(initialTreeScale); // 초기  트리 스케일 설정
        scene.add(tree);

    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });

    let giftBox;
    const letterImages = [
        '/images/letters/책상위민지.png',
        '/images/letters/현미경별수지.png',
        '/images/letters/포도나무하늘.png',
        '/images/letters/해적왕루피.png'
    ];
    const giftBoxPosition = [
        { "location" : "책상"    , "x" : 0.3 , "y" : 2.55 , "z" : -1.6 }, // 책상위 좌표
        { "location" : "트리"    , "x" : 4   , "y" : 1    , "z" : 0    }, // 트리옆
        { "location" : "큰술통"  , "x" : -4.5, "y" : 3    , "z" : -2   }, // 큰술통 위
        { "location" : "보물상자", "x" : -4.3, "y" : 3.2  , "z" : 2.7  }, // 보물상자안에
        { "location" : "작은술통", "x" : -4.5, "y" : 2.55 , "z" : -0.3 }, // 작은술통 위
        { "location" : "의자"    , "x" : -0.8, "y" : 2    , "z" : 0.3  }, // 의자위에
    ];
    
    const gitbBoxColor = [
        {"box" : "magenta", "rebon" : "blue" },
        {"box" : "gold"   , "rebon" : "navy" },
        {"box" : "purple" , "rebon" : "gold" },
        {"box" : "black"  , "rebon" : "gray" }
    ]
    
    // 분기 처리
    const giftColor = localStorage.getItem('giftColor');
    let ramdomCnt;
    if(giftColor){
        if(giftColor === "핑크"){
            ramdomCnt = 0;
        } else if (giftColor === "노란"){
            ramdomCnt = 1;
        } else if (giftColor === "보라"){
            ramdomCnt = 2;
        } else if(giftColor === "검정"){
            ramdomCnt = 3;
        }
    } else {
        location.href = "/open.html";
    }
    //const ramdomCnt = Math.floor(Math.random() * 4); // 핑크면 0, 노랑이면 1, 보라면 2, 검정이면 3
    let rsltYn = "Y";
    let gameCnt = 3;

    gltfLoader.load("/models/giftBox_joinSpare.glb", (gltf) => {

        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {

                if (    child.name == "rebon" 
                    ||  child.name == "BezierCircle"
                    ||  child.name == "BezierCircle001"
                    ||  child.name == "BezierCircle002"
                    ||  child.name == "BezierCircle003"  
                ) {
                    const rebonMaterial = child.material.clone();
                    rebonMaterial.color.set(gitbBoxColor[ramdomCnt].rebon);
                    rebonMaterial.emissive.set(gitbBoxColor[ramdomCnt].rebon);
                    rebonMaterial.emissiveIntensity = 0.9;
                    
                    child.material = rebonMaterial;
                    if (child.isMesh) {
                        child.material = rebonMaterial;
                    }
                } else if (child.name == "cube" ){
                    const cubeMaterial = child.material.clone();                    
                    cubeMaterial.color.set(gitbBoxColor[ramdomCnt].box);
                    cubeMaterial.emissive.set(gitbBoxColor[ramdomCnt].box);
                    cubeMaterial.emissiveIntensity = 0.9;   // 자체발광 강도 설정
                    
                    child.material = cubeMaterial;
                    if (child.isMesh) {
                        child.material = cubeMaterial;
                    }
                } 
                child.castShadow = true;
                child.receiveShadow = true;
                
            });
        }
        giftBox = gltf.scene;
        giftBox.scale.set(0.6, 0.6, 0.6);
        //giftBox.position.set(giftBoxPosition[4].x, giftBoxPosition[4].y, giftBoxPosition[4].z);
        giftBox.visible = false;
        scene.add(giftBox);

    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });

    

    
    // 트리 밑 기둥 생성
    const onegeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const onematerial = new THREE.MeshBasicMaterial({ color: "#7C3E29" });
    const cylinder = new THREE.Mesh(onegeometry, onematerial);
    cylinder.position.set(5, 1.3, -2.5);

    scene.add(cylinder);

    // 벽 조명 추가
    const pointLight = new THREE.PointLight("#FF9E09", 10, 100); // 흰색 광원, 강도 1, 거리 100
    pointLight.position.set(-5, 7, 1);
    pointLight.castShadow = true;
    pointLight.receiveShadow = true;
    scene.add(pointLight);

    //const pointLightHelper = new THREE.PointLightHelper(pointLight);
    //scene.add(pointLightHelper);

    // 벽 조명 추가2
    const pointLight2 = new THREE.PointLight("#FF9E09", 50, 100);
    pointLight2.position.set(2.2, 6, -3);
    scene.add(pointLight2);

    //const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);
    //scene.add(pointLightHelper2);

    // 눈송이효과
    const snowflakes = [];

    function createSnowflake() {
        const geometry = new THREE.CircleGeometry(0.1, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const snowflake = new THREE.Mesh(geometry, material);

        snowflake.position.x = Math.random() * 100 - 50; // x 좌표를 -100에서 100까지로 제한
        snowflake.position.y = Math.random() * 100 - 50; // y 좌표를 -100에서 100까지로 제한
        snowflake.position.z = Math.random() * 100 - 50; // z 좌표를 -100에서 100까지로 제한
        snowflake.velocity = Math.random() * 0.5 + 0.1;

        scene.add(snowflake);
        snowflakes.push(snowflake);
    }

    // 눈송이 여러개 생성
    for (let i = 0; i < 2500; i++) {
        createSnowflake();
    }

    // 사운드 매니저 생성
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const sound = new THREE.PositionalAudio(listener);

    // 사운드 파일 로드
    audioLoader.load('/sounds/joyful-snowman.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        sound.setLoop(true);
        sound.setVolume(0.2);
        sound.play(); // 화면 로드시 재생
    });

    camera.add(listener);
    scene.add(sound);

    // 사용자 인터랙션을 통한 재생/정지 버튼 생성
    const button = document.createElement('button');
    button.innerText = "Pause Sound";   // 디폴트로 재생 중이므로 정지 버튼 활성화
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    let isPlaying = true; // 디폴트로 재생 중

    button.addEventListener('click', function() {
        if (isPlaying) {
            sound.pause(); // 소리 정지
            button.innerText = "Play Sound";
        } else {
            sound.play(); // 소리 재생
            button.innerText = "Pause Sound";
        }
        isPlaying = !isPlaying;
    });

    //AxesHelper;
    //const axesHelper = new THREE.AxesHelper(100);
    //scene.add(axesHelper);

    // Dat GUI
    /*
    const gui = new dat.GUI();
    gui.add(camera.position, "x", -10, 100, 0.1).name("카메라 X");
    gui.add(camera.position, "y", -10, 100, 0.1).name("카메라 Y");
    gui.add(camera.position, "z", -10, 100, 0.1).name("카메라 Z");
    */


    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        renderer.setAnimationLoop(draw);
        renderer.render(scene, camera);
        
        //각 눈송이마다 이동 처리
        for (const snowflake of snowflakes) {
            snowflake.position.y -= snowflake.velocity;
            if (snowflake.position.y < -50) {
                snowflake.position.y = 50;
                snowflake.position.x = Math.random() * 200 - 50;
                snowflake.position.z = Math.random() * 200 - 50;
            }
        }
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener("resize", setSize);

    draw();

    // 로딩 화면을 숨기는 함수
    function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
        canvas.style.display = 'block';

        gameDesc.style.display = 'block';
        overlay.style.display = 'block';
    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    let isDragging = false;
    let mouseDownTime = 0;

    // 마우스 다운 이벤트 핸들러
    function onDocumentMouseDown(event) {
        isDragging = false;
        mouseDownTime = Date.now();
    }

    // 마우스 업 이벤트 핸들러
    function onDocumentMouseUp(event) {
        if (!isDragging) {
            onDocumentClick(event);
        } else {
            const clickDuration = Date.now() - mouseDownTime;
            if (clickDuration < 200) { // 0.2초 이하인 경우 짧은 클릭으로 간주
                onDocumentClick(event);
            }
        }
        isDragging = false;
    }

    // 클릭한 객체 저장 변수
    let lastClickedObjectName = "";

    function onDocumentClick(event) {
        if (gameDesc.style.display == 'block') return; // 설명이 보이는 상태에서는 클릭 이벤트를 무시
        event.preventDefault();

        // 우클릭이면 아무 동작도 X
        if (event.button === 2 && window.getComputedStyle(gameDesc).display == "block") {
            return; 
        }

        if (event.target === skipButton || event.target === startButton) {
            return;
        }

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(room, true);

        // 클릭된 객체가 있을 경우
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;

            // 클릭된 객체의 이름이 "pngfind.com-medieval-banner-png-1287972"인지 확인
            if (clickedObject.name === "Plane007") {
                // 이미지를 보여주는 함수 호출
                showImageFullScreen(letterImages[ramdomCnt], 'default');
            } else if (clickedObject.name === "Cube004"         // 보물상자
                    || clickedObject.name.includes("Cube008")   // 보물상자
                    || clickedObject.name.includes("Cube007")   // 트리
                    || clickedObject.name.includes("tree")      // 트리
                    || clickedObject.name.includes("Plane006")  // 책상
                    || clickedObject.name.includes("Plane009")  // 큰술통
                    || clickedObject.name.includes("Plane010")  // 큰술통
                    || clickedObject.name.includes("Plane011")  
                    || clickedObject.name.includes("Plane012")  // 작은술통
                    || clickedObject.name.includes("chair")     // 의자
                ) {
                lastClickedObjectName = clickedObject;
                showImageFullScreen('/images/question01.png', 'custom');
            }
        }
    }

    // 버튼 위치를 조정하는 함수
    function positionButtons(imageElement, yesButton, noButton) {
        const imgRect = imageElement.getBoundingClientRect();
        const btnSize = imgRect.width * 0.2;

        // "Yes" 버튼 위치 설정
        yesButton.style.width = `${btnSize}px`;
        yesButton.style.left = `${imgRect.left + imgRect.width * 0.25 - btnSize / 2}px`;
        yesButton.style.top = `${imgRect.bottom - btnSize * 1.1}px`;

        // "No" 버튼 위치 설정
        noButton.style.width = `${btnSize}px`;
        noButton.style.left = `${imgRect.left + imgRect.width * 0.75 - btnSize / 2}px`;
        noButton.style.top = `${imgRect.bottom - btnSize * 1.1}px`;
    }

    // 전체 화면에 이미지를 보여주는 함수
    function showImageFullScreen(imageUrl, styleType) {
        // 기존 이미지 요소가 있는지 확인
        if (document.getElementById('fullscreenImage')) {
            return;
        }
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.id = 'fullscreenImage';
        imageElement.style.position = 'fixed';
        imageElement.style.top = '50%';
        imageElement.style.left = '50%';
        imageElement.style.transform = 'translate(-50%, -50%)';
        imageElement.style.zIndex = '9999';

        if (styleType === 'custom') {
            imageElement.style.maxWidth = '90vh';
            imageElement.style.maxHeight = '70vw';

            const yesButton = document.createElement('img');
            yesButton.src = '/images/yesBtn.png';
            yesButton.id = 'yesButton';
            yesButton.style.position = 'absolute';
            yesButton.style.zIndex = '10000';

            const noButton = document.createElement('img');
            noButton.src = '/images/noBtn.png';
            noButton.id = 'noButton';
            noButton.style.position = 'absolute';
            noButton.style.zIndex = '10000';

            document.body.appendChild(imageElement);
            document.body.appendChild(yesButton);
            document.body.appendChild(noButton);

            // 이미지 로드 후 버튼 위치 조정
            imageElement.onload = () => positionButtons(imageElement, yesButton, noButton);
            // 창 크기 변경 시 버튼 위치 조정
            const resizeHandler = () => positionButtons(imageElement, yesButton, noButton);
            window.addEventListener('resize', resizeHandler);

            // "No" 버튼 클릭 시 동작
            noButton.addEventListener('click', () => {
                cleanup(imageElement, yesButton, noButton, resizeHandler);
            });

            // "Yes" 버튼 클릭 시 동작
            yesButton.addEventListener('click', () => {
                handleYesButtonClick();
                cleanup(imageElement, yesButton, noButton, resizeHandler);
            });

        } else {
            imageElement.style.maxWidth = '70vw';
            imageElement.style.maxHeight = '90vh';
            document.body.appendChild(imageElement);
        }

        // 이미지 클릭 시 제거
        imageElement.addEventListener('click', () => {
            cleanup(imageElement);
        });
    }

    // 리소스 정리 함수
    function cleanup(imageElement, yesButton = null, noButton = null, resizeHandler = null) {
        imageElement.remove();
        if (yesButton) yesButton.remove();
        if (noButton) noButton.remove();
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    }

    // "Yes" 버튼 클릭 시 동작을 처리하는 함수
    function handleYesButtonClick() {
        const loadingImage = document.getElementById('loading-image');
        const loadingText = document.querySelector('.loading-text');
        const resetBtn = document.getElementById('resetBtn');
        const restartBtn = document.getElementById('restartBtn');
        const loadingScreen = document.getElementById('loading-screen');
        const canvas = document.getElementById('three-canvas');
        let resultImg = "Fail";
        let positionCnt; // 위치값 호출 변수
        let resetBtnStyle = "block";

        // localStorage 선물상자
        let giftsArray = JSON.parse(localStorage.getItem('gifts'));
        
        // 선물상자 위치 선정
        if (lastClickedObjectName){
            if(lastClickedObjectName.name.includes("Plane006")){            // 책상
                positionCnt = 0;
            } else if(lastClickedObjectName.name.includes("Cube007")        // 트리
                   || lastClickedObjectName.name === "tree"){
                positionCnt = 1;
            } else if(lastClickedObjectName.name.includes("Plane009")
                    || lastClickedObjectName.name.includes("Plane010")){    // 큰술통
                positionCnt = 2;
            } else if(lastClickedObjectName.name.includes("Cube008")){      // 보물상자
                positionCnt = 3;
            } else if(lastClickedObjectName.name.includes("Plane012")){     // 작은술통
                positionCnt = 4;
            } else if(lastClickedObjectName.name === "chair"){              // 의자
                positionCnt = 5;
            } 
            giftBox.position.set(giftBoxPosition[positionCnt].x, giftBoxPosition[positionCnt].y, giftBoxPosition[positionCnt].z);
        }
        
        // 선물, 선물 위치 성공/실패 처리 
        if (positionCnt === ramdomCnt) {
            rsltYn = "Y";
            resultImg = "Success";
            resetBtnStyle = "none";

            // 로컬스토리지에 저장된 아이템 중 선물주기 성공한 아이템은 삭제처리 (+ 수정 필요 )
            localStorage.removeItem('url');
            localStorage.removeItem('giftColor');
            
            giftsArray = giftsArray.filter(gift => gift.desc !== giftColor +' 선물 상자');
            localStorage.setItem('gifts', JSON.stringify(giftsArray));
            
        }
        else {
            rsltYn = "N";
        }
        gameCnt--;
        giftBox.visible = true;
        setTimeout(() => {
            loadingImage.src = '/images/giftGiving'+ resultImg +'.gif';
            loadingText.style.display = 'none';
            loadingScreen.style.display = 'block';
            resetBtn.style.display = resetBtnStyle;
            restartBtn.style.display = 'block';
            canvas.style.display = 'none';
        }, 2000);
    }

   
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    // resetBtn 클릭 이벤트 핸들러 추가
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        const loadingScreen = document.getElementById('loading-screen');
        const canvas = document.getElementById('three-canvas');
        
        let countCnt = document.getElementById('countCnt');
        countCnt.innerText = gameCnt;
        if(rsltYn === "Y" || gameCnt < 1){
            location.href = "/warehouse.html";
        } else {
            resetBtn.style.display = 'none';
            restartBtn.style.display = 'none';
            loadingScreen.style.display = 'none';
            
            canvas.style.display = 'block';
    
            // 예: giftBox 숨기기, 기타 상태 초기화 등
            giftBox.visible = false;
            canvas.style.display = 'block';
        }
    });

    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        const loadingScreen = document.getElementById('loading-screen');
        const canvas = document.getElementById('three-canvas');
        
        let countCnt = document.getElementById('countCnt');
        countCnt.innerText = gameCnt;

        // 게임 상태 초기화
        gameCnt = 3;  // 게임 횟수를 초기화합니다. 
        resetBtn.style.display = 'none';
        restartBtn.style.display = 'none';
        loadingScreen.style.display = 'none';
        canvas.style.display = 'block';

        // 예: giftBox 숨기기, 기타 상태 초기화 등
        giftBox.visible = false;
        canvas.style.display = 'block';
    
        // 다시 open.html로 
        location.href = "/warehouse.html";
    });


    let lastEmissiveObject = null;  // 발광하는 객체 변수 저장
    let resetTimeout = null;        // 타이머를 저장할 변수
    function onMouseMove(event) {
        isDragging = true;

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        function scaleObject(objectName, scaleValue) {
            if (room && room.getObjectByName(objectName)) {
                gsap.to(room.getObjectByName(objectName).scale, { 
                    x: scaleValue, 
                    y: scaleValue, 
                    z: scaleValue, 
                    duration: 0.5
                });
            }
        }

        function resetScales() {
            const resetObjects = [
                { name: "Cube004" , scale: 100 },
                { name: "Cube011" , scale: 100 },
                { name: "Plane011", scale: 70  },
                { name: "Plane009", scale: 100 },
                { name: "Plane010", scale: 100 },
                { name: "book001" , scale: 100 },
                { name: "chair"   , scale: 90  }
            ];
            
            resetObjects.forEach(obj => scaleObject(obj.name, obj.scale));
            resetObjects.forEach(obj => {
                if (room && room.getObjectByName(obj.name)) {
                    applyEmissiveEffect(room.getObjectByName(obj.name), 0x000000, 0);
                }
            });

            if (tree) {
                gsap.to(tree.scale, { 
                    x: initialTreeScale.x, 
                    y: initialTreeScale.y, 
                    z: initialTreeScale.z, 
                    duration: 0.5
                });
            }
            // 발광 효과 해제
            if (lastEmissiveObject) {
                applyEmissiveEffect(lastEmissiveObject, 0x000000, 0);
                lastEmissiveObject = null; // 효과 제거 후 초기화
            }
        }

        // 발광 효과와 크기 조정 해제 시점을 관리하는 함수
        function scheduleReset() {
            if (resetTimeout) {
                clearTimeout(resetTimeout);
            }
            resetTimeout = setTimeout(() => {
                resetScales();
            }, 3000);
        }
        

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;            
            resetScales();

            if (intersectedObject.name === "Cube004" || intersectedObject.name.includes("Cube008")) {
                scaleObject("Cube004", 110);
                scaleObject("Cube011", 110);
                applyEmissiveEffect(room.getObjectByName("Cube004"), 0xffd700, 0.05);
                applyEmissiveEffect(room.getObjectByName("Cube011"), 0xffd700, 0.05);
                lastEmissiveObject = intersectedObject; // 발광 적용된 객체 추적
            } 
            else if (intersectedObject.name.includes("Plane012")) {
                
                scaleObject("Plane011", 80);
                applyEmissiveEffect(intersectedObject, 0xffd700, 0.05);
                applyEmissiveEffect(room.getObjectByName("Plane011"), 0xffd700, 0.05);
                lastEmissiveObject = intersectedObject; // 발광 적용된 객체 추적
            }
            else if (intersectedObject.name === "Plane009" || intersectedObject.name === "Plane010") {
                scaleObject("Plane009", 110);
                scaleObject("Plane010", 110);
                applyEmissiveEffect(room.getObjectByName("Plane009"), 0xffd700, 0.05);
                applyEmissiveEffect(room.getObjectByName("Plane010"), 0xffd700, 0.05);
                lastEmissiveObject = intersectedObject; // 발광 적용된 객체 추적
            }
            else if (intersectedObject.name === "chair") {
                scaleObject("chair", 100);
                applyEmissiveEffect(intersectedObject, 0xffd700, 0.05);
                lastEmissiveObject = intersectedObject; // 발광 적용된 객체 추적
            }
            else if (intersectedObject.name === "tree") {
                // 트리 객체 위에 마우스가 있을 때
                gsap.to(tree.scale, { 
                    x: initialTreeScale.x + 0.05, 
                    y: initialTreeScale.y + 0.05, 
                    z: initialTreeScale.z + 0.05, 
                    duration: 0.5
                });
                applyEmissiveEffect(intersectedObject, 0xffd700, 0.05); // 노란색 발광 효과
                lastEmissiveObject = intersectedObject; // 발광 적용된 객체 추적
                //createOutline(intersectedObject);
            }
            else if (intersectedObject.name.includes("book") ) {
                scaleObject("book001", 110);
                applyEmissiveEffect(room.getObjectByName("book001"), 0xffd700, 0.05);
                lastEmissiveObject = intersectedObject; // 발광 적용된 객체 추적
            }
            scheduleReset();
        } 
        else {
            resetScales();
        }
    }

    // 객체 발광 효과
    function applyEmissiveEffect(object, emissiveColor, intensity) {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive = new THREE.Color(emissiveColor);
                child.material.emissiveIntensity = intensity;
            }
        });
    }

    // 우클릭시 초기화 시점으로 이동
    document.addEventListener('contextmenu', onDocumentRightClick, false);

    function onDocumentRightClick(event) {
        event.preventDefault(); 

        gsap.to(camera.position, {
            x: 0, 
            y: 12, 
            z: 8,
            duration: 1,
            onUpdate: function () {
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                controls.update(); 
            }
        });
    }
    
}

