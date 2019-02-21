import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import meta from '../../meta';
import DiagramBuilder from '../../libs/DiagramBuilder';
import cameraAnimation from '../../libs/animateCameraService';
import ObjectControls from '../../libs/ObjectControls';
import * as TransformControls from 'three-transformcontrols';

export default function () {
    let mode = meta.modes.mainMode;
    let controls, camera, renderer, scene, raycaster, diagramBuilder, diagramCenter, flag, INTERSECTEDMOUSEDBL, INTERSECTEDMOUSEDOWN, INTERSECTEDMOUSEUP, CURRENTINFOCUBE,
        timer, cameraAnimate, info, controlsElement;
    let items = [];
    let mouse = {
        x: 0,
        y: 0
    };
    const delay = 150;
    let prevent = false;

    function init() {
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        cameraAnimate = new cameraAnimation();

        // Camera controls            
        controls = new TrackballControls(camera, scene);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.5;
        controls.panSpeed = 1.0;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', render);

        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        renderer.domElement.addEventListener('dblclick', onDblClick, false);
        renderer.domElement.addEventListener("mousemove", () => flag = 1, false);
        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        document.body.appendChild(renderer.domElement);

        // world
        scene = new THREE.Scene();
        raycaster = new THREE.Raycaster();
        scene.background = new THREE.Color('#54455C');

        // Build diagram
        diagramBuilder = new DiagramBuilder(scene);
        diagramBuilder.setElemntLength(600);
        diagramBuilder.setOffset({
            x: 400,
            y: 500,
            z: 200
        });
        items = diagramBuilder.createCubeElements();
        diagramCenter = diagramBuilder.getDiagramCenter();

        controls.target.set(diagramCenter.x, diagramCenter.y, diagramCenter.z);
        camera.position.set(diagramCenter.x, 100, 2200);
        diagramBuilder.createNavColumn();
        addWindowListeners();
        render();

           // Complex element controls
   controlsElement = new TransformControls(camera, renderer.domElement);
   controlsElement.addEventListener('change', render);
   controlsElement.addEventListener('dragging-changed', function (event) {
      control.enabled = !event.value;
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

    function animate() {
        render();
        requestAnimationFrame(animate);
        TWEEN.update();
        controls.update();
    }

    function addWindowListeners() {
        // Complex control listeners
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case 81: // Q
                    controlsElement.setSpace(controlsElemenct.space === "local" ? "world" : "local");
                    break;
                case 17: // Ctrl
                    controlsElement.setTranslationSnap(100);
                    controlsElement.setRotationSnap(THREE.Math.degToRad(15));
                    break;
                case 87: // W
                    controlsElement.setMode("translate");
                    break;
                case 69: // E
                    controlsElement.setMode("rotate");
                    break;
                case 82: // R
                    controlsElement.setMode("scale");
                    break;
                case 187:
                case 107: // +, =, num+
                    controlsElement.setSize(controlsElement.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                    controlsElement.setSize(Math.max(controlsElement.size - 0.1, 0.1));
                    break;
                case 88: // X
                    controlsElement.showX = !controlsElement.showX;
                    break;
                case 89: // Y
                    controlsElement.showY = !controlsElement.showY;
                    break;
                case 90: // Z
                    controlsElement.showZ = !controlsElement.showZ;
                    break;
                case 32: // Spacebar
                    controlsElement.enabled = !controlsElement.enabled;
                    break;
            }
        });
        window.addEventListener('keyup', function (event) {
            switch (event.keyCode) {
                case 17: // Ctrl
                    controlsElement.setTranslationSnap(null);
                    contcontrolsElementrol.setRotationSnap(null);
                    break;
                case 27:
                    mode = 'main';
                    controls.enabled = true;
                    scene.remove(CURRENTINFOCUBE);
                    cameraAnimate.animateToLayer(camera, controls, diagramCenter, 1);
                    break;
            }
        });
    }

    function render() {
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
        render();
    }

    function onDblClick(e) {
        clearTimeout(timer);
        if (mode === 'main') {
            controls.enabled = false;
            prevent = true;
            if (flag === 0) {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);

                var intersects = raycaster.intersectObjects(scene.children);

                if (intersects.length > 0) {
                    INTERSECTEDMOUSEDBL = intersects[0].object;
                    if (INTERSECTEDMOUSEDBL.userData.type === 'cubeElement') {
                        var size = {
                            lenght: 400,
                            height: 300,
                            width: 400
                        };
                        CURRENTINFOCUBE = diagramBuilder.createMesh(size, INTERSECTEDMOUSEDBL.position, 'infoCube');

                        // Basic element controls (rotating around Y)
                        var controlsT = new ObjectControls(camera, renderer.domElement, CURRENTINFOCUBE);
                        controlsT.setDistance(8, 15000); // set min - max distance for zoom
                        controlsT.setZoomSpeed(1); // set zoom speed
                        cameraAnimate.animateToInfoCube(camera, controls, INTERSECTEDMOUSEDBL);
                        mode = 'infoCube';
                        CURRENTINFOCUBE.matrixAutoUpdate = true;
                    }
                } else {
                    INTERSECTEDMOUSEDBL = null;
                    cameraAnimate.animateToLayer(camera, controls, diagramCenter, 1);

                }
            }
        }
    }

    function onMouseDown(e) {
        if (mode === 'main') {
            flag = 0;
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            var intersectsonMouseDown = raycaster.intersectObjects(scene.children);

            if (intersectsonMouseDown.length > 0) {
                // if (intersectsonMouseDown[ 0 ].object.userData.type === 'infoCube') {
                //    intersectsonMouseDown[ 0 ].object.matrixAutoUpdate = true;
                //    info = intersectsonMouseDown[ 0 ].object;
                //    controls.enabled = false;
                // } else {
                //    scene.remove(CURRENTINFOCUBE);
                // }
                if (intersectsonMouseDown[0].object.userData.type === 'fullControlled') {
                    controlsElement.attach(intersectsonMouseDown[0].object);
                    if (INTERSECTEDMOUSEDOWN !== intersectsonMouseDown[0].object) {
                        cameraAnimation(camera, controls, intersectsonMouseDown[0].object);
                        INTERSECTEDMOUSEDOWN = intersectsonMouseDown[0].object;
                    }
                }
            } else {
                info = null;
                // scene.remove(CURRENTINFOCUBE);
            }
        }
    }

    function onMouseUp(e) {
        if (mode === 'main') {
            controls.enabled = true;
            timer = setTimeout(function () {
                if (!prevent) {
                    if (info) {
                        info.matrixAutoUpdate = false;
                    }
                    if (flag === 0) {
                        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                        raycaster.setFromCamera(mouse, camera);

                        var intersects = raycaster.intersectObjects(scene.children);

                        if (intersects.length > 0) {
                            if (INTERSECTEDMOUSEUP != intersects[0].object) {
                                INTERSECTEDMOUSEUP = intersects[0].object;
                                if (INTERSECTEDMOUSEUP.userData.type === 'cubeElement') {
                                    items.forEach(item => {
                                        if (item.userData.column === INTERSECTEDMOUSEUP.userData.column && item.userData.row === INTERSECTEDMOUSEUP.userData.row) {
                                            item.material.forEach(m => {
                                                m.opacity = 1;
                                            });
                                        } else {
                                            item.material.forEach(m => {
                                                m.opacity = 0.2;
                                            });
                                        }
                                    });
                                    cameraAnimate.animateCameraOnClickElement(camera, controls, INTERSECTEDMOUSEUP);
                                }
                                if (INTERSECTEDMOUSEUP.userData.type === 'navColumnElement') {
                                    items.forEach(item => {
                                        if (item.userData.layer === INTERSECTEDMOUSEUP.userData.layer) {
                                            item.material.forEach(m => {
                                                m.opacity = 1;
                                            });
                                        } else {
                                            item.material.forEach(m => {
                                                m.opacity = 0.2;
                                            });
                                        }
                                    });
                                    cameraAnimate.animateToLayer(camera, controls, diagramCenter, INTERSECTEDMOUSEUP.userData.layer);
                                }
                            } else {
                                INTERSECTEDMOUSEUP = null;
                            }
                        } else {
                            items.forEach(item => {
                                item.material.forEach(m => {
                                    m.opacity = 1;
                                });
                            });
                            cameraAnimate.animateToLayer(camera, controls, diagramCenter, 1);
                        }
                    }
                }
                prevent = false;
            }, delay);
        }
    }

    return {
        setMode: function (targetMode) {
            mode = targetMode;
        },
        getMode: function () {
            return mode;
        },
        createDiagram: function () {
            init();
            animate();
        }
    };
}