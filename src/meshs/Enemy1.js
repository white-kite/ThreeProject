import { Mesh } from "three";
import * as THREE from 'three';
import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";
import {  Body, Sphere , Vec3  } from 'cannon-es';
import * as CANNON from 'cannon-es';

export class Enemy1 extends Stuff{
    constructor(info){
        super(info);
        this.geometry = geo.pillar;
        this.material = mat.pillar;
        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth;        
        this.meshs = [];
        this.suc = false;
        this.three = info.three;
        const loader = new THREE.TextureLoader();
        this.enemyIdleArray = [];
        this.enemyWalkArray = [];
        this.enemyLeftWalkArray = [];
        this.enemyAttackArray = [];
        this.enemyLeftAttackArray = [];
        var frameCount = 6;
        this.attakFunc = info.attakFunc;
        this.world = info.world;
        this.hp = info.hp;       
        this.isDead = false;  
        this.curHp = this.hp;
        this.isInvincible = false; // 무적 상태를 나타내는 플래그
        this.giftArray = [];
        this.playerHp = info.playerHp;
        //음량 추가
         // Three.js에서 오디오 리스너 추가
         this.listener = new THREE.AudioListener();
         info.camera.add(this.listener); // 카메라에 오디오 리스너 추가
 
         // 오디오 객체 생성
         this.hitSound = new THREE.Audio(this.listener);
 
         // 오디오 로더로 소리 파일 로드
         

          // 사운드를 저장할 객체
        this.sounds = {};

        // 여러 개의 사운드를 로드하고 저장
        const audioLoader = new THREE.AudioLoader();

        audioLoader.load('/models/kenney/sound/hit1.mp3', (buffer) => {
            this.sounds['hit1'] = buffer;
        });

        audioLoader.load('/models/kenney/sound/die1.mp3', (buffer) => {
            this.sounds['die1'] = buffer;
        });


        //음량 추가


        for (let i = 0; i < frameCount; i++) {
		
            const texture = loader.load(`/models/kenney/character/enemy/enemy1/walkRight${i}.png`);
            
            this.enemyWalkArray.push(texture);

            const texture2 = loader.load(`/models/kenney/character/enemy/enemy1/walkLeft${i}.png`);
            this.enemyLeftWalkArray.push(texture2);
        }

        for (let i = 0; i < 12; i++) {
		
            const texture = loader.load(`/models/kenney/character/enemy/enemy1/attackRight${i}.png`);
            
            this.enemyAttackArray.push(texture);

        }

        for (let i = 0; i < 12; i++) {
		
            const texture = loader.load(`/models/kenney/character/enemy/enemy1/attackLeft${i}.png`);
            
            this.enemyLeftAttackArray.push(texture);

        }

        for (let i = 0; i < 3; i++) {		
            const texture = loader.load(`/models/kenney/item/gift/tile00${i}.png`);            
            this.giftArray.push(texture);
        }


        const spriteMaterial = new THREE.SpriteMaterial({ map: this.enemyIdleArray[0] }); // 첫 번째 프레임으로 초기화

        this.sprite = new THREE.Sprite(spriteMaterial);
        
        this.sprite.position.set(0,5,0);
        
        this.sprite.material.side = THREE.DoubleSide;        
        this.sprite.scale.set(1, 1, 0); // 스프라이트 크기 조정
        
        this.particle1Shape = new Sphere(0.5); // Radius 1
        this.particle1Body = new Body({ mass: 0, position: new Vec3(0, 1000, 0)});
        this.particle1Body.addShape(this.particle1Shape);
        this.particle1Body.name="enemy";    
        this.particle1Body.object=this;
        this.particle1Body.sprite = this.sprite;
        this.world.addBody(this.particle1Body);
        this.particle1Body.addEventListener('collide', (event) => {
            if(event.body.name == "사탕"){
                this.Dead();
            }
            if(this.particle1Body.name=="선물"){
                if(event.body.name == "산타") {
                    this.sprite.visible = false;
                }
            }
          });

        
         
        cm1.scene.add(this.sprite);
      

        //this.setCannonBody();

    }

    playSound(name) {
        if (this.sounds[name]) {
            this.hitSound.setBuffer(this.sounds[name]); // 해당 사운드를 할당
            this.hitSound.setVolume(0.5); // 볼륨 조정
            this.hitSound.play(); // 사운드 재생
        } else {
            console.warn(`Sound ${name} not found!`);
        }
    }

    HitMe(damage){        
        if (this.isInvincible) {
            return; // 무적 상태에서는 대미지를 무시
        }
        if (this.curHp > 0) {
            this.curHp -= damage;
            if (this.curHp <= 0) {
                this.Dead();
            } else {
                
                this.becomeInvincible(0.5); // 0.5초 동안 무적
            }
        }
    }

    becomeInvincible(duration) {
        this.isInvincible = true; // 무적 상태로 전환

        let blinkInterval;
        let blinkCount = 0;
        const maxBlinks = 5; // 0.5초 동안 깜박거림 (100ms 간격으로 5번)

        blinkInterval = setInterval(() => {
            this.sprite.visible = !this.sprite.visible; // 스프라이트 깜박거리기
            blinkCount++;            
            this.playSound('hit1'); // 대미지를 입었을 때 사운드 재생            
            if (blinkCount >= maxBlinks) {
                clearInterval(blinkInterval);
                this.sprite.visible = true; // 원래 상태로 복구                
            }
        }, 100); // 100ms마다 깜박임

        setTimeout(() => {
            this.isInvincible = false; // 무적 상태 해제
        }, duration * 1000); // 지정된 기간(0.5초) 후 무적 해제
    }

    Dead(){         
        this.hitSound.stop();
        this.playSound('die1'); // 대미지를 입었을 때 사운드 재생     
        this.isDead = true;
        this.particle1Body.name="선물";        
        
        this.sprite.material.map = this.giftArray[0]; 
        
    }
    
    executeOnceAfterOneSecond(particle1Body) {
        
    }

    Animation(currentFrame , target , delta){ 
       
        this.particle1Body.position.copy(this.sprite.position);        
        
        if(this.isDead == false){
            const speed = 0.7; // 0.01 단위당 이동
            const distance = this.sprite.position.distanceTo(target.position);

            if(distance < 1){            
                if(currentFrame == 3){
                    
                    
                    this.playerHp -= 0.1;
                    if(this.playerHp>= 0){
                        this.attakFunc(this.playerHp);
                    }
                }
                if(target.position.x <  this.sprite.position.x){
                    this.sprite.material.map = this.enemyLeftAttackArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
                }else{
                    this.sprite.material.map = this.enemyAttackArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
                }            
                return;
            }

            // 실제 이동 거리 계산
            const actualMovement = speed * Math.min(distance, 0.1); // 타겟과의 거리가 1보다 크면 1로 제한

            const direction = new THREE.Vector3().subVectors(target.position, this.sprite.position).normalize();
            // 이동 벡터 계산
            const movement = direction.multiplyScalar(actualMovement);
            // 현재 위치에 이동 벡터 추가
            this.sprite.position.add(movement);

            if(this.sprite.position.x > target.position.x){
                this.sprite.material.map = this.enemyLeftWalkArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
            }else{
                this.sprite.material.map = this.enemyWalkArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
            }
            

        }
        
        
        

    }
}