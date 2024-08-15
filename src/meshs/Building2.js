import { Mesh } from "three";

import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";

export class Building2 extends Stuff{
    constructor(info){
        super(info);
        this.geometry = geo.pillar;
        this.material = mat.pillar;
        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth;        
        cm1.gltfLoader.load(info.gltf, 
        glb=>{
            var meshs = [];
            this.modelMesh = glb.scene.children[0];
            
            this.modelMesh.position.set(this.x,this.y,this.z);
            meshs.push(this.modelMesh);

          
            meshs.forEach(function (mesh) {
                cm1.scene.add(mesh);
              });
        });

        
        //this.setCannonBody();

    }
}