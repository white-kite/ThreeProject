import { Mesh } from "three";
import * as THREE from 'three';
import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";
import {  Body, Sphere , Vec3  } from 'cannon-es';
import * as CANNON from 'cannon-es';


export class Particle1 extends Stuff{
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
        this.world = info.world;     
        this.particleArray = [];

       
        var frameCount = 49;
       
       
         
        for (let i = 0; i < frameCount; i++) {
		
            const tileNumber = String(i).padStart(3, '0');
            const texture = loader.load(`/models/kenney/effect/particle1/tile${tileNumber}.png`);
            this.particleArray.push(texture);

        }

        const spriteMaterial = new THREE.SpriteMaterial({ map: this.particleArray[0] }); // 첫 번째 프레임으로 초기화

        this.sprite = new THREE.Sprite(spriteMaterial);
        this.sprite.position.set(0,0,0);
        
        this.sprite.material.side = THREE.DoubleSide;
        this.sprite.scale.set(3, 3, 0); // 스프라이트 크기 조정



        this.particle1Shape = new Sphere(0.5); // Radius 1
        this.particle1Body = new Body({ mass: 10, position: new Vec3(0, 1, 0) });
        this.particle1Body.name = "holyWater";        
        this.particle1Body.addShape(this.particle1Shape);
        this.world.addBody(this.particle1Body);


        cm1.scene.add(this.sprite);



    }

    Animation(currentFrame , target , delta){        
        const speed = 7; // 0.01 단위당 이동        
        this.sprite.material.map = this.particleArray[currentFrame]; // 다음 프레임으로 텍스처 업데이트
        
        this.particle1Body.position.copy(this.sprite.position);
       // console.log(this.particle1Body.position);
    }
    show(objec){
        this.sprite.visible = true;
        this.sprite.position.set(objec.position.x,objec.position.y,0);
        
    }
    hide(objec){
        this.sprite.visible = false;
        //this.sprite.position.set(objec.position);
    }
}