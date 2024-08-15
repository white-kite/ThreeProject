import { Mesh } from "three";
import * as THREE from 'three';
import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";
import {  Body, Sphere , Vec3  } from 'cannon-es';
import * as CANNON from 'cannon-es';
import gsap from 'gsap'
import { Particle1 } from './Particle1';

export class HolyWater extends Stuff{
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
        this.world = info.world2;       
        this.noActiveWorld = info.noActiveWorld;       
        
        
        const loader = new THREE.TextureLoader();

        this.holyWaterArray = [];

       
        var frameCount = 1;
       
       
         
        
		
        const tileNumber = String(8).padStart(3, '0');
        const texture = loader.load(`/models/kenney/item/potion/tile${tileNumber}.png`);
        this.holyWaterArray.push(texture);

              

        const spriteMaterial = new THREE.SpriteMaterial({ map: this.holyWaterArray[0] }); // 첫 번째 프레임으로 초기화

        this.sprite = new THREE.Sprite(spriteMaterial);
        this.sprite.position.set(0,2,0);
        
        this.sprite.material.side = THREE.DoubleSide;
        this.sprite.scale.set(0.5, 0.5, 0); // 스프라이트 크기 조정

        this.particle1Shape = new Sphere(1); // Radius 1
        this.particle1Body = new Body({ mass: 10, position: new Vec3(0, 1, 0) });
        this.particle1Body.addShape(this.particle1Shape);
        this.noActiveWorld.addBody(this.particle1Body);
        
        
        cm1.scene.add(this.sprite);
        //
        this.particle1 = new Particle1({three:this.three , world:this.world});
        this.particle1.hide(this.sprite);
        //this.setCannonBody();

    }
    getRandomValue() {
        const lowerMin = -5500;
        const lowerMax = -2501; // -2500은 포함하지 않기 때문에 -2501까지
        const upperMin = 2501; // 2500은 포함하지 않기 때문에 2501부터
        const upperMax = 5000;
    
        // 두 범위의 길이를 구합니다.
        const lowerRangeLength = lowerMax - lowerMin + 1;
        const upperRangeLength = upperMax - upperMin + 1;
        const totalRangeLength = lowerRangeLength + upperRangeLength;
    
        // 무작위 값을 생성하여 두 범위 중 하나를 선택합니다.
        const randomValue = Math.floor(Math.random() * totalRangeLength);
    
        if (randomValue < lowerRangeLength) {
            // Lower range
            return lowerMin + randomValue;
        } else {
            // Upper range
            return upperMin + (randomValue - lowerRangeLength);
        }
    }

    fireInTheHole(sprite){
        this.particle1Body.velocity.y = 0;
        this.particle1Body.velocity.x = 0;
        
        this.particle1Body.position.set(sprite.position.x,sprite.position.y,0);

        const min = -5500;
        const max = 5000;
        var power =  Math.floor(Math.random() * (max - min + 1)) + min;

        this.particle1Body.applyForce(new CANNON.Vec3(this.getRandomValue(),10000,0), this.particle1Body.position);
        this.particle1.show(this.sprite);

    }

    
    
    Animation(currentFrame , target , delta){
        this.particle1.Animation(currentFrame , target , delta);
        //this.particle1Body.velocity.y = 15;
        this.sprite.position.copy(this.particle1Body.position);       
        //this.sprite.rotation.copy(this.particle1Body.rotation);       
    // const speed = 7; // 0.01 단위당 이동        
        //this.sprite.material.map = this.holyWaterArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
    
    }
    
}