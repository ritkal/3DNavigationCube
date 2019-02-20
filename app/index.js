import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols'
import * as TransformControls from 'three-transformcontrols'
import * as TWEEN from '@tweenjs/tween.js'
import ObjectControls from './libs/ObjectControls'
import DiagramBuilder from './libs/DiagramBuilder'
import cameraAnimation from './libs/animateCameraService'

var camera, controls, controlsElement, scene, renderer, INTERSECTEDMOUSEDOWN, INTERSECTEDMOUSEUP, INTERSECTEDMOUSEDBL, CURRENTINFOCUBE, cameraAnimate, diagramBuilder, diagramCenter;
var raycaster, mouse = { x : 0, y : 0 }, info;
var colors = ['#81d8d0', '#fff25d', '#3197e0']
const changeDuration = 700;
var items = [], flag, timer = 0, delay = 200, prevent = false, animation, mode = 'main';
			init();
			animate();
			function init() {
            //Camera
            camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
            // camera.position.set(600, 10, 2200);
            cameraAnimate = new cameraAnimation()

            // Camera controls            
            controls = new TrackballControls( camera, scene );
            controls.rotateSpeed = 1.2;        
            controls.zoomSpeed = 1.5;
			   controls.panSpeed = 0.8;
			   controls.noZoom = false;
			   controls.noPan = false;
			   controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.keys = [ 65, 83, 68 ];
            controls.addEventListener( 'change', render );

            // renderer
			   renderer = new THREE.WebGLRenderer( { antialias: true } );
			   renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
            renderer.domElement.addEventListener( 'dblclick', onDblClick, false );
            renderer.domElement.addEventListener("mousemove", () => flag = 1, false);
            renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );

				// world
            scene = new THREE.Scene();
            raycaster = new THREE.Raycaster();
            scene.background = new THREE.Color( '#54455C' );
            
            // Build diagram
            diagramBuilder = new DiagramBuilder(scene);
            diagramBuilder.setElemntLength(600);
            diagramBuilder.setOffset({x:400, y:500, z:200})
            items = diagramBuilder.createCubeElements();
            diagramCenter = diagramBuilder.getDiagramCenter();
            controls.target.set( diagramCenter.x, diagramCenter.y, diagramCenter.z );
            camera.position.set(diagramCenter.x, 100, 2200);
            diagramBuilder.createNavColumn()
              
            document.body.appendChild( renderer.domElement );

            // Complex element controls
            controlsElement = new TransformControls(camera, renderer.domElement);
            controlsElement.addEventListener( 'change', render );
            controlsElement.addEventListener( 'dragging-changed', function ( event ) {
                control.enabled = ! event.value;
            } );

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

            // Rotating element
            var size = {
               lenght: 600,
               height: 400,
               width: 400
            };
            var pos = {
               x: 2000,
               y: -600, 
               z: 500
            }; 
            
            addWindowListeners();
				//
				render();
         }
         
         function addWindowListeners() {
				// Complex control listeners
            window.addEventListener( 'resize', onWindowResize, false );
            window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {
               case 81: // Q
                     controlsElement.setSpace( controlsElement.space === "local" ? "world" : "local" );
                  break;
               case 17: // Ctrl
                     controlsElement.setTranslationSnap( 100 );
                  controlsElement.setRotationSnap( THREE.Math.degToRad( 15 ) );
                  break;
               case 87: // W
                     controlsElement.setMode( "translate" );
                  break;
               case 69: // E
                     controlsElement.setMode( "rotate" );
                  break;
               case 82: // R
                     controlsElement.setMode( "scale" );
                  break;
               case 187:
               case 107: // +, =, num+
                     controlsElement.setSize( controlsElement.size + 0.1 );
                  break;
               case 189:
               case 109: // -, _, num-
                     controlsElement.setSize( Math.max( controlsElement.size - 0.1, 0.1 ) );
                  break;
               case 88: // X
                     controlsElement.showX = ! controlsElement.showX;
                  break;
               case 89: // Y
                     controlsElement.showY = ! controlsElement.showY;
                  break;
               case 90: // Z
                     controlsElement.showZ = ! controlsElement.showZ;
                  break;
               case 32: // Spacebar
                     controlsElement.enabled = ! controlsElement.enabled;
                  break;
            }
         } );
         window.addEventListener( 'keyup', function ( event ) {
            switch ( event.keyCode ) {
               case 17: // Ctrl
                  controlsElement.setTranslationSnap( null );
                  contcontrolsElementrol.setRotationSnap( null );
                  break;
               case 27:
                  mode = 'main';
                  controls.enabled = true;
                  scene.remove(CURRENTINFOCUBE);
                  cameraAnimate.animateToLayer(camera, controls, diagramCenter, 1);
                  break;
            }
         } );
         }

         function onDblClick(e) {
            clearTimeout(timer);
            if (mode === 'main') {
               controls.enabled = false;
               prevent = true;
               if (flag === 0) {
                  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
                  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

                  raycaster.setFromCamera( mouse, camera );    

                  var intersects = raycaster.intersectObjects( scene.children );

                  if ( intersects.length > 0 ) {
                     INTERSECTEDMOUSEDBL = intersects[ 0 ].object;
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
                        CURRENTINFOCUBE.matrixAutoUpdate = true
                     }
                  } else {
                     INTERSECTEDMOUSEDBL = null;
                     cameraAnimate.animateToLayer(camera, controls, diagramCenter, 1);

                  }
               }
            }
         }

         function onMouseDown( e ) {
            if (mode === 'main') {
               flag = 0;
               mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
               mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

               raycaster.setFromCamera( mouse, camera );    

               var intersectsonMouseDown = raycaster.intersectObjects( scene.children );

               if ( intersectsonMouseDown.length > 0 ) {
                  // if (intersectsonMouseDown[ 0 ].object.userData.type === 'infoCube') {
                  //    intersectsonMouseDown[ 0 ].object.matrixAutoUpdate = true;
                  //    info = intersectsonMouseDown[ 0 ].object;
                  //    controls.enabled = false;
                  // } else {
                  //    scene.remove(CURRENTINFOCUBE);
                  // }
                  if (intersectsonMouseDown[ 0 ].object.userData.type === 'fullControlled') {
                     controlsElement.attach( intersectsonMouseDown[ 0 ].object );
                     if (INTERSECTEDMOUSEDOWN !== intersectsonMouseDown[ 0 ].object) {
                           cameraAnimation(camera, controls, intersectsonMouseDown[ 0 ].object)
                           INTERSECTEDMOUSEDOWN = intersectsonMouseDown[ 0 ].object;
                     }
                  }
               } else {
                     info = null;
                     // scene.remove(CURRENTINFOCUBE);
               }   
            }  
         }

         function onMouseUp( e ) {
            if (mode === 'main') {
               controls.enabled = true;
               timer = setTimeout(function() {
                  if (!prevent) {
                     if (info) {
                        info.matrixAutoUpdate = false;
                  }
                  if (flag === 0) {
                     mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
                     mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      
                     raycaster.setFromCamera( mouse, camera );    
      
                     var intersects = raycaster.intersectObjects( scene.children );
      
                     if ( intersects.length > 0 ) {
                        if ( INTERSECTEDMOUSEUP != intersects[ 0 ].object) {
                           INTERSECTEDMOUSEUP = intersects[ 0 ].object;
                           if (INTERSECTEDMOUSEUP.userData.type === 'cubeElement') {
                              items.forEach(item => {
                                 if(item.userData.column === INTERSECTEDMOUSEUP.userData.column && item.userData.row === INTERSECTEDMOUSEUP.userData.row) {
                                    item.material.forEach(m => {
                                       m.opacity = 1;
                                    })
                                 } else {
                                    item.material.forEach(m => {
                                       m.opacity = 0.2;
                                    })
                                 }
                              })
                              cameraAnimate.animateCameraOnClickElement(camera, controls, INTERSECTEDMOUSEUP);
                           }
                           if (INTERSECTEDMOUSEUP.userData.type === 'navColumnElement') { 
                              items.forEach(item => {
                                 if(item.userData.layer === INTERSECTEDMOUSEUP.userData.layer) {
                                    item.material.forEach(m => {
                                       m.opacity = 1;
                                    })
                                 } else {
                                    item.material.forEach(m => {
                                       m.opacity = 0.2;
                                    })
                                 }
                              })
                              cameraAnimate.animateToLayer(camera, controls, diagramCenter, INTERSECTEDMOUSEUP.userData.layer);
                           }
                        } else {
                           INTERSECTEDMOUSEUP = null;
                        }
                     } else {
                        items.forEach(item => {
                              item.material.forEach(m => {
                                 m.opacity = 1;
                              })
                        })
                        cameraAnimate.animateToLayer(camera, controls, diagramCenter, 1);
                     }
                  }
                  }
                  prevent = false;
               }, delay);
            }
         }

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				controls.handleResize();
				render();
         }
         
			function animate() {
            render();
            requestAnimationFrame( animate );
            TWEEN.update();
				controls.update();			
         }
         
			function render() {
				renderer.render( scene, camera );
			}
