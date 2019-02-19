import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols'
import * as TransformControls from 'three-transformcontrols'
import * as TWEEN from '@tweenjs/tween.js'
import ObjectControls from './libs/ObjectControls'
var camera, controls, controlsElement, scene, renderer, INTERSECTEDMOUSEDOWN, INTERSECTEDMOUSEUP, SELECTED;
var raycaster, mouse = { x : 0, y : 0 }, info;
var colors = ['#81d8d0', '#fff25d', '#3197e0']
const changeDuration = 700;
var items = [], flag, animation;
			init();
			animate();
			function init() {
            camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.set(600, 10, 2200);
            
            controls = new TrackballControls( camera, scene );
            controls.rotateSpeed = 1.2;        
            controls.zoomSpeed = 1.5;
			controls.panSpeed = 0.8;
			controls.noZoom = false;
			controls.noPan = false;
			controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.keys = [ 65, 83, 68 ];
            controls.target.set( 600, -150, 450 );
            controls.addEventListener( 'change', render );
            
				// world
            scene = new THREE.Scene();
            raycaster = new THREE.Raycaster();
				scene.background = new THREE.Color( '#54455C' );
				var geometry = new THREE.BoxGeometry( 400, 1, 300 );
				for ( var i = 0; i < 3; i ++ ) {
               for ( var j = 0; j < 3; j ++ ) {
                  for ( var k = 0; k < 3; k ++ ) {
                     var texture = new THREE.TextureLoader().load( 'textures/diag.jpg' );
                     var materials = [
                        // new THREE.MeshNormalMaterial(),
                        // new THREE.MeshBasicMaterial( { wireframe: true } ),
                        
                        new THREE.MeshBasicMaterial( { color: 'black' } ),
                        new THREE.MeshBasicMaterial( { color: 'black' } ),
                        new THREE.MeshBasicMaterial( { map: texture } ),
                        new THREE.MeshBasicMaterial( { color: colors[j] } ),
                        new THREE.MeshBasicMaterial( { color: 'black' } ),
                        new THREE.MeshBasicMaterial( { color: 'black' } ),
                     ];
                     var mesh = new THREE.Mesh( geometry, materials );
                     mesh.material.forEach(m => {
                        m.transparent = true;
                        m.opacity = 1;
                     })
                     mesh.position.x = i * 600;
                     mesh.position.y = - j * 200;
                     mesh.position.z = k * 500;
                     mesh.userData.column = i;
                     mesh.userData.layer = j;
                     mesh.userData.row = k;
                     mesh.userData.type = 'cubeElement';
                     mesh.updateMatrix();
                     mesh.matrixAutoUpdate = true;
                     scene.add( mesh );
                     items.push( mesh );
                  }
               }
				}
            var geometryC = new THREE.CylinderGeometry( 150, 150, 200, 32 );

            var geometryC = new THREE.CylinderGeometry( 150, 150, 200, 32 );
            for (var i = 0; i < 3; i++) {
               var materialC = new THREE.MeshBasicMaterial( { color: colors[i] } );
               var meshC = new THREE.Mesh( geometryC, materialC );
               meshC.position.x = 2000;
               meshC.position.y = -i*200;
               meshC.position.z = 500;
               meshC.userData.type = 'navColumnElement';
               meshC.userData.layer = i;
               meshC.updateMatrix();
               scene.add( meshC );
            }

            
            var geometryT = new THREE.BoxGeometry( 400, 300, 304 );
            var materialT = [
               new THREE.MeshBasicMaterial( { color: 'green', side: THREE.DoubleSide } ),
               new THREE.MeshBasicMaterial( { color: 'red',side: THREE.DoubleSide } ),
               new THREE.MeshBasicMaterial( { color: 'white', transparent:true, opacity: 0,side: THREE.DoubleSide }),
               new THREE.MeshBasicMaterial( { color: 'white', transparent:true, opacity: 0, side: THREE.DoubleSide } ),
               new THREE.MeshBasicMaterial( { color: 'gray',side: THREE.DoubleSide } ),
               new THREE.MeshBasicMaterial( { color: 'yellow',side: THREE.DoubleSide } ),
            ];

            // renderer
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
            renderer.domElement.addEventListener( 'dblclick', onDblClick, false );
            renderer.domElement.addEventListener("mousemove", () => flag = 1, false);
            renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );  
            document.body.appendChild( renderer.domElement );
            controlsElement = new TransformControls(camera, renderer.domElement);
            controlsElement.addEventListener( 'change', render );
            controlsElement.addEventListener( 'dragging-changed', function ( event ) {
                control.enabled = ! event.value;
            } );
            var meshT = new THREE.Mesh( geometryT, materialT );
            meshT.position.x = 2000;
            meshT.position.y = -600;
            meshT.position.z = 499;
            meshT.userData.type = 'infoCube';
            meshT.userData.layer = 1;
            meshT.updateMatrix();
            meshT.matrixAutoUpdate = false;
            scene.add( meshT );
            // controlsElement.attach( meshT );
            scene.add( controlsElement );
            var fullControlledMesh = new THREE.Mesh( geometryT, materialT );
            fullControlledMesh.position.x = 2000;
            fullControlledMesh.position.y = 300;
            fullControlledMesh.position.z = 500;
            fullControlledMesh.userData.type = 'fullControlled';
            fullControlledMesh.userData.layer = 1;
            fullControlledMesh.updateMatrix();
            scene.add( fullControlledMesh );
            var fullControlledMesh = new THREE.Mesh( geometryT, materialT );
            fullControlledMesh.position.x = 1000;
            fullControlledMesh.position.y = 300;
            fullControlledMesh.position.z = 500;
            fullControlledMesh.userData.type = 'fullControlled';
            fullControlledMesh.userData.layer = 1;
            fullControlledMesh.updateMatrix();
            scene.add( fullControlledMesh );
            controlsElement.attach( fullControlledMesh );
            var controlsT = new ObjectControls(camera, renderer.domElement, meshT);
            controlsT.setDistance(8, 15000); // set min - max distance for zoom
            controlsT.setZoomSpeed(1); // set zoom speed
				//
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
					}
				} );
				//
				render();
         }

         

         function onDblClick() {
            console.log('a');
         }

         function onMouseDown( e ) {
            flag = 0;
            mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

            raycaster.setFromCamera( mouse, camera );    

            var intersectsonMouseDown = raycaster.intersectObjects( scene.children );

            if ( intersectsonMouseDown.length > 0 ) {
               if (intersectsonMouseDown[ 0 ].object.userData.type === 'infoCube') {
                  intersectsonMouseDown[ 0 ].object.matrixAutoUpdate = true;
                  info = intersectsonMouseDown[ 0 ].object;
                  controls.enabled = false;
               }
               if (intersectsonMouseDown[ 0 ].object.userData.type === 'fullControlled') {
                    controlsElement.attach( intersectsonMouseDown[ 0 ].object );
                    if (INTERSECTEDMOUSEDOWN !== intersectsonMouseDown[ 0 ].object) {
                        animateCameraOnClickElement(intersectsonMouseDown[ 0 ].object);
                        INTERSECTEDMOUSEDOWN = intersectsonMouseDown[ 0 ].object;
                    }
                // intersectsonMouseDown[ 0 ].object.matrixAutoUpdate = true;
                // info = intersectsonMouseDown[ 0 ].object;
                // controls.enabled = false;
             }
            } else {
                  info = null;
            }     
         }

         function onMouseUp( e ) {
            controls.enabled = true;
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
                        animateCameraOnClickElement(INTERSECTEDMOUSEUP);
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
                        animateCameraToStartPos(INTERSECTEDMOUSEUP.userData.layer);
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
                  animateCameraToStartPos(1);
               }
            }
         }

         function animateCameraOnClickElement(INTERSECTEDMOUSEUP) {
            var fromControlsTarget = {
                        x: controls.target.x,
                        y: controls.target.y,
                        z: controls.target.z
                     };

                     var toControlsTarget = {
                        x: INTERSECTEDMOUSEUP.position.x,
                        y: INTERSECTEDMOUSEUP.position.y - 200,
                        z: INTERSECTEDMOUSEUP.position.z
                     };
                     var fromCameraPosition = {
                        x: camera.position.x,
                        y: camera.position.y,
                        z: camera.position.z
                     };

                     var toCameraPosition = {
                        x: INTERSECTEDMOUSEUP.position.x - 300,
                        y: INTERSECTEDMOUSEUP.position.y + 200,
                        z: INTERSECTEDMOUSEUP.position.z + 500
                     };
                     controls.reset();
                     var tweenControlsTarget = new TWEEN.Tween(fromControlsTarget)
                        .to(toControlsTarget, changeDuration )
                        .easing(TWEEN.Easing.Linear.None)
                        .onUpdate(function () {
                           controls.target.set(this._object.x, this._object.y, this._object.z);
                        })
                        .start()

                     var tweenCameraPosition = new TWEEN.Tween(fromCameraPosition)
                        .to(toCameraPosition, changeDuration)
                        .easing(TWEEN.Easing.Linear.None)
                        .onUpdate(function () {
                           camera.position.set(this._object.x, this._object.y, this._object.z);
                        })
                        .start() 
         }

         function animateCameraToStartPos(k) {
            var fromControlsTarget = {
               x: controls.target.x,
               y: controls.target.y,
               z: controls.target.z
            };

            var toControlsTarget = {
               x: 600,
               y: k*-150,
               z: 450
            };
            var fromCameraPosition = {
               x: camera.position.x,
               y: camera.position.y,
               z: camera.position.z
            };

            var toCameraPosition = {
               x: 600,
               y: 400 - k*150,
               z: 2200
            };
            controls.reset();
            var tweenControlsTarget = new TWEEN.Tween(fromControlsTarget)
                  .to(toControlsTarget, changeDuration )
                  .easing(TWEEN.Easing.Linear.None)
                  .onUpdate(function () {
                     controls.target.set(this._object.x, this._object.y, this._object.z);
                  })
                  .start()
            var tweenCameraPosition = new TWEEN.Tween(fromCameraPosition)
               .to(toCameraPosition, changeDuration)
               .easing(TWEEN.Easing.Linear.None)
               .onUpdate(function () {
                  camera.position.set(this._object.x, this._object.y, this._object.z);
               })
               .start()
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
