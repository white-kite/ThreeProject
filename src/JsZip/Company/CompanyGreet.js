import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 회사소개 - 인삿말 : CompanyGreetCanvas
// 2024-01-07 백재원, 최초 작성

export default function CompanyGreetCanvas() {
	// Renderer
	const canvas = document.querySelector('#CompanyGreetCanvas');
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
		100
	);
	camera.position.y = 1;
	camera.position.z = 1;
	scene.add(camera);

	// Light
	// MeshBasicMaterial은 조명이 필요 없다

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// CanvasTexture
	const texCanvas = document.createElement('canvas');
	const texContext = texCanvas.getContext('2d'); // Canvas에 그림을 그릴때 사용
	texCanvas.width = 2000;
	texCanvas.height = 2000;
	const canvasTexture = new THREE.CanvasTexture(texCanvas); // Canvas가 적용된 Texture가 만들어짐

	

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({
		
		map: canvasTexture
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta(); //시간차
		const time = clock.getElapsedTime();

		material.map.needsUpdate = true;

		// 배경색
		texContext.fillStyle = 'blue';
		texContext.fillRect(0, 0, 2000, 2000); // 이거 매테리얼보다 크기 줄이면 덜 그려지게 됨
		
		// 박스
		texContext.fillStyle = 'red';
		texContext.fillRect(0, (time * 60) % 2000, 2000, 2000); // x, y 위치, 가로, 세로 크기
		
		// 텍스트 그리기
		texContext.fillStyle = 'white';  // 하얀색으로 설정
		texContext.font = 'bold 50px sans-serif';
		texContext.fillText('안녕하세요.', 50, 200);
		texContext.fillText('(주)포위즈 시스템은 2000년 설립이래,', 50, 300);
		texContext.fillText('끊임없는 기술적 혁신과 비즈니스 확대에 대한 노력으로', 50, 400);
		texContext.fillText('IT 시장에 촉망받는 기업으로 인정받고 있습니다.', 50, 500);
		texContext.fillText('교육ㆍ금융ㆍ통신 분야의 SI 사업뿐 아니라,', 50, 600);
		texContext.fillText('솔루션 및 보안ㆍ클라우드ㆍ네트워크 서비스를 제공하며,', 50, 700);
		texContext.fillText('다양한 분야에서 축적된 풍부한 업무 경험과 기술 노하우,', 50, 800);
		texContext.fillText('전문 지식을 가진 인력을 통해 최상의 서비스를 제공하고 있습니다.', 50, 900);
		texContext.fillText('빠르게 진행되는 디지털 경제의 확산 시대에 발맞춰', 50, 1000);
		texContext.fillText('지속적인 기술혁신, 고부가가치의 신기술 도입을 통한', 50, 1100);
		texContext.fillText('우리 포위즈시스템만의 차별화된 기술로 고객 여러분께', 50, 1200);
		texContext.fillText('새로운 서비스를 제공 할 수 있도록 노력하겠습니다.', 50, 1300);
		texContext.fillText('앞으로 포위즈시스템 임지원 모두는', 50, 1400);
		texContext.fillText('고객과 함께 지속성장할 수 있는 고객의 성공 파트너로서,', 50, 1500);
		texContext.fillText('IT의 새로운 가치를 창조하는 Innovator로 자기매김 할 수 있도록', 50, 1600)
		texContext.fillText('최선을 다할 것을 약속드립니다.', 50, 1700)
		texContext.fillText('고객 여러분의 지속적인 관심과 성원 부탁드립니다.', 50, 1800)
		texContext.fillText('감사합니다.', 50, 1900)


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
