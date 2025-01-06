import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

export default function room01() {
    
    const canvas = document.querySelector("#three-canvas");
    const loadingScreen = document.getElementById('loading-screen');
    const loadingImage = document.getElementById('loading-image'); // 전역으로 선언하여 참조
    const gameDesc = document.getElementById('gameDesc');
    const overlay = document.getElementById('overlay');
    
    

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


    // Camera
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    // 빨간색이 x축, 초록색이 y축, 파란색이 z축
    camera.position.set(1050, 420, 1350);
    scene.add(camera);

    // Light
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.x = 50;
    directionalLight.position.z = 10;
    scene.add(directionalLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 3);
    light1.position.set(300, 200, 400);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight("yellow", 0.8); //0x0000FF blue
    light2.position.set(-300, 200, 300);
    scene.add(light2);


    // Controls (카메라 시점 조절)
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // 관성 효과 활성화
    controls.dampingFactor = 0.5; // 관성의 정도

    // 회전 범위 설정
    controls.minAzimuthAngle = 0 ; // -90도 -Math.PI / 2
    controls.maxAzimuthAngle = Math.PI / 2;  // 90도

    // Set the vertical angle limits (in radians)
    controls.minPolarAngle = Math.PI / 4; // Minimum vertical angle (45 degrees Math.PI / 4)
    controls.maxPolarAngle = Math.PI / 2; // Maximum vertical angle (90 degrees)

    // 회전 비활성화
    // controls.enableRotate = false;

    // 카메라가 타겟에 가까워질 수 있는 최소 거리 설정
    controls.minDistance = 600;

    // 카메라가 타겟으로부터 멀어질 수 있는 최대 거리 설정
    controls.maxDistance = 2500;


    // 로딩 화면 숨김 및 GLB 파일 로드
    function hideLoadingScreen() {
        loadingScreen.style.display = 'none'; // 로딩화면 숨김처리
        canvas.style.display = 'block';

        gameDesc.style.display = 'block';
        overlay.style.display = 'block';
    }

    // 가이드라인
    const helper = new THREE.AxesHelper(3000); // 숫자는 사이즈, 없어도 되긴함
    scene.add(helper);

    // GLB 모델 로드
    const gltfLoader = new GLTFLoader();
        
    let room; // 전역변수로 설정

    gltfLoader.load("./models/room.glb", function(gltf) {
        room = gltf.scene;
        room.position.set(1200, -100, 700);
        room.scale.set(300, 300, 300);
        // 빨간색이 x축, 초록색이 y축, 파란색이 z축
        room.rotation.set(0,600,0);
        scene.add(room);
        draw(); // 모델이 준비된 후 렌더링 루프 시작
    }, undefined, function(error) {
        console.error('GLB 파일 로딩 에러:', error);
    });

    // 별빛을 표현할 재질 생성
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // 별빛 색상
        size: 10, // 별빛 크기
        sizeAttenuation: true // 카메라에서 멀어질수록 별이 작아지도록 설정
    });

    // 별빛 점들 생성
    const starGeometry = new THREE.BufferGeometry();

    const stars = new THREE.Points(starGeometry, starMaterial);
    // 버퍼 속성 생성
    const positions = new Float32Array(1000 * 3); // 1000개의 점 * 3차원 좌표 (x, y, z)
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 별빛을 생성하고 버퍼 속성에 추가하는 반복문
    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Vector3(
            Math.random() * 3000 - 1000, // x 좌표
            Math.random() * 3000 - 1000, // y 좌표
            Math.random() * 3000 - 1000  // z 좌표
        );
        positions[i * 3] = star.x;
        positions[i * 3 + 1] = star.y;
        positions[i * 3 + 2] = star.z;
    }

    // 씬에 별빛 객체 추가
    scene.add(stars);

    // 뒷 배경 추가
    // Texture Loader를 사용하여 이미지 로드
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./images/plane1.jpg', function(texture) {
        const backPlaneGeometry = new THREE.PlaneGeometry(8000, 8000);
        const backPlaneMaterial = new THREE.MeshBasicMaterial({
            map: texture // 텍스처 매핑
        });
        const backPlane1 = new THREE.Mesh(backPlaneGeometry, backPlaneMaterial);
        backPlane1.position.set(400, 500, -400);
        const backPlane2 = new THREE.Mesh(backPlaneGeometry, backPlaneMaterial);
        backPlane2.position.set(-500,0, 0);
        backPlane2.rotation.y = Math.PI / 2 // 90도
        scene.add(backPlane1, backPlane2);
    });

    

    // 그리기
    function draw() {
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);

        // 별빛 회전 효과 추가
        stars.rotation.x += 0.001;
        stars.rotation.y += 0.001;
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener("resize", setSize);

    // 초기 로딩 화면 설정
    canvas.style.display = 'none';
    loadingScreen.style.display = 'flex';
    setTimeout(hideLoadingScreen, 3000); // 3초 후 로딩 화면 숨김

    /** @@@@@@@@@@@@@@오디오 설정@@@@@@@@@@@@@@@@@@ */
    // 사운드 매니저 생성
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    //const sound = new THREE.PositionalAudio(listener);
    const sound = new THREE.Audio(listener);

    // 사운드 파일 로드
    // 사운드 파일 로드
    audioLoader.load('/sounds/joyful-snowman.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.2);
        sound.play();
    });

    camera.add(listener);

    // 오디오 객체를 씬에 추가
    scene.add(sound);

    // 사용자 인터랙션을 통한 재생/정지 버튼 생성
    const button = document.createElement('button');
    button.innerText = "Pause Sound"; // 디폴트로 재생 중이므로 정지 버튼 활성화
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


    /** @@@@@@@@@@@@@@편지설정@@@@@@@@@@@@@@@@@@ */

    const letterImages = [
        './images/letters/곰인형이갖고싶은미셸.png',
        './images/letters/산타를노리는케이트.png',
        './images/letters/생양파율리.png',
        './images/letters/여름산타를원하는다니엘.png',
        './images/letters/울지않는찰리.png',
    ];

    // 랜덤 이미지 변수
    let selectedImage;
    // 정답 위치 변수
    let correctPlace;
    // 선물 박스 색
    let giftColor;

    // 랜덤 이미지 선택 함수
    function getRandomImage(imagesArray) {
        //const randomIndex = Math.floor(Math.random() * imagesArray.length);
        //selectedImage = imagesArray[randomIndex];
        
        const localImage = localStorage.getItem('giftColor');

        // '갈색' '빨간' '하얀'  '초록'  '파랑'
        if(localImage === '갈색'){
            selectedImage = imagesArray[0];
        } else if(localImage === '빨간'){
            selectedImage = imagesArray[1];
        } else if(localImage === '하얀'){
            selectedImage = imagesArray[2];
        } else if(localImage === '초록'){
            selectedImage = imagesArray[3];
        } else if(localImage === '파랑'){
            selectedImage = imagesArray[4];
        }
        
        console.log(`Selected image: ${selectedImage}`); // 선택된 이미지 파일 경로 출력 // 이걸로 게임의 승리 실패 조건 만들기
        
        // 승리 실패 조건 설정
        setCorrectPlace(selectedImage);
        
        return selectedImage;
    }

    // 이미지에 따라 correctPlace 설정 함수
    function setCorrectPlace(image) {
        if (image.includes('미셸')) {
            correctPlace = 'sofa';
            giftColor = 'brown';
        } else if (image.includes('케이트')) {
            correctPlace = 'tree';
            giftColor = 'red';
        } else if (image.includes('율리')) {
            correctPlace = 'window';
            giftColor = 'white';
        } else if (image.includes('다니엘')) {
            correctPlace = 'ground';
            giftColor = 'green';
        } else if (image.includes('찰리')) {
            correctPlace = 'sofa';
            giftColor = 'blue';
        } else {
            correctPlace = 'unknown'; // 해당 조건이 없는 경우 기본값 설정
        }
        console.log(`Correct place: ${correctPlace}`); // 설정된 correctPlace 출력
    }

    // BoxGeometry 이용하여 편지의 형태를 정의합니다.
    const letterGeometry = new THREE.BoxGeometry(100, 200, 3); // 매개변수는 (가로, 세로, 깊이)입니다.

    // 전역 변수로 랜덤 이미지를 저장합니다.
    const randomImage = getRandomImage(letterImages);

    // TextureLoader를 사용하여 이미지를 로드합니다.
    const texture = textureLoader.load(randomImage, () => {
        // 텍스처가 로드된 후 콜백 함수에서 재질을 만듭니다.
        const letterMaterial = new THREE.MeshBasicMaterial({ map: texture });

        // 편지의 메쉬를 생성합니다.
        const cylinder = new THREE.Mesh(letterGeometry, letterMaterial);
        cylinder.position.set(550, 150, -200);

        // scene에 기둥을 추가합니다.
        scene.add(cylinder);
    });

    /* @@@@@@@@@@@@@@@@@@@@@@@@@여기서부터 클릭이벤트@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

    

    let clickPosition = null;
    let clickedObject;

    let isUIActive = false;  // UI가 활성화되어 있는지 상태를 저장하는 변수

    function onDocumentClick(event) {
    if (isUIActive || gameDesc.style.display == 'block') return; // UI가 활성화된 상태, 설명이 보이는 상태에서는 클릭 이벤트를 무시
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(room, true);

    if (intersects.length > 0) {
        clickedObject = intersects[0].object;
        console.log(clickedObject.name);
        clickPosition = intersects[0].point; // 클릭한 위치 저장

        if (clickedObject.name === "Wall__1_") { // 편지 띄우기
            showImageFullScreen(randomImage, 'default');
        } else if (clickedObject.name === "group_0" || clickedObject.name === "group_1" // 양말
            || /^sofa/.test(clickedObject.name)
            || clickedObject.name.includes("leaves") || clickedObject.name.includes("Wall__5_") 
            || clickedObject.name.includes("window") || clickedObject.name.includes("ground")
            || /^Sphere/.test(clickedObject.name) || clickedObject.name.includes("g_Star012_25") 
            || clickedObject.name.includes("ChristmasTree") || clickedObject.name.includes("Ground")) {
            showImageFullScreen('/images/question01.png', 'custom');
        }
    }
}

// 전역 선언
const yesButton = document.createElement('img');
const noButton = document.createElement('img');


    // postionButtons를 위해 뺐음
    if (document.getElementById('fullscreenImage')) {
        document.getElementById('fullscreenImage').remove();
        if (document.getElementById('yesButton')) document.getElementById('yesButton').remove();
        if (document.getElementById('noButton')) document.getElementById('noButton').remove();
        isUIActive = false;
        return;
    }

    const imageElement = document.createElement('img');

    function positionButtons() {
        const imgRect = imageElement.getBoundingClientRect();
        const btnSize = imgRect.width * 0.2;

        yesButton.style.width = `${btnSize}px`;
        yesButton.style.height = 'auto';
        yesButton.style.left = `${imgRect.left + imgRect.width * 0.25 - btnSize / 2}px`;
        yesButton.style.top = `${imgRect.bottom - btnSize * 1.1}px`;

        noButton.style.width = `${btnSize}px`;
        noButton.style.height = 'auto';
        noButton.style.left = `${imgRect.left + imgRect.width * 0.75 - btnSize / 2}px`;
        noButton.style.top = `${imgRect.bottom - btnSize * 1.1}px`;
    };

    let isYesButtonClicked = false; // 클릭 상태를 저장하는 변수
    
    // 전체 화면에 이미지를 보여주는 함수
    function showImageFullScreen(imageUrl, styleType) {

        if (document.getElementById('fullscreenImage')) {
            return;  // UI가 이미 활성화된 상태라면 함수 종료
        }
        
        imageElement.src = imageUrl;
        imageElement.id = 'fullscreenImage';
    
        if (styleType === 'custom') {
            imageElement.style.maxWidth = '90vh';
            imageElement.style.maxHeight = '70vw';
    
            //전역선언으로 수정
            //const yesButton = document.createElement('img');
            yesButton.src = '/images/yesBtn.png';
            yesButton.id = 'yesButton';
            yesButton.style.position = 'absolute';
            yesButton.style.zIndex = '10000';
            
            //전역선언으로 수정
            //const noButton = document.createElement('img');
            noButton.src = '/images/noBtn.png';
            noButton.id = 'noButton';
            noButton.style.position = 'absolute';
            noButton.style.zIndex = '10000';
    
            document.body.appendChild(imageElement);
            document.body.appendChild(yesButton);
            document.body.appendChild(noButton);
    
            isUIActive = true; // UI가 활성화된 상태로 변경
    
    
            imageElement.onload = positionButtons;
            window.addEventListener('resize', positionButtons);
    
            const removeElements = () => {
                imageElement.remove();
                yesButton.remove();
                noButton.remove();
                window.removeEventListener('resize', positionButtons);
                document.body.style.pointerEvents = 'auto'; // 배경 클릭 차단 해제
                isUIActive = false; // UI가 비활성화된 상태로 변경
                isYesButtonClicked = false; // 상태 초기화
            };
    
            noButton.addEventListener('click', (event) => {
                event.stopPropagation(); // 클릭 이벤트 전파 막기
                removeElements();
            });

            // 기존 리스너 제거 후 새로 추가
            yesButton.removeEventListener('click', onYesButtonClick);
            yesButton.addEventListener('click', onYesButtonClick, { once: true }); // 클릭 이벤트를 한 번만 실행하도록 설정
        
            function onYesButtonClick(event) {
                event.stopPropagation(); // 클릭 이벤트 전파 막기
                event.preventDefault(); // 기본 동작 방지

                if (!isYesButtonClicked) { // 클릭이 이미 처리되지 않은 경우에만 실행
                    
                    if (clickPosition) { // 선물 놓기
                        createGiftAtClickPosition(clickedObject);
                    }

                    isYesButtonClicked = true; // 클릭이 처리되었음을 기록
                    removeElements();
                }
            }
    
        } else {
            imageElement.style.maxWidth = '70vw';
            imageElement.style.maxHeight = '90vh';
            document.body.appendChild(imageElement);
        }
    
        imageElement.style.position = 'fixed';
        imageElement.style.top = '50%';
        imageElement.style.left = '50%';
        imageElement.style.transform = 'translate(-50%, -50%)';
        imageElement.style.zIndex = '9999';
    
        imageElement.addEventListener('click', (event) => {
            event.stopPropagation(); // 클릭 이벤트 전파 막기
            imageElement.remove();
            if (document.getElementById('yesButton')) document.getElementById('yesButton').remove();
            if (document.getElementById('noButton')) document.getElementById('noButton').remove();
            window.removeEventListener('resize', positionButtons);
            document.body.style.pointerEvents = 'auto'; // 배경 클릭 차단 해제
            isUIActive = false; // UI가 비활성화된 상태로 변경
        });
    }
    

    let giftBox; // 선물
    let currentGift; // 현재 존재하는 선물을 저장할 변수
    let gameCnt = 3; // 선물 놓을 기회
    
    // 선물 로딩
    gltfLoader.load("/models/giftBox_joinSpare.glb", (gltf) => {

        if (gltf.scene) {
            gltf.scene.castShadow = true;
    
            gltf.scene.traverse((child) => {

                //Cylinder
                if (    child.name == "rebon" 
                    ||  child.name == "BezierCircle"
                    ||  child.name == "BezierCircle001"
                    ||  child.name == "BezierCircle002"
                    ||  child.name == "BezierCircle003"  
                ) {
                    const rebonMaterial = child.material.clone();
                    rebonMaterial.color.set("yellow");
                    
                    child.material = rebonMaterial;
                    if (child.isMesh) {
                        child.material = rebonMaterial;
                    }
                } else if (child.name == "cube" ){
                    const cubeMaterial = child.material.clone();
                    cubeMaterial.color.set(giftColor);
                    
                    child.material = cubeMaterial;
                    if (child.isMesh) {
                        child.material = cubeMaterial;
                    }
                } 
                child.castShadow = true; // 그림자 캐스팅
                child.receiveShadow = true; // 그림자 수신
                
            });
        }
        giftBox = gltf.scene;
        
        giftBox.scale.set(20, 20, 20);

    }, undefined, (error) => {
        console.error('GLTF 파일 로드 오류', error);
    });

    // 선택된 장소 correctPlace와 비교할 대상
    let selectedPlace;

    // 선물두기
    function createGiftAtClickPosition(clickedObject) {

        console.log('선물 뒀다', gameCnt);


        gameCnt = gameCnt - 1; // 기회 한번 씀
        let countCnt = document.getElementById('countCnt');
        countCnt.innerText = gameCnt;

        if (currentGift) {
            scene.remove(currentGift); // 기존 선물 삭제
        }
        
        
        if (/^sofa/.test(clickedObject.name)) {
            selectedPlace='sofa';
            giftBox.position.set(800,50,235);
            console.log(selectedPlace);
        } else if (/^Sphere/.test(clickedObject.name) || clickedObject.name.includes("g_Star012_25")
                    || clickedObject.name.includes("ChristmasTree") || clickedObject.name.includes("leaves")) {
            selectedPlace='tree';
            giftBox.position.set(210,-20,340);
            console.log(selectedPlace);
        } else if (clickedObject.name.includes("window") || clickedObject.name.includes("Wall__5_")) {
            selectedPlace='window';
            giftBox.position.set(-70,-20, 730);
            console.log(selectedPlace);
        } else if (clickedObject.name === "group_0" || clickedObject.name === "group_1" || clickedObject.name.includes("Ground") || clickedObject.name.includes("ground") ) {
            selectedPlace='ground';
            giftBox.position.set(297, -20, 750);
            console.log(selectedPlace);
        } else {
            selectedPlace = 'unknown'; // 해당 조건이 없는 경우 기본값 설정
        }
        
        scene.add(giftBox);
        currentGift = giftBox; // 새로운 큐브 저장

        // 승패판정
        if (correctPlace === selectedPlace) { // 승리
            setTimeout(() => {
                if (loadingImage) {
                    loadingImage.src = '/images/giftGivingSuccess.gif';
                }
                loadingScreen.style.display = 'flex';
                canvas.style.display = 'none';

                // 여기서 다시하기 처음으로 버튼
                resetBtn.style.display = 'block';
                restartBtn.style.display = 'block';
        
            }, 1000);
        } else if( gameCnt < 1) { // 3번까지 기회 다 씀
            
                console.log("3번 틀림")
                if (loadingImage) {
                    loadingImage.src = '/images/giftGivingFail.gif';
                }
                loadingScreen.style.display = 'flex';
                canvas.style.display = 'none';

                // 여기서 다시하기 처음으로 버튼
                resetBtn.style.display = 'block';
                restartBtn.style.display = 'block';
            
        } else { // 잘못 둠, 기회 남아 있음
            setTimeout(() => {
                if (loadingImage) {
                    loadingImage.src = '/images/giftGivingFail.gif';
                }
                loadingScreen.style.display = 'flex';
                canvas.style.display = 'none';
        
                // 추가: 일정 시간 후 loadingScreen 숨기기
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    canvas.style.display = 'block';
                }, 3000); // 3초 후에 loadingScreen을 다시 숨김
            }, 1000);

            // 여기서는 다시하기 처음으로 버튼 안보이도록
            resetBtn.style.display = 'none';
            restartBtn.style.display = 'none';
        }
        
    }
    
    // @@@@@@@@@@@@@@@드래그 클릭 인식 방지@@@@@@@@@@@
    // 드래그와 클릭을 구분하기 위한 변수
    let isDragging = false;
    let mouseDownTime = 0;

    // 마우스 다운 이벤트 핸들러
    function onDocumentMouseDown(event) {
        isDragging = false;
        mouseDownTime = Date.now();
    }

    let originalScales = new Map(); // 오브젝트의 원래 크기를 저장할 Map
    let previousHoveredObjects = []; // 이전에 Hover된 오브젝트들을 저장할 배열
    let originalPositions = new Map(); // 오브젝트의 원래 위치를 저장할 Map, 별 위치를 위해

    // 마우스 무브 이벤트 핸들러
    function onDocumentMouseMove(event) {
        if (event.movementX !== 0 || event.movementY !== 0) {
            isDragging = true;
        }

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        if (room) {
            const intersects = raycaster.intersectObject(room, true);

            if (intersects.length > 0) {
                const hoveredObject = intersects[0].object;
                console.log(`Hovered Object: ${hoveredObject.name}`);

                if (!hoveredObject) {
                    return;
                }

                // 이전에 Hover된 오브젝트들의 크기를 원래대로 되돌림
                resetHoveredObjects();

                // 조건에 맞는 객체에 대해 스케일 조정 및 발광 효과 적용
                if (hoveredObject.name === "group_0" || hoveredObject.name.includes("group_1")) { // 양말
                    scaleAndEmissiveObjects(["group_0", "group_1"], 1.2); // 1.2배로 크기 증가
                } 
                else if (hoveredObject.name.includes("sofa")) { // 소파 그룹
                    scaleAndEmissiveObjectsByIncludes("sofa", 1.2); 
                }
                else if (hoveredObject.name === "leaves" || hoveredObject.name === "ChristmasTree" || 
                    hoveredObject.name === "g_Star012_25" || hoveredObject.name.includes("Sphere")) {
                    console.log(`Tree Hovered Object: ${hoveredObject.name}`); // 트리 오브젝트 이름 확인
                    scaleAndEmissiveObjectsByIncludes("ChristmasTree", 1.1); // 트리 관련 이름을 포함하는 모든 객체 처리
                    scaleAndEmissiveObjectsByIncludes("leaves", 1.1); // 트리 잎 부분
                    scaleAndEmissiveObjectsByIncludes("g_Star012_25", 1.2); // 별 장식
                    scaleAndEmissiveObjectsByIncludes("Sphere", 1.1); // 구형 장식
                }
            } else {
                // 마우스가 어떤 오브젝트 위에도 있지 않으면, 이전에 Hover된 오브젝트들의 크기를 원래대로 되돌림
                resetHoveredObjects();
            }
        }
    }

    // 여러 객체에 대해 스케일과 발광 효과를 적용하는 함수
    function scaleAndEmissiveObjects(objectNames, scaleMultiplier) {
        objectNames.forEach(objectName => {
            const object = room.getObjectByName(objectName);
            if (object) {
                scaleObjectAndApplyEmissive(object, scaleMultiplier);
            }
        });
    }

    // 이름에 포함된 모든 객체에 대해 스케일과 발광 효과를 적용하는 함수
    function scaleAndEmissiveObjectsByIncludes(namePart, scaleMultiplier) {
        room.traverse((object) => {
            if (object.name.includes(namePart)) {
                scaleObjectAndApplyEmissive(object, scaleMultiplier);
            }
        });
    }

    // 객체의 스케일을 조정하고 발광 효과를 적용하는 함수
    function scaleObjectAndApplyEmissive(object, scaleMultiplier) {
        // 객체의 원래 크기를 저장
        if (!originalScales.has(object)) {
            originalScales.set(object, object.scale.clone()); // 원래 스케일 저장
        }

        // 트리의 별 장식 처리
        if (object.name === "g_Star012_25") {
            
            // 별 장식의 원래 위치를 저장
            if (!originalPositions.has(object)) {
                originalPositions.set(object, object.position.clone()); // 원래 위치 저장
            }
            // 커졌을 때 별을 Y축으로 올리고, X축으로 약간 왼쪽으로 이동
            object.position.set(
                originalPositions.get(object).x - 500, // X축으로 왼쪽 이동 (음수 값)
                originalPositions.get(object).y + 80, // Y축으로 위로 이동 (양수 값)
                originalPositions.get(object).z
            );

            object.updateMatrixWorld();  // 행렬을 강제로 갱신

        }

        // 객체의 크기를 증가
        object.scale.set(
            originalScales.get(object).x * scaleMultiplier,
            originalScales.get(object).y * scaleMultiplier,
            originalScales.get(object).z * scaleMultiplier
        );

        // 발광 효과 적용
        applyEmissiveEffect(object, 0xffd700, 0.2); // 노란색 발광 효과
        previousHoveredObjects.push(object); // 현재 Hover된 객체 저장
    }

    // Hover된 오브젝트들의 크기 및 발광 효과를 원래대로 되돌림
    function resetHoveredObjects() {
        previousHoveredObjects.forEach(obj => {
            if (originalScales.has(obj)) {
                obj.scale.copy(originalScales.get(obj)); // 원래 스케일 복원
            }

            // 별 장식의 위치를 원래대로 복원
            if (obj.name === "g_Star012_25" && originalPositions.has(obj)) {
                obj.position.copy(originalPositions.get(obj)); // 원래 위치 복원
            }

            // 발광 효과 해제
            applyEmissiveEffect(obj, 0x000000, 0); // 발광 해제
        });
        previousHoveredObjects = [];
    }

    // 객체 발광 효과 함수
    function applyEmissiveEffect(object, emissiveColor, intensity) {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive = new THREE.Color(emissiveColor);
                child.material.emissiveIntensity = intensity;
            }
        });
    }

    // 마우스 업 이벤트 핸들러
    function onDocumentMouseUp(event) {
        const clickDuration = Date.now() - mouseDownTime;
        const CLICK_THRESHOLD = 300; // 클릭으로 인식할 최대 지속 시간 (ms)

        if (!isDragging && clickDuration < CLICK_THRESHOLD) {
            onDocumentClick(event);
        }
        
        isDragging = false;
    }

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);


    // resetBtn 클릭 이벤트 핸들러 추가
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        // 카드와 버튼 요소들을 숨기기
        const card = document.getElementById('fullscreenImage');
        const yesButton = document.getElementById('yesButton');
        const noButton = document.getElementById('noButton');
    
        if (card) card.style.display = 'none';
        if (yesButton) yesButton.style.display = 'none';
        if (noButton) noButton.style.display = 'none';

        // 게임 상태 초기화
        gameCnt = 3;  // 게임 횟수를 초기화합니다. 
    
        // 게임을 다시 시작하거나 페이지를 새로 고침
        location.reload();
    });

    // restartBtn 클릭 이벤트
    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        // 카드와 버튼 요소들을 숨기기
        const card = document.getElementById('fullscreenImage');
        const yesButton = document.getElementById('yesButton');
        const noButton = document.getElementById('noButton');
    
        if (card) card.style.display = 'none';
        if (yesButton) yesButton.style.display = 'none';
        if (noButton) noButton.style.display = 'none';

        // 게임 상태 초기화
        gameCnt = 3;  // 게임 횟수를 초기화합니다. 
    
        // 다시 warehouse.html로 
        location.href = "/warehouse.html";
    });

    // 우클릭시 초기화 시점으로 이동
    document.addEventListener('contextmenu', onDocumentRightClick, false);

    function onDocumentRightClick(event) {
        event.preventDefault(); 

        gsap.to(camera.position, {
            x: 1050, 
            y: 420, 
            z: 1350,
            duration: 1,
            onUpdate: function () {
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                controls.update(); 
            }
        });
    }

}
