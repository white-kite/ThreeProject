import { Mesh } from "three";

import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";

export class Road2 extends Stuff{
    constructor(info){
        super(info);
        this.geometry = geo.pillar;
        this.material = mat.pillar;
        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth;        
        this.meshs = [];
        this.suc = false;
        /*
        cm1.gltfLoader.load('/models/kenney/road/untitled.glb', 
        glb=>{            
            cm1.gltfLoader.load('/models/kenney/road/road_bend.glb', 
                glb2=>{           
                
            this.modelMesh = glb.scene.children[0];
            
            
            this.modelMesh.position.set(this.x,this.y,this.z);
            this.meshs.push(this.modelMesh);

           
           
            this.meshs.forEach(function (mesh) {
                cm1.scene.add(mesh);
              });
              
            });
        });
        */
        

        
        //this.setCannonBody();

    }
}