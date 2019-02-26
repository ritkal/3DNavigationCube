import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import meta from '../../meta';
import DiagramBuilder from '../../libs/DiagramBuilder';
import cameraAnimation from '../../libs/animateCameraService';
import ObjectControls from '../../libs/ObjectControls';
import * as TransformControls from 'three-transformcontrols';
import OrbitControls from 'three-orbitcontrols'


export default class Diagram {
    constructor() {
        this.mode = meta.modes.mainMode;

        this.items = [];
        this.mouse = {
            x: 0,
            y: 0
        };
        this.delay = 150;
        this.prevent = false;
    }

    __init() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

        // Camera controls            
        // this.controls = new TrackballControls(this.camera, this.scene);
        this.controls = new OrbitControls(this.camera);
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.5;
        this.controls.panSpeed = 1.0;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        this.controls.keys = [65, 83, 68];
        this.controls.addEventListener('change',() => this.__render());

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.addEventListener('mouseup',(e) => this.__onMouseUp(e), false);
        this.renderer.domElement.addEventListener('dblclick',(e) => this.__onDblClick(e), false);
        this.renderer.domElement.addEventListener("mousemove", (e) => this.flag = 1, false);
        this.renderer.domElement.addEventListener('mousedown',(e) => this.__onMouseDown(e), false);
        document.body.appendChild(this.renderer.domElement);

        // world
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.scene.background = new THREE.Color('#e6e6fa');

        var loader = new THREE.FontLoader();
        const font  = loader.load('fonts/font.json', (font) => {
            var geometry = new THREE.TextGeometry( '3Diagram', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 1
            } );
            var material = new THREE.MeshBasicMaterial( { color: '#ff32c8' } );
            this.meshLabel = new THREE.Mesh(geometry, material);
            this.meshLabel.position.x = 300;
            this.meshLabel.position.y = 300;
            this.meshLabel.position.z = 0;
            this.scene.add(this.meshLabel);
        });
        // Build diagram
        this.diagramBuilder = new DiagramBuilder(this.scene, this.camera);
        this.diagramBuilder.setElemntLength(600);
        this.diagramBuilder.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        const out = this.diagramBuilder.createCubeElements();
        this.items = out.items;
        this.textLabels = out.texts;
        this.diagramCenter = this.diagramBuilder.getDiagramCenter();

        this.controls.target.set(this.diagramCenter.x, this.diagramCenter.y, this.diagramCenter.z);
        this.camera.position.set(this.diagramCenter.x, 100, 2200);
        this.columnItems = this.diagramBuilder.createNavColumn();
        this.__addWindowListeners();

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
                case 17: // Ctrl
                this.controlsElement.setTranslationSnap(null);
                this.contcontrolsElementrol.setRotationSnap(null);
                    break;
                case 27: // ESC
                this.mode = 'main';
                this.controls.enabled = true;
                this.scene.remove(this.CURRENTINFOCUBE);
                if (this.INTERSECTEDMOUSEDBL) {
                    this.cameraAnimate.animateCameraOnClickElement( this.INTERSECTEDMOUSEDBL, meta.animateOn.click );
                    this.INTERSECTEDMOUSEDBL = null;
                } else {
                    this.cameraAnimate.animateToLayer( this.diagramCenter, 1 );
                }
                    break;
            }
        });
    }

    __render() {
        for(var i=0; i<this.textLabels.length; i++) {
            this.textLabels[i].updatePosition();
        }
        if (this.meshLabel) {
            this.meshLabel.quaternion.copy( this.camera.quaternion );
        }
        this.renderer.render(this.scene, this.camera);
    }

    __onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.controls.handleResize();
        this.__render();
    }

    __onDblClick(e) {
        clearTimeout(this.timer);
        if (this.mode === 'main') {
            this.controls.enabled = false;
            this.prevent = true;
            if (this.flag === 0) {
                this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);

                var intersects = this.raycaster.intersectObjects(this.scene.children);

                if (intersects.length > 0) {
                    this.INTERSECTEDMOUSEDBL = intersects[0].object;
                    if (this.INTERSECTEDMOUSEDBL.userData.type === 'cubeElement') {
                        this.items.forEach(item => {
                            if (item.userData.column === this.INTERSECTEDMOUSEDBL.userData.column && item.userData.row === this.INTERSECTEDMOUSEDBL.userData.row) {
                                item.material.forEach(m => {
                                    m.opacity = 1;
                                });
                            } else {
                                item.material.forEach(m => {
                                    m.opacity = 0.2;
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
                        this.CURRENTINFOCUBE = this.diagramBuilder.createMesh(size, this.INTERSECTEDMOUSEDBL, 'infoCube');

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
        if (this.mode === 'main') {
            this.INTERSECTEDMOUSEDBL = null;
            this.flag = 0;
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            var intersectsonMouseDown = this.raycaster.intersectObjects(this.scene.children);

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

    __onMouseUp(e) {
        if (this.mode === 'main') {
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

                        var intersects = this.raycaster.intersectObjects(this.scene.children);

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
                                                m.opacity = 0.2;
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
                                            item.material.opacity = 0.6;
                                        }
                                    });
                                    this.items.forEach(item => {
                                        if (item.userData.layer === this.INTERSECTEDMOUSEUP.userData.layer) {
                                            item.material.forEach(m => {
                                                m.opacity = 1;
                                            });
                                        } else {
                                            item.material.forEach(m => {
                                                m.opacity = 0.2;
                                            });
                                        }
                                    });
                                    this.cameraAnimate.animateToLayer(this.diagramCenter, this.INTERSECTEDMOUSEUP.userData.layer);
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