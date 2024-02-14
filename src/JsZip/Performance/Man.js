import {
	AnimationMixer
} from 'three';

export class Man {
	constructor(info) {
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;

		// 처음에 안보이니까 false로 세팅
		this.visible = false;

		// glb 파일 로드해서 해당 위치에 로드하기
		info.gltfLoader.load(
			info.modelSrc,
			glb => {
				this.modelMesh = glb.scene.children[0];
				this.modelMesh.castShadow = true;
				this.modelMesh.position.set(this.x, this.y, this.z);
				info.scene.add(this.modelMesh);

				// 애니메이션 설정
				this.actions = [];

				this.mixer = new AnimationMixer(this.modelMesh);
				this.actions[0] = this.mixer.clipAction(glb.animations[0]);
				this.actions[0].play();
			}
		);

		
	}
}
