import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import * as $ from 'jquery';
import meta from '../../meta';
import DiagramBuilder from '../../libs/DiagramBuilder';
import cameraAnimation from '../../libs/animateCameraService';
import ObjectControls from '../../libs/ObjectControls';
import * as TransformControls from 'three-transformcontrols';
import OrbitControls from 'three-orbitcontrols';

const changeMode = obj => ({ type: 'NAVIGATE', obj });

export default class Diagram {
    constructor(options) {
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

    async __init() {
        this.container = $('#canvasDiagram');
        this.camera = new THREE.PerspectiveCamera(90, this.container.width() / this.container.height(), 1, 100000);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(this.container.width(), this.container.height());
        this.renderer.domElement.setAttribute('id', 'diagram');
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.addEventListener('mouseup',(e) => this.__onMouseUpDispatecher(e), false);
        this.renderer.domElement.addEventListener('dblclick',(e) => this.__onDblClick(e), false);
        this.renderer.domElement.addEventListener("mousemove", (e) =>  this.__onMouseMove(e), false);
        this.renderer.domElement.addEventListener('mousedown',(e) => this.__onMouseDown(e), false);
        $('#canvasDiagram').append(this.renderer.domElement);

        // Camera controls            
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.5;

        this.controls.enablePan = true;
	    this.controls.panSpeed = 1.0;
        this.controls.enableKeys = false;
        this.controls.addEventListener('change',() => this.__render());
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
        this.diagramBuilder.setElemntLength(600);
        this.diagramBuilder.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        let builderOut = await this.diagramBuilder.createCubeElements({
            x: 5000,
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

        this.diagramBuilder2 = new DiagramBuilder(this.navGroup2, this.camera);
        this.diagramBuilder2.setElemntLength(600);
        this.diagramBuilder2.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        this.navGroup2.position.x = -5000;
        this.navGroup2.position.y = 500;
        this.navGroup2.position.z = -6000;
        builderOut = await this.diagramBuilder2.createCubeElements({
            x: -5000,
            y: 500,
            z: -6000,
        }, 'ONE');
        builderOut.builder = this.diagramBuilder2;
        this.names.push(builderOut.name);
        this.modules.push(builderOut);

        this.diagramBuilder3 = new DiagramBuilder(this.navGroup3, this.camera);
        this.diagramBuilder3.setElemntLength(600);
        this.diagramBuilder3.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        this.navGroup3.position.x = 0;
        this.navGroup3.position.y = 500;
        this.navGroup3.position.z = -6000;
        builderOut = await this.diagramBuilder3.createCubeElements({
            x: 0,
            y: 50,
            z: -6000,
        }, 'TWO');
        builderOut.builder = this.diagramBuilder3;
        this.names.push(builderOut.name);
        this.modules.push(builderOut);

        this.diagramCenter = this.diagramBuilder.getDiagramCenter();

        this.controls.target.set(this.diagramCenter.x, this.diagramCenter.y, this.diagramCenter.z);
        this.camera.position.set(this.diagramCenter.x, 100, 2200);
        this.__addWindowListeners();
        this.scene.add(this.navGroup1);
        this.scene.add(this.navGroup2);
        this.scene.add(this.navGroup3);


        this.__render();

        // Complex element controls
        this.cameraAnimate = new cameraAnimation(this.camera, this.controls);

        this.controlsElement = new TransformControls(this.camera, this.renderer.domElement);
        this.controlsElement.addEventListener('change', this.__render);
        this.controlsElement.addEventListener('dragging-changed', function (event) {
            this.control.enabled = !event.value;
        });
        this.__change({
            mode: 'Group mode',
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
        this.__render();
        requestAnimationFrame(() => this.__animate());
        TWEEN.update();
        this.controls.update();
    }

    __change(some) {
        window.store.dispatch(changeMode(some));
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
                        // this.controls.enabled = true;
                        if (this.INTERSECTEDMOUSEDBL) {
                            this.__change({
                                mode: 'Group mode',
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
                                mode: 'Group mode',
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
                        mode: 'Global mode',
                        group: '',
                        layer: '',
                        row: '',
                        column: ''
                    });

                    break;
            }
        });
    }

    __render() {
        // if (this.mode !== meta.modes.globalObserver && this.mode !== meta.modes.infoObserver) {
        //     // if (this.textLabels && this.textLabels.length){
        //     //     for(var i=0; i<this.textLabels.length; i++) {
        //     //         this.textLabels[i].element.hidden = false;
        //     //         this.textLabels[i].updatePosition();
        //     //     }
        //     // }
        // } else {
        //     for(var j=0; j<this.textLabels.length; j++) {
        //         this.textLabels[j].element.hidden = true;
        //     }
        // }
        if (this.modules) {
            this.modules.forEach(item => item.builder.faceLabel());
        }
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    __onWindowResize() {
        this.camera.aspect = this.container.width() / this.container.height();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.width(), this.container.height());
        this.__render();
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
                this.mouse.x = (e.clientX / this.container.width()) * 2 - 1;
                this.mouse.y = -(e.clientY /this.container.height()) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);
                const arr = [];
                this.groups.forEach(el => {
                    el.children.forEach(ch => arr.push(ch));
                });
                var intersects = this.raycaster.intersectObjects(arr);

                if (intersects.length > 0) {
                    this.INTERSECTEDMOUSEDBL = intersects[0].object;
                    if (this.INTERSECTEDMOUSEDBL.userData.type === 'cubeElement') {
                        this.__change({
                            mode: 'Info mode',
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

                        // this.createInfo();
                        // this.cameraAnimate.animateCameraOnClickElement(this.INTERSECTEDMOUSEDBL, meta.animateOn.dblClick);
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
                this.mouse.x = (e.clientX / this.container.width()) * 2 - 1;
                this.mouse.y = -(e.clientY / this.container.height()) * 2 + 1;

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
                        this.mouse.x = (e.clientX / this.container.width()) * 2 - 1;
                        this.mouse.y = -(e.clientY / this.container.height()) * 2 + 1;

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
                                    mode: 'Group mode',
                                    group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                    layer: '',
                                    row: '',
                                    column: ''
                                });
                            } else {
                                this.INTERSECTEDMOUSEUP = null;
                            }
                            this.mode = meta.modes.groupObserver;
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
                        this.mouse.x = (e.clientX / this.container.width()) * 2 - 1;
                        this.mouse.y = -(e.clientY / this.container.height()) * 2 + 1;

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
                                    this.__change({
                                        mode: 'Group mode',
                                        group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                        layer: this.INTERSECTEDMOUSEUP.userData.layer,
                                        row: this.INTERSECTEDMOUSEUP.userData.row,
                                        column: this.INTERSECTEDMOUSEUP.userData.column
                                    });
                                    // this.items.forEach(item => {
                                    //     if (item.userData.column === this.INTERSECTEDMOUSEUP.userData.column && item.userData.row === this.INTERSECTEDMOUSEUP.userData.row) {
                                    //         item.material.forEach(m => {
                                    //             m.opacity = 1;
                                    //         });
                                    //     } else {
                                    //         item.material.forEach(m => {
                                    //             m.opacity = 0.3;
                                    //         });
                                    //     }
                                    // });
                                    // this.columnItems.forEach(item => {
                                    //     item.material.opacity = 1;
                                    // });

                                }
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'navColumnElement') {
                                    this.__change({
                                        mode: 'Group mode',
                                        group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                        layer: this.INTERSECTEDMOUSEUP.userData.layer,
                                        row: '',
                                        column: ''
                                    });
                                    // this.columnItems.forEach(item => {
                                    //     if (item === this.INTERSECTEDMOUSEUP) {
                                    //         item.material.opacity = 1;
                                    //     } else {
                                    //         item.material.opacity = 0.3;
                                    //     }
                                    // });
                                    // this.items.forEach(item => {
                                    //     if (item.userData.layer === this.INTERSECTEDMOUSEUP.userData.layer) {
                                    //         item.material.forEach(m => {
                                    //             m.opacity = 1;
                                    //         });
                                    //     } else {
                                    //         item.material.forEach(m => {
                                    //             m.opacity = 0.3;
                                    //         });
                                    //     }
                                    // });
                                } 
                                if (this.INTERSECTEDMOUSEUP.userData.type === 'wrapper') {
                                    // this.items.forEach(item => {
                                    //     item.material.forEach(m => {
                                    //         m.opacity = 1;
                                    //     });
                                    // });
                                    // this.columnItems.forEach(item => {
                                    //     item.material.opacity = 1;
                                    // });
                                    this.__change({
                                        mode: 'Group mode',
                                        group: this.INTERSECTEDMOUSEUP.parent.uuid,
                                        layer: '',
                                        row: '',
                                        column: ''
                                    });
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

    createDiagram() {
        this.__init();
        this.__animate();
    }
}