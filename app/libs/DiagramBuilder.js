import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import 'babel-polyfill';
import meta from '../meta';
import { throws } from 'assert';
const defaultCubeData = meta.data;
const colors = ['#63a884', '#fa8072', '#ffcc5c'];
const infoColors = ['#bae0cc', '#ffd8d3', '#fcebc4'];
export default function (group, camera, cubeElements) {
    this.textlabels = [];
    this.camera = camera;
    this.group = group;
    this.cubeElements = cubeElements || defaultCubeData;
    // this.exploredElements = [{
    //     x: {
    //         left: 0.4296,
    //         right: 0.5333
    //     },
    //     y: {
    //         top: 0.3307,
    //         bottom: 0.2481
    //     },
    //     id: 0
    // }];
    this.currentInfoCube = null;
    var items = [];
    var elemntSize = {
        length: 2000,
        width: 1500,
        height: 10
    };

    var offset = {
        x: 200,
        y: 500,
        z: 200
    };

    var getMaxLayer = function() {
        var obj = defaultCubeData.reduce(function(prev,cur) {
            return cur.layer>prev.layer?cur:prev;
        },{layer:-Infinity});
        return obj.layer;
    };

    var getMaxRow = function() {
        var obj = defaultCubeData.reduce(function(prev,cur) {
            return cur.row>prev.row?cur:prev;
        },{row:-Infinity});
        return obj.row;
    };
    var getMaxColumn = function() {
        var obj = defaultCubeData.reduce(function(prev,cur) {
            return cur.column>prev.column?cur:prev;
        },{column:-Infinity});
        return obj.column;
    };

    this.setElemntLength = function ( lenght ) {
        elemntSize.length = lenght;
    };

    this.setElemntWidth = function ( width ) {
        elemntSize.width = width;
    };

    this.setOffset = function ( newOffset ) {
        offset.x = newOffset.x;
        offset.y = newOffset.y;
        offset.z = newOffset.z;
    };

    this.createCubeElements = async function (pos, name) {
        const getTextures = ()=> new Promise((resolve, reject)=>{
            const manager = new THREE.LoadingManager(()=>resolve(textures));
            const loader = new THREE.TextureLoader(manager);
            const textures = [
              "textures/BP3D/Arch1.png",
              "textures/BP3D/Proc1.png",
              "textures/BP3D/Data1.png",
            ].map(filename=>loader.load(filename));
          });
          
          await getTextures().then(result=>{
            this.cubeElements.forEach(el => {
                const geometry = new THREE.BoxGeometry( elemntSize.length, elemntSize.height, elemntSize.width );

                var materials = [
                    new THREE.MeshBasicMaterial( { color: colors[el.layer] } ),
                    new THREE.MeshBasicMaterial( { color: colors[el.layer] } ),
                    new THREE.MeshBasicMaterial( { map: result[el.layer] } ),
                    new THREE.MeshBasicMaterial( { color: colors[el.layer] } ),
                    new THREE.MeshBasicMaterial( { color: colors[el.layer] } ),
                    new THREE.MeshBasicMaterial( { color: colors[el.layer] } ),
                 ];
                var mesh = new THREE.Mesh( geometry, materials );
                mesh.material.forEach(m => {
                   m.transparent = true;
                   m.opacity = 1;
                });
                mesh.position.x = 700 + el.column * ( elemntSize.length + offset.x );
                mesh.position.y = - el.layer * offset.y;
                mesh.position.z = el.row * ( elemntSize.width + offset.z);
                mesh.userData.column = el.column;
                mesh.userData.layer = el.layer;
                mesh.userData.row = el.row;
                mesh.userData.type = el.type;
                mesh.userData.isExpandable = el.isExpandable;
                mesh.userData.isExpanded = false;
                mesh.userData.groupUuid = this.group.uuid;
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = true;
                var text = this.__createTextLabel();
                text.setHTML(el.name);
                text.setParent(mesh);
                this.textlabels.push(text);
                document.body.appendChild(text.element);
                this.group.add( mesh );
                if (el.isExpandable) {
                    this.createArchElementsHidden(el.extensions).then(result =>
                        mesh.userData.extensions = result
                    ) 
                }
                items.push(mesh);
            });
        });
        this.sideWrappers = [];
        var planeGeo = new THREE.PlaneBufferGeometry( 1, 1 );
        // wrapper
		var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'black', transparent: true, opacity: 0.1 } ) );
        planeTop.position.y = 1000;
        planeTop.position.x = 1000;
        planeTop.rotateX( Math.PI / 2 );
        planeTop.userData.type = 'wrapper';
        planeTop.userData.groupUuid = this.group.uuid;
        planeTop.scale.set(3000.1, 3000.1, 1)
        this.group.add( planeTop );
                
        var planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'black', transparent: true, opacity: 0.1 } ) );
        planeBottom.position.y = -2000;
        planeBottom.position.x = 1000;
        planeBottom.rotateX( - Math.PI / 2 );
        planeBottom.userData.type = 'wrapper';
        planeBottom.userData.groupUuid = this.group.uuid;
        planeBottom.scale.set(3000.1, 3000.1, 1)
        this.group.add( planeBottom );
                
        var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'gray', transparent: true, opacity: 0.1 } ) );
        planeFront.position.x = 1000;
		planeFront.position.z = 1500;
		planeFront.position.y = -500;
        planeFront.rotateY( Math.PI );                planeFront.userData.type = 'wrapper';
        planeFront.userData.groupUuid = this.group.uuid;
        this.group.add( planeFront );
        planeFront.scale.set(3000.1, 3000.1, 1)
        this.sideWrappers.push(planeFront);

                
        var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.1 } ) );
		planeRight.position.x = 2500;
		planeRight.position.y = -500;
        planeRight.rotateY( - Math.PI / 2 );
        planeRight.userData.type = 'wrapper';
        planeRight.userData.groupUuid = this.group.uuid;
        this.group.add( planeRight );
        planeRight.scale.set(3000.1, 3000.1, 1)
        this.sideWrappers.push(planeRight);
                
        var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.1 } ) );
		planeLeft.position.x = - 500;
		planeLeft.position.y = -500;
		planeLeft.rotateY( Math.PI / 2 );
        planeLeft.userData.type = 'wrapper';
        planeLeft.userData.groupUuid = this.group.uuid;
        this.group.add( planeLeft );
        planeLeft.scale.set(3000.1, 3000.1, 1)
        this.sideWrappers.push(planeLeft);

        var planeBack = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'gray', transparent: true, opacity: 0.1 } ) );
        planeBack.position.x = 1000;
        planeBack.position.z = -1500;
        planeBack.position.y = -500;
        planeBack.userData.type = 'wrapper';
        planeBack.userData.groupUuid = this.group.uuid;
        this.group.add( planeBack );
        // this.createName(name);
        planeBack.scale.set(3000.1, 3000.1, 1)
        this.sideWrappers.push(planeBack);
        this.bottomWrapper = planeBottom;
        // this.Wrapper = planeTop;
         const columnItems = this.createNavColumn();
                
        return {
            items: items,
            texts: this.textlabels,
            group: this.group,
            columnItems,
            pos,
        };
    };

    this.resizeWrapperVertical = function(flag) {
        if (flag ==='+') {
            const pos = {
                y: this.bottomWrapper.position.y
            }
            const newPos = {
                y: this.bottomWrapper.position.y - offset.y
            }
            new TWEEN.Tween(pos)
            .to(newPos, 1000)
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(() => {
                this.bottomWrapper.position.y = pos.y            
            })
            .start();

            this.sideWrappers.forEach(el => {
                const tweenObj = {
                    posY: el.position.y,
                    scaleY: el.scale.y
                }

                const tweenNewObj ={
                    posY: el.position.y - offset.y/2,
                    scaleY: el.scale.y + offset.y
                }

                new TWEEN.Tween(tweenObj)
                    .to(tweenNewObj, 1000)
                    .easing(TWEEN.Easing. Quadratic.Out)
                    .onUpdate(() => {
                        el.scale.set(el.scale.x, tweenObj.scaleY, 1)
                        el.position.y = tweenObj.posY
                        
                    })
                    .start();
            })
        }
        if (flag ==='-') {
            const pos = {
                y: this.bottomWrapper.position.y
            }
            const newPos = {
                y: this.bottomWrapper.position.y + offset.y
            }
            new TWEEN.Tween(pos)
            .to(newPos, 1000)
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(() => {
                this.bottomWrapper.position.y = pos.y            
            })
            .start();

            this.sideWrappers.forEach(el => {
                const tweenObj = {
                    posY: el.position.y,
                    scaleY: el.scale.y
                }

                const tweenNewObj ={
                    posY: el.position.y + offset.y/2,
                    scaleY: el.scale.y - offset.y
                }

            new TWEEN.Tween(tweenObj)
                .to(tweenNewObj, 1000)
                .easing(TWEEN.Easing. Quadratic.Out)
                .onUpdate(() => {
                    el.scale.set(el.scale.x, tweenObj.scaleY, 1)
                    el.position.y = tweenObj.posY
                    
                })
                .start();

            })
        }
    }

    this.createArchElementsHidden = async function (arr) {
        const geometry = new THREE.BoxGeometry( elemntSize.length/2, elemntSize.height, elemntSize.width/2 );
        const out = [];
        const getTextures = ()=> new Promise((resolve, reject)=>{
            const manager = new THREE.LoadingManager(()=>resolve(textures));
            const loader = new THREE.TextureLoader(manager);
            const textures = [
              "textures/BP3D/Arch1-1.png",
              "textures/BP3D/Arch1-2.png",
              "textures/BP3D/Arch1-3.png",
              "textures/BP3D/Arch1-4.png",
            ].map(filename=>loader.load(filename));
          });
          await getTextures().then(result=>{
            arr.forEach(el => {
                var materials = [
                    new THREE.MeshBasicMaterial( { color: 'black' } ),
                    new THREE.MeshBasicMaterial( { color: 'black' } ),
                    new THREE.MeshBasicMaterial( { map: result[0] } ),
                    new THREE.MeshBasicMaterial( { color: 'black' } ),
                    new THREE.MeshBasicMaterial( { color: 'black' } ),
                    new THREE.MeshBasicMaterial( { color: 'black' } ),
                 ];
                var mesh = new THREE.Mesh( geometry, materials );
                mesh.material.forEach(m => {
                   m.transparent = true;
                   m.opacity = 1;
                });
                mesh.position.x = elemntSize.length * el.area.pos1.x + elemntSize.length/4;
                mesh.position.y = - 1 * offset.y;
                mesh.position.z =  elemntSize.width*el.area.pos1.z + elemntSize.width/4 - 200;
                mesh.userData.subLayer = el.subLayer;
                mesh.userData.type = el.type;
                mesh.userData.isExpandable = el.isExpandable;
                mesh.userData.isExpanded = false;
                mesh.userData.groupUuid = this.group.uuid;
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = true;
                var text = this.__createTextLabel();
                text.setHTML(el.name);
                text.setParent(mesh);
                this.textlabels.push(text);
                document.body.appendChild(text.element);
                out.push(mesh)
            });
        });
        return out;
    };

    this.createNavColumn = function () {
        var layersCount = getMaxLayer();
        this.columnItems = [];
        var geometryC = new THREE.CylinderGeometry( offset.y/3, offset.y/3, offset.y, 32 );
        for (var i = 0; i < layersCount + 1; i++) {
           var materialC = new THREE.MeshBasicMaterial( { color: colors[i] } );
           var meshC = new THREE.Mesh( geometryC, materialC );
           meshC.material.transparent = true;
           meshC.material.opacity = 1;
           meshC.position.x = 2100;
           meshC.position.y = -i*offset.y;
           meshC.position.z = 200;
           meshC.userData.type = 'navColumnElement';
           meshC.userData.layer = i;
           meshC.userData.groupUuid = this.group.uuid;
           meshC.updateMatrix();
           group.add( meshC );
           this.columnItems.push(meshC);
        }
        return this.columnItems;
    };

    this.resizeNavColumn = function(layer, flag) {
        const item  = this.columnItems[layer];
        if (flag ==='+') {
            const tweenObj = {
                posY: item.position.y,
                scaleY: item.scale.y
            }

            const tweenNewObj ={
                posY: item.position.y - offset.y/2,
                scaleY: item.scale.y*2
            }

            new TWEEN.Tween(tweenObj)
                .to(tweenNewObj, 1000)
                .easing(TWEEN.Easing. Quadratic.Out)
                .onUpdate(() => {
                    item.scale.set(item.scale.x, tweenObj.scaleY, 1)
                    item.position.y = tweenObj.posY
                    
                })
                .start();
            this.columnItems.forEach(el => {
                if (el !== item) {
                    const pos = {
                        y: el.position.y
                    }
                    const newPos = {
                        y: el.position.y - offset.y
                    }
                    new TWEEN.Tween(pos)
                    .to(newPos, 1000)
                    .easing(TWEEN.Easing. Quadratic.Out)
                    .onUpdate(() => {
                        el.position.y = pos.y            
                    })
                    .start();
                }
            })
        }        
        if (flag ==='-') {
            const tweenObj = {
                posY: item.position.y,
                scaleY: item.scale.y
            }
    
            const tweenNewObj ={
                posY: item.position.y + offset.y/2,
                scaleY: item.scale.y/2
            }
    
            new TWEEN.Tween(tweenObj)
                .to(tweenNewObj, 1000)
                .easing(TWEEN.Easing. Quadratic.Out)
                .onUpdate(() => {
                    item.scale.set(item.scale.x, tweenObj.scaleY, 1)
                    item.position.y = tweenObj.posY
                    
                })
                .start();
            this.columnItems.forEach(el => {
                if (el !== item) {
                    const pos = {
                        y: el.position.y
                    }
                    const newPos = {
                        y: el.position.y + offset.y
                    }
                    new TWEEN.Tween(pos)
                    .to(newPos, 1000)
                    .easing(TWEEN.Easing. Quadratic.Out)
                    .onUpdate(() => {
                        el.position.y = pos.y            
                    })
                    .start();
                }
            })
    
        }
    }

    this.createMesh = async function(size, obj, type) {
        var geometryT = new THREE.BoxGeometry( size.lenght, size.height, size.width );
        // const loadManager = new THREE.LoadingManager();
        const getTextures = ()=> new Promise((resolve, reject)=>{
            const manager = new THREE.LoadingManager(()=>resolve(textures));
            const loader = new THREE.TextureLoader(manager);
            const textures = [
              "textures/carts.jpg",
              "textures/column-charts.jpg",
            ].map(filename=>loader.load(filename));
          });
          
          await getTextures().then(result=>{
            var materialT = [
                new THREE.MeshBasicMaterial( { color: infoColors[obj.userData.layer],side: THREE.DoubleSide } ),
                new THREE.MeshBasicMaterial( { color: infoColors[obj.userData.layer],side: THREE.DoubleSide } ),
     
                new THREE.MeshBasicMaterial( { color: 'white', transparent: type==='infoCube'?true:false, opacity: 0.1,side: THREE.DoubleSide }),
                new THREE.MeshBasicMaterial( { color: 'white', transparent: type==='infoCube'?true:false, opacity: 0.1, side: THREE.DoubleSide } ),
                new THREE.MeshBasicMaterial( { map: result[0] , side: THREE.DoubleSide} ),
                new THREE.MeshBasicMaterial( { map: result[1] , side: THREE.DoubleSide} ),
             ];
             var meshT = new THREE.Mesh( geometryT, materialT );
             
             meshT.position.set(obj.position.x, obj.position.y - 200, obj.position.z);
             meshT.userData.type = 'infoCube';
             meshT.userData.layer = 1;
             meshT.updateMatrix();
             meshT.matrixAutoUpdate = false;
             this.currentInfoCube = meshT;
             this.group.add(this.currentInfoCube);
        });
        return this.currentInfoCube;
     };

     this.__createTextLabel = function() {
        var div = document.createElement('div');
        div.className = 'text-label';
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.height = 100;
        div.style.top = -1000;
        div.style.left = -1000;
        
        var _this = this;
        
        return {
          element: div,
          parent: false,
          position: new THREE.Vector3(0,0,0),
          setHTML: function(html) {
            this.element.innerHTML = html;
          },
          setParent: function(threejsobj) {
            this.parent = threejsobj;
          },
          updatePosition: function() {
            if(parent) {
                var vec = new THREE.Vector3();
                vec.addVectors(this.parent.parent.position, this.parent.position);
                this.position.copy(vec);
            }
            
            var coords2d = this.get2DCoords(this.position, _this.camera);
            this.element.style.left = coords2d.x + 'px';
            this.element.style.top = coords2d.y - 20 + 'px';
          },
          get2DCoords: function(position, camera) {
            var vector = position.project(camera);
            vector.x = (vector.x + 1)/2 * window.innerWidth;
            vector.y = -(vector.y - 1)/2 * window.innerHeight;
            return vector;
          }
        };
      };

      this.createName = function(name) {
        var loader = new THREE.FontLoader();
        loader.load('fonts/font.json', (font) => {
            var geometry = new THREE.TextGeometry( '3Diagram '+name, {
                font: font,
                size: 100,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 1
            } );
            var material = new THREE.MeshBasicMaterial( { color: '#750c41' } );
            this.meshLabel = new THREE.Mesh(geometry, material);
            this.meshLabel.position.x = 300;
            this.meshLabel.position.y = 300;
            this.meshLabel.position.z = 0;
            this.meshLabel.userData.groupUuid = this.group.uuid;
            this.group.add(this.meshLabel);
        });
      };

     this.getDiagramCenter = function() {
        if ( items.length ) {
            var maxRows = getMaxRow();
            var maxLayer = getMaxLayer();
            var maxColumn = getMaxColumn();
            var diagramLength = ( maxColumn + 1 ) * elemntSize.length + maxColumn * offset.x+1000;
            var diagramHeight = ( maxLayer + 1 ) * elemntSize.height + maxLayer * offset.y;
            var diagramWidth = ( maxRows + 1 ) * elemntSize.width + maxRows * offset.z;
            return {
                x: (diagramLength - elemntSize.length)/2,
                y: -diagramHeight/2,
                z: (diagramWidth - elemntSize.width)/2
            };
        }
        return {
            x: 0,
            y: 0,
            z: 0
        };
     };

     this.faceLabel = function() {
         if (this.meshLabel) {
            this.meshLabel.quaternion.copy( this.camera.quaternion );
         }
     };
}