import { Mesh } from "three";

import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";

export class Car extends Stuff{
    constructor(info){
        super(info);
        this.geometry = geo.pillar;
        this.material = mat.pillar;
        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth; 
        this.emptyObject = new info.three.Object3D();       
        /*
        cm1.gltfLoader.load(info.gltf, 
        glb=>{
            
            var meshs = [];
            this.emptyObject.position.set(0,0,0);
            this.emptyObject.rotation.set(0,0,0);
            this.modelMesh = glb.scene.children[0];
            this.modelMesh.scale.set(0.1, 0.1, 0.1); 
            this.modelMesh.position.set(0,0,0);
            this.modelMesh.rotation.set(0,Math.PI,0);
            
            var axesHelper = new info.three.AxesHelper(3);
            this.emptyObject.add(axesHelper);
            this.emptyObject.add(this.modelMesh);
            this.modelMesh.position.set(-0.15,0,0.05);
            
            
            
            cm1.scene.add(this.emptyObject);
            
        });
*/
        
        //this.setCannonBody();

    }
}