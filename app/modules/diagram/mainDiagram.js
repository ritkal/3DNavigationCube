import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { connect } from "react-redux";
import 'babel-polyfill';
import React from 'react';
import meta from '../../meta';
import DiagramBuilder from '../../libs/DiagramBuilder';
import cameraAnimation from '../../libs/animateCameraService';
import ObjectControls from '../../libs/ObjectControls';
import * as TransformControls from 'three-transformcontrols';
import OrbitControls from 'three-orbitcontrols';

const changeMode = obj => ({ type: 'NAVIGATE', obj });
function mapDispatchToProps(dispatch) {
    return {
        changeMode: mode => dispatch(changeMode(mode))
    };
  }

  const mapStateToProps = (state, ownProps) => {
    return { state };
  };

class Diagram extends React.Component {
    constructor(props) {
      super(props);
      this.mode = meta.modes.groupObserver;

      this.items = [];
      this.mouse = {
          x: 0,
          y: 0
      };
      this.delay = 200;
      this.prevent = false;
      this.groups = [];
      this.modules = [];
      this.names = [];
      this.start = this.start.bind(this)
      this.stop = this.stop.bind(this)
      this.__animate = this.__animate.bind(this)
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.state.state !== newProps.state.state) {
            // this.setState(newProps.mode);
        }
        let navPos;
        const state = newProps.state.state;

        if (!state && this.modules.lenght === 0) return;

        if (state.mode === 'Group' && state.group.toString() ) {
            this.removeInfo();
            if (state.layer.toString() && state.row.toString() && state.column.toString()) {
               this.fullState(state);
               return;
            }
            if (state.layer.toString()) {
               this.layerState(state);
               return;
            }
            if (!state.group.toString()) {
               const group = this.groups.find(item => item.uuid === this.INTERSECTEDMOUSEUP.userData.groupUuid);
               this.currentModule = this.modules.find(item => item.group === group);
                  this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start(); 
               this.cameraAnimate.animateToLayer(this.diagramCenter, 1);
            } else {
               let currentGroup;
               if (this.currentModule) {
                  currentGroup = this.currentModule.group;
               }
               const group = this.groups.find(item => item.uuid === state.group.toString());
   
               if ( currentGroup && currentGroup !== group.uuid) {
                  const currentNewNavPos = this.currentModule.pos;
                  const currentNavPos = this.currentModule.group.position;
                  new TWEEN.Tween(currentNavPos)
                  .to(currentNewNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     currentGroup.position.x = currentNavPos.x;
                     currentGroup.position.y = currentNavPos.y;
                     currentGroup.position.z = currentNavPos.z;
                  })
                  .start(); 
               }
               this.currentModule = this.modules.find(item => item.group === group);
                  this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start(); 
               this.cameraAnimate.animateToLayer(this.diagramCenter, 1);
               this.items.forEach(item => {
                  item.material.forEach(m => {
                     m.opacity = 1;
                 });
               });
               this.columnItems.forEach(item => {
                  item.material.opacity = 1;
               });
            }
         }
         if (state.mode === 'Global') {
            if (this.currentModule) {
                this.mode = 'Global';
                this.removeInfo();
                this.cameraAnimate.animateToLayer(this.diagramCenter, 1);
                let newNavPos = this.currentModule.pos;
                this.items.forEach(item => {
                item.material.forEach(m => {
                    m.opacity = 1;
                });
                });
                this.columnItems.forEach(item => {
                item.material.opacity = 1;
                });
                this.items = [];
                // for(var k=0; k<this.textLabels.length; k++){
                //     this.textLabels[k].element.hidden = true;
                // }
            
                navPos = this.currentModule.group.position;
                this.module = this.currentModule;
                new TWEEN.Tween(navPos)
                    .to(newNavPos, 1000)
                    .easing(TWEEN.Easing. Quadratic.Out)
                    .onUpdate(() => {
                        this.module.group.position.x = navPos.x;
                        this.module.group.position.y = navPos.y;
                        this.module.group.position.z = navPos.z;
                    })
                    .start(); 
                this.currentModule = null;
            }
         }
         if (state.mode === 'Info') {
            this.removeInfo();
            let navPos;
            if (this.currentModule) {
               if (this.currentModule.group.uuid === state.group.toString()) {
                  this.INTERSECTEDMOUSEUP = this.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
                     (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
               } else {
                  var currentGroup = this.currentModule.group;
                  const group = this.groups.find(item => item.uuid === state.group.toString());
      
                  const currentNewNavPos = this.currentModule.pos;
                  const currentNavPos = this.currentModule.group.position;
                  new TWEEN.Tween(currentNavPos)
                  .to(currentNewNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     currentGroup.position.x = currentNavPos.x;
                     currentGroup.position.y = currentNavPos.y;
                     currentGroup.position.z = currentNavPos.z;
                  })
                  .start(); 
                  this.currentModule = this.modules.find(item => item.group === group);
                  this.INTERSECTEDMOUSEUP = this.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
                  (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
                     this.mode = 'Group';
                     const newNavPos = {
                        x: 0,
                        y: 0,
                        z: 0,
                     };
                  this.items = this.currentModule.items;
                  // this.textLabels = this.currentModule.texts;
                  this.columnItems = this.currentModule.columnItems;
                  navPos = group.position;
                  new TWEEN.Tween(navPos)
                     .to(newNavPos, 1000)
                     .easing(TWEEN.Easing. Quadratic.Out)
                     .onUpdate(() => {
                        group.position.x = navPos.x;
                        group.position.y = navPos.y;
                        group.position.z = navPos.z;
                     })
                     .start();
               }
            } else {
               const group = this.groups.find(item => item.uuid === state.group.toString());
               this.currentModule = this.modules.find(item => item.group === group);
               this.INTERSECTEDMOUSEUP = this.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
               (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
                  this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start();
            }
            this.mode = 'Info';
            this.controls.enabled = false;
            if (!this.INTERSECTEDMOUSEDBL) {
               this.INTERSECTEDMOUSEDBL = this.items.find(item => (item.userData.layer.toString() === state.layer) && (item.userData.row.toString() === state.row) && (item.userData.column.toString() === state.column));
            }
            if ((this.INTERSECTEDMOUSEDBL.userData.layer.toString() !== state.layer.toString()) || (this.INTERSECTEDMOUSEDBL.userData.row.toString() !== state.row.toString()) || (this.INTERSECTEDMOUSEDBL.userData.column.toString() !== state.column.toString())) {
               this.INTERSECTEDMOUSEDBL = this.items.find(item => (item.userData.layer.toString() === state.layer.toString()) && (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()));
            }
            this.createInfo();
            this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEDBL, 'elDblClick');
         }
    }

    fullState(state) {
        let navPos;
        if (this.currentModule) {
            if (this.currentModule.group.uuid === state.group.toString()) {
               this.INTERSECTEDMOUSEUP = this.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
                  (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
            } else {
               var currentGroup = this.currentModule.group;
               const group = this.groups.find(item => item.uuid === state.group.toString());
   
               const currentNewNavPos = this.currentModule.pos;
               const currentNavPos = this.currentModule.group.position;
               new TWEEN.Tween(currentNavPos)
               .to(currentNewNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  currentGroup.position.x = currentNavPos.x;
                  currentGroup.position.y = currentNavPos.y;
                  currentGroup.position.z = currentNavPos.z;
               })
               .start(); 
               this.currentModule = this.modules.find(item => item.group === group);
               this.INTERSECTEDMOUSEUP = this.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
               (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
                  this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start();
            }
         } else {
            const group = this.groups.find(item => item.uuid === state.group.toString());
            this.currentModule = this.modules.find(item => item.group === group);
            if (!this.currentModule) return;
        
            this.INTERSECTEDMOUSEUP = this.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
               (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
            this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start(); 
            //    this.cameraAnimate.animateToLayer(this.diagramCenter, 1);
            //    this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEUP, 'elClick');
         }
        //  this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEUP, 'elClick');
         this.items.forEach(item => {
            if (item.userData.column === this.INTERSECTEDMOUSEUP.userData.column && item.userData.row === this.INTERSECTEDMOUSEUP.userData.row) {
                item.material.forEach(m => {
                    m.opacity = 1;
                });
            } else {
                item.material.forEach(m => {
                    m.opacity = 0.3;
                });
            }
         });
         this.columnItems.forEach(item => {
               item.material.opacity = 1;
         });
    }

    layerState(state) {
        let navPos;
        // const state = this.state;
        if (this.currentModule) {
            if (this.currentModule.group.uuid === state.group.toString()) {
                this.INTERSECTEDMOUSEUP = this.currentModule.columnItems.find(item=>(item.userData.layer.toString() === state.layer.toString()) && (item.parent.uuid === state.group));
            } else {
               var currentGroup = this.currentModule.group;
               const group = this.groups.find(item => item.uuid === state.group.toString());
   
               const currentNewNavPos = this.currentModule.pos;
               const currentNavPos = this.currentModule.group.position;
               new TWEEN.Tween(currentNavPos)
               .to(currentNewNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  currentGroup.position.x = currentNavPos.x;
                  currentGroup.position.y = currentNavPos.y;
                  currentGroup.position.z = currentNavPos.z;
               })
               .start(); 
               this.currentModule = this.modules.find(item => item.group === group);
               this.INTERSECTEDMOUSEUP = this.currentModule.columnItems.find(item=>(item.userData.layer.toString() === state.layer.toString()) && (item.parent.uuid === state.group));

                  this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start();
            }
         } else {
            const group = this.groups.find(item => item.uuid === state.group.toString());
            this.currentModule = this.modules.find(item => item.group === group);
            this.INTERSECTEDMOUSEUP = this.currentModule.columnItems.find(item=>(item.userData.layer.toString() === state.layer.toString()) && (item.parent.uuid === state.group));
            this.mode = 'Group';
                  const newNavPos = {
                     x: 0,
                     y: 0,
                     z: 0,
                  };
               this.items = this.currentModule.items;
               // this.textLabels = this.currentModule.texts;
               this.columnItems = this.currentModule.columnItems;
               navPos = group.position;
               new TWEEN.Tween(navPos)
                  .to(newNavPos, 1000)
                  .easing(TWEEN.Easing. Quadratic.Out)
                  .onUpdate(() => {
                     group.position.x = navPos.x;
                     group.position.y = navPos.y;
                     group.position.z = navPos.z;
                  })
                  .start(); 
         }
         this.cameraAnimate.animateToLayer(this.diagramCenter, this.INTERSECTEDMOUSEUP.userData.layer);
        this.columnItems.forEach(item => {
            if (item === this.INTERSECTEDMOUSEUP) {
                item.material.opacity = 1;
            } else {
                item.material.opacity = 0.3;
            }
        });
        this.items.forEach(item => {
            if (item.userData.layer === this.INTERSECTEDMOUSEUP.userData.layer) {
                item.material.forEach(m => {
                    m.opacity = 1;
                });
            } else {
                item.material.forEach(m => {
                    m.opacity = 0.3;
                });
            }
        });
     }
  
     removeInfo() {
        if (this.CURRENTINFOCUBE) {
           this.currentModule.group.remove(this.CURRENTINFOCUBE);
           this.CURRENTINFOCUBE = null;
           this.controls.enabled = true;
        }
     }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
      }
    
      start() {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.__animate)
        }
      }
    
      stop() {
        cancelAnimationFrame(this.frameId)
      }

    async componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
    
        this.camera = new THREE.PerspectiveCamera(90, width / height, 1, 100000);

        this.start()

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.domElement.setAttribute('id', 'diagram');
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height)
        this.renderer.domElement.addEventListener('mouseup',(e) => this.__onMouseUpDispatecher(e), false);
        this.renderer.domElement.addEventListener('dblclick',(e) => this.__onDblClick(e), false);
        this.renderer.domElement.addEventListener("mousemove", (e) =>  this.__onMouseMove(e), false);
        this.renderer.domElement.addEventListener('mousedown',(e) => this.__onMouseDown(e), false);
        this.mount.appendChild(this.renderer.domElement)
        this.contaier = this.mount;

        // Camera controls            
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.5;

        this.controls.enablePan = true;
	    this.controls.panSpeed = 1.0;
        this.controls.enableKeys = false;
        this.controls.addEventListener('change',() => this.__renderScene());
        // world
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.scene.background = new THREE.Color('#1E90FF');
        this.navGroup1 = new THREE.Group();
        this.groups.push(this.navGroup1);
        this.navGroup2 = new THREE.Group();
        this.groups.push(this.navGroup2);
        this.navGroup3 = new THREE.Group();
        this.groups.push(this.navGroup3);

        // Build diagram
        this.diagramBuilder = new DiagramBuilder(this.navGroup1, this.camera);
        // this.diagramBuilder.setElemntLength(600);
        this.diagramBuilder.setOffset({
            x: 400,
            y: 800,
            z: 200
        });
        let builderOut = await this.diagramBuilder.createCubeElements({
            x: 0,
            y: 500,
            z: -6000,
        }, 'THREE');
        this.currentModule = builderOut;
        this.items = builderOut.items;
        // this.textLabels = builderOut.texts;
        this.columnItems = builderOut.columnItems;
        builderOut.builder = this.diagramBuilder;
        this.names.push(builderOut.name);
        this.modules.push(builderOut);

        // this.diagramBuilder2 = new DiagramBuilder(this.navGroup2, this.camera);
        // this.diagramBuilder2.setElemntLength(600);
        // this.diagramBuilder2.setOffset({
        //     x: 0,
        //     y: 500,
        //     z: 200
        // });
        // this.navGroup2.position.x = -5000;
        // this.navGroup2.position.y = 500;
        // this.navGroup2.position.z = -6000;
        // builderOut = await this.diagramBuilder2.createCubeElements({
        //     x: -5000,
        //     y: 500,
        //     z: -6000,
        // }, 'ONE');
        // builderOut.builder = this.diagramBuilder2;
        // this.names.push(builderOut.name);
        // this.modules.push(builderOut);

        // this.diagramBuilder3 = new DiagramBuilder(this.navGroup3, this.camera);
        // this.diagramBuilder3.setElemntLength(600);
        // this.diagramBuilder3.setOffset({
        //     x: 400,
        //     y: 500,
        //     z: 200
        // });
        // this.navGroup3.position.x = 0;
        // this.navGroup3.position.y = 500;
        // this.navGroup3.position.z = -6000;
        // builderOut = await this.diagramBuilder3.createCubeElements({
        //     x: 0,
        //     y: 50,
        //     z: -6000,
        // }, 'TWO');
        // builderOut.builder = this.diagramBuilder3;
        // this.names.push(builderOut.name);
        // this.modules.push(builderOut);

        this.diagramCenter = this.diagramBuilder.getDiagramCenter();

        this.controls.target.set(this.diagramCenter.x, this.diagramCenter.y, this.diagramCenter.z);
        this.camera.position.set(this.diagramCenter.x, 100, 2200);
        this.__addWindowListeners();
        this.scene.add(this.navGroup1);
        this.scene.add(this.navGroup2);
        this.scene.add(this.navGroup3);


        this.__renderScene();

        // Complex element controls
        this.cameraAnimate = new cameraAnimation(this.camera, this.controls);

        this.controlsElement = new TransformControls(this.camera, this.renderer.domElement);
        this.controlsElement.addEventListener('change', this.__renderScene);
        this.controlsElement.addEventListener('dragging-changed', function (event) {
            this.control.enabled = !event.value;
        });
        this.__change({
            mode: 'Group',
            group: this.navGroup1.uuid,
            layer: '',
            row: '',
            column: ''
        });
        this.__change({
            mode: 'Group',
            group: this.navGroup1.uuid,
            layer: '',
            row: '',
            column: ''
        });
        // controlsElement.attach( meshT );
        // scene.add( controlsElement );

        // var fullControlledMesh = new THREE.Mesh( geometryT, materialT );
        // fullControlledMesh.position.x = 2000;
        // fullControlledMesh.position.y = 300;
        // fullControlledMesh.position.z = 500;
        // fullControlledMesh.userData.type = 'fullControlled';
        // fullControlledMesh.userData.layer = 1;
        // fullControlledMesh.updateMatrix();
        // scene.add( fullControlledMesh );
        // var fullControlledMesh = new THREE.Mesh( geometryT, materialT );
        // fullControlledMesh.position.x = 1000;
        // fullControlledMesh.position.y = 300;
        // fullControlledMesh.position.z = 500;
        // fullControlledMesh.userData.type = 'fullControlled';
        // fullControlledMesh.userData.layer = 1;
        // fullControlledMesh.updateMatrix();
        // scene.add( fullControlledMesh );
        // controlsElement.attach( fullControlledMesh );
    }

    __animate() {
        this.__renderScene();
        requestAnimationFrame(() => this.__animate());
        TWEEN.update();
        this.controls.update();
    }

    __change(state) {
        // this.setState(state);
        this.props.changeMode(state);
    }

    __addWindowListeners() {
        // Complex control listeners
        window.addEventListener('resize', () => this.__onWindowResize(), false);
        window.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 81: // Q
                this.controlsElement.setSpace(this.controlsElemenct.space === "local" ? "world" : "local");
                    break;
                case 17: // Ctrl
                this.controlsElement.setTranslationSnap(100);
                this.controlsElement.setRotationSnap(THREE.Math.degToRad(15));
                    break;
                case 87: // W
                this.controlsElement.setMode("translate");
                    break;
                case 69: // E
                this.controlsElement.setMode("rotate");
                    break;
                case 82: // R
                this.controlsElement.setMode("scale");
                    break;
                case 187:
                case 107: // +, =, num+
                this.controlsElement.setSize(this.controlsElement.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                this.controlsElement.setSize(Math.max(this.controlsElement.size - 0.1, 0.1));
                    break;
                case 88: // X
                this.controlsElement.showX = !this.controlsElement.showX;
                    break;
                case 89: // Y
                this.controlsElement.showY = !this.controlsElement.showY;
                    break;
                case 90: // Z
                this.controlsElement.showZ = !this.controlsElement.showZ;
                    break;
                case 32: // Spacebar
                this.controlsElement.enabled = !this.controlsElement.enabled;
                    break;
            }
        });
        window.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 27: // ESC
                    if ( this.mode !== meta.modes.globalObserver ) {
                        this.mode = meta.modes.groupObserver;
                        if (this.INTERSECTEDMOUSEDBL) {
                            this.__change({
                                mode: 'Group',
                                group: this.currentModule.group.uuid,
                                layer: this.INTERSECTEDMOUSEDBL.userData.layer,
                                row: this.INTERSECTEDMOUSEDBL.userData.row,
                                column: this.INTERSECTEDMOUSEDBL.userData.column
                            });
                            this.INTERSECTEDMOUSEDBL = null;
                            // for(var i=0; i<this.textLabels.length; i++) {
                            //     this.textLabels[i].element.hidden = false;
                            // }
                        } else {
                            this.__change({
                                mode: 'Group',
                                group: this.currentModule.group.uuid,
                                layer: '',
                                row: '',
                                column: ''
                            });
                        }
                    }
                    break;
                case 192: // `
                    if (this.mode === meta.modes.infoObserver || this.mode === meta.modes.globalObserver) {
                        return;
                    }
                    this.items = [];
                    this.mode = meta.modes.globalObserver;
                    this.__change({
                        mode: 'Global',
                        group: '',
                        layer: '',
                        row: '',
                        column: ''
                    });

                    break;
            }
        });
    }

    __renderScene() {
        if (this.modules) {
            this.modules.forEach(item => item.builder.faceLabel());
        }
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    render() {
        return (
          <div
            style={{ width: '100%', height: '1000px' }}
            ref={(mount) => { this.mount = mount }}
          />
        )
      }
    __onWindowResize() {
        this.camera.aspect = this.mount.offsetWidth / this.mount.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.mount.offsetWidth,this.mount.offsetHeight);
        this.__renderScene();
    }

    __onMouseMove(e) {
        if (e.target.id === 'diagram') {
            this.flag = 1;
        }
    }

    __onMouseUpDispatecher(e) {
        if (e.target.id === 'diagram') {
            if (this.mode === meta.modes.globalObserver) {
                this.__onMouseUpGlobal(e);
            }
            if (this.mode === meta.modes.groupObserver) {
                this.__onMouseUpGroup(e);
            }
        }
    }

    async __onDblClick(e) {
        clearTimeout(this.timer);
        if (this.mode === meta.modes.groupObserver) {
            this.prevent = true;
            if (this.flag === 0) {
                this.mouse.x = (e.clientX / this.mount.offsetWidth) * 2 - 1;
                this.mouse.y = -(e.clientY /this.mount.offsetHeight) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);
                const arr = [];
                this.groups.forEach(el => {
                    el.children.forEach(ch => arr.push(ch));
                });
                var intersects = this.raycaster.intersectObjects(arr);

                if (intersects.length > 0) {
                    this.INTERSECTEDMOUSEDBL = intersects[0].object;
                    if (this.INTERSECTEDMOUSEDBL.userData.type === 'base') {
                        this.__change({
                            mode: 'Info',
                            group: this.INTERSECTEDMOUSEDBL.parent.uuid,
                            layer: this.INTERSECTEDMOUSEDBL.userData.layer,
                            row: this.INTERSECTEDMOUSEDBL.userData.row,
                            column: this.INTERSECTEDMOUSEDBL.userData.column
                        });

                        // for(var i=0; i<this.textLabels.length; i++) {
                        //     this.textLabels[i].element.hidden = true;
                        // }
                        this.items.forEach(item => {
                            if (item.userData.column === this.INTERSECTEDMOUSEDBL.userData.column && item.userData.row === this.INTERSECTEDMOUSEDBL.userData.row) {
                                item.material.forEach(m => {
                                    m.opacity = 1;
                                });
                            } else {
                                item.material.forEach(m => {
                                    m.opacity = 0.3;
                                });
                            }
                            this.columnItems.forEach(item => {
                                item.material.opacity = 1;
                            });
                        });
                        this.mode = meta.modes.infoObserver;
                    }
                } else {
                    this.INTERSECTEDMOUSEDBL = null;
                    this.items.forEach(item => {
                        item.material.forEach(m => {
                            m.opacity = 1;
                        });
                    });
                    this.columnItems.forEach(item => {
                        item.material.opacity = 1;
                    });
                }
            }
        }
    }

    __onMouseDown(e) {
        if (e.target.id === 'diagram') {
            if (this.mode === meta.modes.globalObserver || this.mode === meta.modes.groupObserver) {
                this.INTERSECTEDMOUSEDBL = null;
                this.flag = 0;
                this.mouse.x = (e.clientX / this.mount.offsetWidth) * 2 - 1;
                this.mouse.y = -(e.clientY / this.mount.offsetHeight) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);
                const arr = [];
                this.groups.forEach(el => {
                    el.children.forEach(ch => arr.push(ch));
                });
                var intersectsonMouseDown = this.raycaster.intersectObjects(arr);

                if (intersectsonMouseDown.length > 0) {
                    if (intersectsonMouseDown[0].object.userData.type === 'fullControlled') {
                        this.controlsElement.attach(intersectsonMouseDown[0].object);
                        if (this.INTERSECTEDMOUSEDOWN !== intersectsonMouseDown[0].object) {
                            cameraAnimation(intersectsonMouseDown[0].object);
                            this.INTERSECTEDMOUSEDOWN = intersectsonMouseDown[0].object;
                        }
                    }
                } else {
                    this.info = null;
                }
            }
        }
    }

    __onMouseUpGlobal(e) {      
            this.controls.enabled = true;
            this.timer = setTimeout(() => {
                if (!this.prevent) {
                    if (this.flag === 0) {
                        this.mouse.x = (e.clientX / this.mount.offsetWidth) * 2 - 1;
                        this.mouse.y = -(e.clientY / this.mount.offsetHeight) * 2 + 1;

                        this.raycaster.setFromCamera(this.mouse, this.camera);
                        const arr = [];
                        this.groups.forEach(el => {
                            el.children.forEach(ch => arr.push(ch));
                        });

                        var intersects = this.raycaster.intersectObjects(arr);

                        if (intersects.length > 0) {
                            if (this.INTERSECTEDMOUSEUP != intersects[0].object) {
                                this.INTERSECTEDMOUSEUP = intersects[0].object;
                                this.__change({
                                    mode: 'Group',
                                    group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                    layer: '',
                                    row: '',
                                    column: ''
                                });
                            }
                            this.mode = meta.modes.groupObserver;
                        }
                    }
                }
                this.prevent = false;
            }, this.delay);
    }
    

    async __onMouseUpGroup(e) {
            this.controls.enabled = true;
            this.timer = setTimeout(() => {
                if (!this.prevent) {
                    console.log(this.prevent, this.flag);
                    if (this.info) {
                        this.info.matrixAutoUpdate = false;
                    }
                    if (this.flag === 0) {
                        this.mouse.x = (e.clientX / this.mount.offsetWidth) * 2 - 1;
                        this.mouse.y = -(e.clientY / this.mount.offsetHeight) * 2 + 1;

                        this.raycaster.setFromCamera(this.mouse, this.camera);
                        const arr = [];
                        this.groups.forEach(el => {
                            el.children.forEach(ch => arr.push(ch));
                        });
                        var intersects = this.raycaster.intersectObjects(arr);
                        if (intersects.length > 0) {
                            console.log(this.INTERSECTEDMOUSEUP != intersects[0].object);
                                this.INTERSECTEDMOUSEUP = intersects[0].object;
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'base') {
                                    if (this.INTERSECTEDMOUSEUP.userData.isExpandable && 
                                        intersects[0].uv.x < 0.5 && intersects[0].uv.x > 0 && intersects[0].uv.y < 0.5 && intersects[0].uv.y > 0) {
                                        if ( !this.INTERSECTEDMOUSEUP.userData.isExpanded) {
                                            this.diagramBuilder.resizeWrapperVertical('+');
                                            this.diagramBuilder.resizeNavColumn(this.INTERSECTEDMOUSEUP.userData.layer, '+');
                                            this.INTERSECTEDMOUSEUP.userData.isExpanded = !this.INTERSECTEDMOUSEUP.userData.isExpanded;
                                            // this.INTERSECTEDMOUSEUP.userData.extensions.forEach(el => this.currentModule.group.add(el))
                                            this.currentModule.group.add(this.INTERSECTEDMOUSEUP.userData.extensions[0]);
                                            this.currentModule.group.remove(this.INTERSECTEDMOUSEUP.userData.extensions[1]);
                                            this.items.forEach(item => {
                                                if (item.userData.layer > this.INTERSECTEDMOUSEUP.userData.layer) {
                                                    const navPos = item.position;
                                                    var newNavPos = {
                                                        x: navPos.x,
                                                        y: navPos.y - 800,
                                                    }
                                                    new TWEEN.Tween(navPos)
                                                    .to(newNavPos, 1000)
                                                    .easing(TWEEN.Easing. Quadratic.Out)
                                                    .onUpdate(() => {
                                                        item.position.x = navPos.x;
                                                        item.position.y = navPos.y;
                                                        item.position.z = navPos.z;
                                                    })
                                                    .start();
                                                }
                                            });
                                                // this.diagramBuilder.createArchElementsHidden();
                                        } else  {
                                            this.diagramBuilder.resizeWrapperVertical('-');
                                            this.diagramBuilder.resizeNavColumn(this.INTERSECTEDMOUSEUP.userData.layer, '-');
                                            this.INTERSECTEDMOUSEUP.userData.isExpanded = !this.INTERSECTEDMOUSEUP.userData.isExpanded;
                                            // this.INTERSECTEDMOUSEUP.userData.extensions.forEach(el => this.currentModule.group.remove(el))
                                            this.currentModule.group.remove(this.INTERSECTEDMOUSEUP.userData.extensions[0]);

                                            this.items.forEach(item => {
                                                if (item.userData.layer > this.INTERSECTEDMOUSEUP.userData.layer) {
                                                    const navPos = item.position;
                                                    var newNavPos = {
                                                        x: navPos.x,
                                                        y: navPos.y + 800,
                                                    }
                                                    new TWEEN.Tween(navPos)
                                                    .to(newNavPos, 1000)
                                                    .easing(TWEEN.Easing. Quadratic.Out)
                                                    .onUpdate(() => {
                                                        item.position.x = navPos.x;
                                                        item.position.y = navPos.y;
                                                        item.position.z = navPos.z;
                                                    })
                                                    .start();
                                                }
                                            });
                                        }
                                    
                                    }
                                    this.__change({
                                        mode: 'Group',
                                        group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                        layer: this.INTERSECTEDMOUSEUP.userData.layer,
                                        row: this.INTERSECTEDMOUSEUP.userData.row,
                                        column: this.INTERSECTEDMOUSEUP.userData.column
                                    });
                                }
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'navColumnElement') {
                                    this.__change({
                                        mode: 'Group',
                                        group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                        layer: this.INTERSECTEDMOUSEUP.userData.layer,
                                        row: '',
                                        column: ''
                                    });
                                } 
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'wrapper') {
                                    this.__change({
                                        mode: 'Group',
                                        group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                        layer: '',
                                        row: '',
                                        column: ''
                                    });
                                }
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'extension') {
                                    this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEUP, 'elClick');
                                }
                            } else {
                                this.INTERSECTEDMOUSEUP = null;
                            }
                        } else {
                            this.items.forEach(item => {
                                item.material.forEach(m => {
                                    m.opacity = 1;
                                });
                            });
                            this.columnItems.forEach(item => {
                                item.material.opacity = 1;
                            });
                        }
                    }
                // }
                this.prevent = false;

            }, this.delay);
    }

    setMode(targetMode) {
        this.mode = targetMode;
    }

    getMode() {
        return mode;
    }

    async createInfo() {
        var size = {
            lenght: 400,
            height: 300,
            width: 400
        };
        this.CURRENTINFOCUBE = await this.currentModule.builder.createMesh(size, this.INTERSECTEDMOUSEDBL, 'infoCube');

        // Basic element controls (rotating around Y)
        var controlsT = new ObjectControls(this.camera, this.renderer.domElement, this.CURRENTINFOCUBE);
        controlsT.setDistance(0, 15000); // set min - max distance for zoom
        controlsT.setZoomSpeed(1); // set zoom speed
        this.CURRENTINFOCUBE.matrixAutoUpdate = true;

    }
}
const DiagramEl = connect(mapStateToProps, mapDispatchToProps)(Diagram);

export default DiagramEl;