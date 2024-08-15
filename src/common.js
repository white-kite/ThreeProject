import { Scene, BoxGeometry, SphereGeometry, MeshPhongMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { World,Material } from "cannon-es";

export const cm1 = {
    scene: new Scene(),
    gltfLoader : new GLTFLoader(),
    mixrer: undefined,
    world: new World(),
    defaultMaterial : new Material('default'),
    glassMaterial : new Material('glass'),
    playerMaterial: new Material('plater')
};

export const cm2 = {
    step: 0,
    backgroundColor: '#3e1322',
    lightColor: '#ffe9ac',
    lightOffColor: '#222',
    floorColor:'#111',
    pillarColor:'#071d28',
    barColor: '#441c1d',
    glassColor: '#9fdfff'
};

export const geo = {
    floor:new BoxGeometry(200,1,200),
    pillar: new BoxGeometry(5,10,5),
    bar: new BoxGeometry(0.1, 0.3, 1.2 * 21),
};

export const mat = {

};

const normalSound = new Audio();


