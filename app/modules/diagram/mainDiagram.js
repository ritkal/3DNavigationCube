import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import meta from '../../meta';
import DiagramBuilder from '../../libs/DiagramBuilder';
import cameraAnimation from '../../libs/animateCameraService';
import ObjectControls from '../../libs/ObjectControls';
import * as TransformControls from 'three-transformcontrols';
import OrbitControls from 'three-orbitcontrols';


export default class Diagram {
    constructor() {
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
    }

    __init() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);

        // Camera controls            
        this.controls = new OrbitControls(this.camera);
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.5;

        this.controls.enablePan = true;
	    this.controls.panSpeed = 1.0;

        this.controls.addEventListener('change',() => this.__render());

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.addEventListener('mouseup',(e) => this.__onMouseUpDispatecher(e), false);
        this.renderer.domElement.addEventListener('dblclick',(e) => this.__onDblClick(e), false);
        this.renderer.domElement.addEventListener("mousemove", (e) => this.flag = 1, false);
        this.renderer.domElement.addEventListener('mousedown',(e) => this.__onMouseDown(e), false);
        document.body.appendChild(this.renderer.domElement);

        // world
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.scene.background = new THREE.Color('#1E90FF');
        this.navGroup = new THREE.Group();
        this.groups.push(this.navGroup);
        this.cubeGroup = new THREE.Group();
        this.groups.push(this.cubeGroup);

        // Build diagram
        this.diagramBuilder = new DiagramBuilder(this.navGroup, this.camera);
        this.diagramBuilder.setElemntLength(600);
        this.diagramBuilder.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        let builderOut = this.diagramBuilder.createCubeElements({
            x: 5000,
            y: 1000,
            z: -6000,
        });
        this.currentModule = builderOut;
        this.items = builderOut.items;
        this.textLabels = builderOut.texts;
        this.columnItems = builderOut.columnItems;
        builderOut.builder = this.diagramBuilder;
        this.names.push(builderOut.name);
        this.modules.push(builderOut);


        this.diagramBuilder2 = new DiagramBuilder(this.cubeGroup, this.camera);
        this.diagramBuilder2.setElemntLength(600);
        this.diagramBuilder2.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        this.cubeGroup.position.x = -5000;
        this.cubeGroup.position.y = 1000;
        this.cubeGroup.position.z = -6000;
        builderOut = this.diagramBuilder2.createCubeElements({
            x: -5000,
            y: 1000,
            z: -6000,
        });
        builderOut.builder = this.diagramBuilder2;
        this.names.push(builderOut.name);
        this.modules.push(builderOut);

        this.diagramCenter = this.diagramBuilder.getDiagramCenter();

        this.controls.target.set(this.diagramCenter.x, this.diagramCenter.y, this.diagramCenter.z);
        this.camera.position.set(this.diagramCenter.x, 100, 2200);
        this.__addWindowListeners();
        this.scene.add(this.navGroup);
        this.scene.add(this.cubeGroup);

        this.__render();

        // Complex element controls
        this.cameraAnimate = new cameraAnimation(this.camera, this.controls);

        this.controlsElement = new TransformControls(this.camera, this.renderer.domElement);
        this.controlsElement.addEventListener('change', this.__render);
        this.controlsElement.addEventListener('dragging-changed', function (event) {
            this.control.enabled = !event.value;
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
        this.__render();
        requestAnimationFrame(() => this.__animate());
        TWEEN.update();
        this.controls.update();
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
                this.controlsElement.setSize(controlsElement.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                this.controlsElement.setSize(Math.max(controlsElement.size - 0.1, 0.1));
                    break;
                case 88: // X
                this.controlsElement.showX = !controlsElement.showX;
                    break;
                case 89: // Y
                this.controlsElement.showY = !controlsElement.showY;
                    break;
                case 90: // Z
                this.controlsElement.showZ = !controlsElement.showZ;
                    break;
                case 32: // Spacebar
                this.controlsElement.enabled = !controlsElement.enabled;
                    break;
            }
        });
        window.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 27: // ESC
                    if ( this.mode !== meta.modes.globalObserver ) {
                        this.mode = meta.modes.groupObserver;
                        this.controls.enabled = true;
                        this.currentModule.group.remove(this.CURRENTINFOCUBE);
                        if (this.INTERSECTEDMOUSEDBL) {
                            this.cameraAnimate.animateCameraOnClickElement( this.INTERSECTEDMOUSEDBL, meta.animateOn.click );
                            this.INTERSECTEDMOUSEDBL = null;
                            for(var i=0; i<this.textLabels.length; i++) {
                                this.textLabels[i].element.hidden = false;
                            }
                        } else {
                            this.cameraAnimate.animateToLayer( this.diagramCenter, 1 );
                        }
                    }
                    break;
                case 8: // Backspace
                    
                    if (this.mode === meta.modes.infoMode || this.mode === meta.modes.globalObserver) {
                        return;
                    }
                    this.items = [];
                    // this.textLabels = [];
                    // this.cameraAnimate.animateToLayer( {x:0, y:0, z:0}, 1 );
                    this.cameraAnimate.animateToLayer( this.diagramCenter, 1 );
                    this.mode = meta.modes.globalObserver;

                    let newNavPos = this.currentModule.pos;
                        for(var k=0; k<this.textLabels.length; k++){
                            this.textLabels[k].element.hidden = true;
                        }
                    
                    var navPos = this.currentModule.group.position;
                    new TWEEN.Tween(navPos)
                        .to(newNavPos, 1000)
                        .easing(TWEEN.Easing. Quadratic.Out)
                        .onUpdate(() => {
                            this.currentModule.group.position.x = navPos.x;
                            this.currentModule.group.position.y = navPos.y;
                            this.currentModule.group.position.z = navPos.z;
                        })
                        .start(); 
                    break;
            }
        });
    }

    __render() {
        if (this.mode !== meta.modes.globalObserver) {
            if (this.textLabels.length){
                for(var i=0; i<this.textLabels.length; i++) {
                    this.textLabels[i].element.hidden = false;
                    this.textLabels[i].updatePosition();
                }
            }
        } else {
            for(var j=0; j<this.textLabels.length; j++) {
                this.textLabels[j].element.hidden = true;
            }
        }
        this.modules.forEach(item => item.builder.faceLabel())

        this.renderer.render(this.scene, this.camera);
    }

    __onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.controls.handleResize();
        this.__render();
    }

    __onMouseUpDispatecher(e) {
        if (this.mode === meta.modes.globalObserver) {
            this.__onMouseUpGlobal(e);
        }
        if (this.mode === meta.modes.groupObserver) {
            this.__onMouseUpGroup(e);
        }
    }

    __onDblClick(e) {
        clearTimeout(this.timer);
        if (this.mode === meta.modes.groupObserver) {
            this.controls.enabled = false;
            this.prevent = true;
            if (this.flag === 0) {
                this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);
                const arr = [];
                this.groups.forEach(el => {
                    el.children.forEach(ch => arr.push(ch));
                });
                var intersects = this.raycaster.intersectObjects(arr);

                if (intersects.length > 0) {
                    this.INTERSECTEDMOUSEDBL = intersects[0].object;
                    if (this.INTERSECTEDMOUSEDBL.userData.type === 'cubeElement') {
                        for(var i=0; i<this.textLabels.length; i++) {
                            this.textLabels[i].element.hidden = true;
                        }
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
                        var size = {
                            lenght: 400,
                            height: 300,
                            width: 400
                        };
                        this.CURRENTINFOCUBE = this.currentModule.builder.createMesh(size, this.INTERSECTEDMOUSEDBL, 'infoCube');

                        // Basic element controls (rotating around Y)
                        var controlsT = new ObjectControls(this.camera, this.renderer.domElement, this.CURRENTINFOCUBE);
                        controlsT.setDistance(0, 15000); // set min - max distance for zoom
                        controlsT.setZoomSpeed(1); // set zoom speed
                        this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEDBL, meta.animateOn.dblClick);
                        this.mode = meta.modes.infoMode;
                        this.CURRENTINFOCUBE.matrixAutoUpdate = true;
                    }
                } else {
                    this.INTERSECTEDMOUSEDBL = null;
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
        }
    }

    __onMouseDown(e) {
        if (this.mode === meta.modes.globalObserver || this.mode === meta.modes.groupObserver) {
            this.INTERSECTEDMOUSEDBL = null;
            this.flag = 0;
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

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

    __onMouseUpGlobal(e) {
            this.controls.enabled = true;
            this.timer = setTimeout(() => {
                if (!this.prevent) {
                    if (this.flag === 0) {
                        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                        this.raycaster.setFromCamera(this.mouse, this.camera);
                        const arr = [];
                        this.groups.forEach(el => {
                            el.children.forEach(ch => arr.push(ch));
                        });

                        var intersects = this.raycaster.intersectObjects(arr);

                        if (intersects.length > 0) {
                            if (this.INTERSECTEDMOUSEUP != intersects[0].object) {
                                this.INTERSECTEDMOUSEUP = intersects[0].object;
                                const group = this.groups.find(item => item.uuid === this.INTERSECTEDMOUSEUP.userData.groupUuid);
                                this.currentModule = this.modules.find(item => item.group === group);
                                    this.mode = meta.modes.groupObserver;
                                    const newNavPos = {
                                        x: 0,
                                        y: 0,
                                        z: 0,
                                    };
                                this.items = this.currentModule.items;
                                this.textLabels = this.currentModule.texts;
                                this.columnItems = this.currentModule.columnItems;
                                var navPos = group.position;
                                new TWEEN.Tween(navPos)
                                    .to(newNavPos, 1000)
                                    .easing(TWEEN.Easing. Quadratic.Out)
                                    .onUpdate(() => {
                                        group.position.x = navPos.x;
                                        group.position.y = navPos.y;
                                        group.position.z = navPos.z;
                                    })
                                    .start(); 
                            } else {
                                this.INTERSECTEDMOUSEUP = null;
                            }
                            this.mode = meta.modes.groupObserver;
                            this.cameraAnimate.animateToLayer( this.diagramCenter, 1 );
                        }
                    }
                }
                this.prevent = false;
            }, this.delay);
    }
    

    __onMouseUpGroup(e) {
            this.controls.enabled = true;
            this.timer = setTimeout(() => {
                if (!this.prevent) {
                    if (this.info) {
                        this.info.matrixAutoUpdate = false;
                    }
                    if (this.flag === 0) {
                        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                        this.raycaster.setFromCamera(this.mouse, this.camera);
                        const arr = [];
                        this.groups.forEach(el => {
                            el.children.forEach(ch => arr.push(ch));
                        });
                        var intersects = this.raycaster.intersectObjects(arr);

                        if (intersects.length > 0) {
                            if (this.INTERSECTEDMOUSEUP != intersects[0].object) {
                                this.INTERSECTEDMOUSEUP = intersects[0].object;
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'cubeElement') {
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
                                    this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEUP, meta.animateOn.click);
                                }
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'navColumnElement') {
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
                                    this.cameraAnimate.animateToLayer(this.diagramCenter, this.INTERSECTEDMOUSEUP.userData.layer);
                                } 
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'wrapper') {
                                    this.items.forEach(item => {
                                        item.material.forEach(m => {
                                            m.opacity = 1;
                                        });
                                    });
                                    this.columnItems.forEach(item => {
                                        item.material.opacity = 1;
                                    });
                                    this.cameraAnimate.animateToLayer(this.diagramCenter, 1);
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
                            this.cameraAnimate.animateToLayer(this.diagramCenter, 1);
                        }
                    }
                }
                this.prevent = false;
            }, this.delay);
    }

    setMode(targetMode) {
        this.mode = targetMode;
    }
    getMode() {
        return mode;
    }

    createDiagram() {
        this.__init();
        this.__animate();
    }
}