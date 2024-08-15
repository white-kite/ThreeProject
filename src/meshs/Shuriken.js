import { Mesh } from "three";
import * as THREE from 'three';
import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";
import {  Body, Sphere , Vec3  } from 'cannon-es';
import * as CANNON from 'cannon-es';
import gsap from 'gsap'


export class Shuriken extends Stuff{
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
        this.target = info.target;
        this.sprites = [];
        const loader = new THREE.TextureLoader();

        this.holyWaterArray = [];

       
        var frameCount = 1;
       
       
        var num =  Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        
		
        const tileNumber = String(8).padStart(3, '0');
        var texture = loader.load(`/models/kenney/item/weapon/shuriken0${num}.png`);        
        

              
        num =  Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const spriteMaterial1 = new THREE.SpriteMaterial({ map: loader.load(`/models/kenney/item/weapon/shuriken0${num}.png`) }); // 첫 번째 프레임으로 초기화
        num =  Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const spriteMaterial2 = new THREE.SpriteMaterial({ map: loader.load(`/models/kenney/item/weapon/shuriken0${num}.png`) }); // 첫 번째 프레임으로 초기화
         num =  Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const spriteMaterial3 = new THREE.SpriteMaterial({ map: loader.load(`/models/kenney/item/weapon/shuriken0${num}.png`) }); // 첫 번째 프레임으로 초기화
         num =  Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const spriteMaterial4 = new THREE.SpriteMaterial({ map: loader.load(`/models/kenney/item/weapon/shuriken0${num}.png`) }); // 첫 번째 프레임으로 초기화

        this.sprite = new THREE.Sprite(spriteMaterial1);
        this.sprite1 = new THREE.Sprite(spriteMaterial2);
        this.sprite2 = new THREE.Sprite(spriteMaterial3);
        this.sprite3 = new THREE.Sprite(spriteMaterial4);
                
        this.sprite.scale.set(0.5, 0.5, 0); // 스프라이트 크기 조정
        this.sprite1.scale.set(0.5, 0.5, 0); // 스프라이트 크기 조정
        this.sprite2.scale.set(0.5, 0.5, 0); // 스프라이트 크기 조정
        this.sprite3.scale.set(0.5, 0.5, 0); // 스프라이트 크기 조정
        

        this.sprite.position.set(0,2,0);
        this.sprite1.position.set(0,-2,0);
        
        this.sprite2.position.set(2,0,0);
        
        this.sprite3.position.set(-2,0,0);

        


        this.particle1Shape = new Sphere(1); // Radius 1
        this.particle1Body = new Body({ mass: 10, position: new Vec3(0, 1, 0) });
        this.particle1Body.addShape(this.particle1Shape);
        this.noActiveWorld.addBody(this.particle1Body);
        
        
        cm1.scene.add(this.sprite , this.sprite1 , this.sprite2 , this.sprite3);
        
        

    }
    
    Animation(currentFrame , target , delta){   
        


        console.log(this.sprite.position);
        //this.sprite.position.copy(this.particle1Body.position);               
    }
    
}