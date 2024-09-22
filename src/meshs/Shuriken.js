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
        this.damage = info.damage;
       
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

        for(var i = 1 ; i < 5 ; i++){
            this.objectVisible(false , i);
        }
       

        this.particleShape = new Sphere(1); // Radius 1
        this.particleBody = new Body({ mass: 10, position: new Vec3(0, 1, 0) });        
        this.particleBody.addShape(this.particleShape);
        this.world.addBody(this.particleBody);
        this.particleBody.addEventListener('collide', (event) => {            
            if(event.body.name == "enemy" && this.sprite.visible == true){                
                event.body.object.HitMe(this.damage);
            }          
          });

        this.particle1Shape = new Sphere(1); // Radius 1
        this.particle1Body = new Body({ mass: 10, position: new Vec3(0, 1, 0) });        
        this.particle1Body.addShape(this.particle1Shape);
        this.world.addBody(this.particle1Body);
        this.particle1Body.addEventListener('collide', (event) => {            
            if(event.body.name == "enemy" && this.sprite1.visible == true){
                event.body.object.HitMe(this.damage);
            }          
        });

        this.particle2Shape = new Sphere(1); // Radius 1
        this.particle2Body = new Body({ mass: 10, position: new Vec3(0, 1, 0) });        
        this.particle2Body.addShape(this.particle2Shape);
        this.world.addBody(this.particle2Body);
        this.particle2Body.addEventListener('collide', (event) => {            
            if(event.body.name == "enemy" && this.sprite2.visible == true){                    
                event.body.object.HitMe(this.damage);
            }          
            });

        this.particle3Shape = new Sphere(1); // Radius 1
        this.particle3Body = new Body({ mass: 10, position: new Vec3(0, 1, 0) });        
        this.particle3Body.addShape(this.particle3Shape);
        this.world.addBody(this.particle1Body);
        this.particle3Body.addEventListener('collide', (event) => {            
            if(event.body.name == "enemy" && this.sprite3.visible == true){                      
                event.body.object.HitMe(this.damage);
            }          
        });


        
        cm1.scene.add(this.sprite , this.sprite1 , this.sprite2 , this.sprite3);
        
        

    }
    
    Animation(currentFrame) {   
        this.particleBody.position.copy(this.sprite.position);        
        this.particle1Body.position.copy(this.sprite1.position);        
        this.particle2Body.position.copy(this.sprite2.position);        
        this.particle3Body.position.copy(this.sprite3.position);        
        const radius = 1.5; // 캐릭터와 스프라이트 사이의 거리
        const rotationSpeed = 0.002; // 회전 속도
        const angle = this.target.rotation.z + currentFrame * rotationSpeed;

        // 캐릭터의 현재 월드 위치를 계산
        const charWorldPosition = this.target.position;
        
        // 스프라이트 1 (오른쪽)
        this.sprite.position.set(
            charWorldPosition.x + radius * Math.cos(angle),
            charWorldPosition.y + radius * Math.sin(angle),
            charWorldPosition.z
        );
    
        // 스프라이트 2 (왼쪽)
        this.sprite1.position.set(
            charWorldPosition.x + radius * Math.cos(angle + Math.PI),
            charWorldPosition.y + radius * Math.sin(angle + Math.PI),
            charWorldPosition.z
        );
    
        // 스프라이트 3 (위쪽)
        this.sprite2.position.set(
            charWorldPosition.x + radius * Math.cos(angle + Math.PI / 2),
            charWorldPosition.y + radius * Math.sin(angle + Math.PI / 2),
            charWorldPosition.z
        );
    
        // 스프라이트 4 (아래쪽)
        this.sprite3.position.set(
            charWorldPosition.x + radius * Math.cos(angle - Math.PI / 2),
            charWorldPosition.y + radius * Math.sin(angle - Math.PI / 2),
            charWorldPosition.z
        );
    }

    objectVisible(visible , index){

        switch (index) {
            case 1:
                this.sprite.visible = visible;
                break;
            case 2:
                this.sprite1.visible = visible;
                break;
            case 3:
                this.sprite2.visible = visible;
                break;
            case 4:
                this.sprite3.visible = visible;
                break;
            default:
                // 모든 case와 일치하지 않을 때 실행될 코드
        }

    }
    
}