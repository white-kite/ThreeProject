import { Mesh } from "three";

import { cm1, geo, mat } from "../common";
import { Stuff } from "./Stuff";

export class Road extends Stuff{
    constructor(info){
        super(info);
        this.geometry = geo.pillar;
        this.material = mat.pillar;
        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth;        
        this.meshs = [];
        this.suc = false;
        

        
        //this.setCannonBody();

    }
}