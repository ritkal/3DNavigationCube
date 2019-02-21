// import * as TWEEN from '@tweenjs/tween.js';
// import * as THREE from 'three';
// import * as TrackballControls from 'three-trackballcontrols';
// import * as TransformControls from 'three-transformcontrols';
// import cameraAnimation from './libs/animateCameraService';
// import DiagramBuilder from './libs/DiagramBuilder';
// import ObjectControls from './libs/ObjectControls';
import MainDiagram from './modules/diagram/mainDiagram';

createDiagram();

function createDiagram() {
   const diagram = new MainDiagram();
   diagram.createDiagram();
}