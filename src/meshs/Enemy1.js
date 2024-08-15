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

        this.giftArray = [];

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
            if(this.particle1Body.name="선물"){
                if(event.body.name == "산타") {
                    this.sprite.visible = false;
                }
            }
          });

        
        

        cm1.scene.add(this.sprite);
      

        //this.setCannonBody();

    }
    HitMe(damage){
        if(this.curHp > 0){
            this.curHp -= damage;
            if(this.curHp < 0){
                this.Dead();
            }
        }        
    }
    Dead(){               
        this.isDead = true;
        this.particle1Body.name="선물";        
        
        this.sprite.material.map = this.giftArray[0]; 
        //setTimeout(() => this.executeOnceAfterOneSecond(this.particle1Body), 1000);
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
                    
                    
                    this.curHp -= 0.1;
                    if(this.curHp>= 0){
                        this.attakFunc(this.curHp);
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