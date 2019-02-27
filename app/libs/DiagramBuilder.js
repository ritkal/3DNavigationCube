import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';

import meta from '../meta';

const defaultCubeData = meta.data;
const colors = ['#63a884', '#fa8072', '#ffcc5c'];
const infoColors = ['#bae0cc', '#ffd8d3', '#fcebc4'];
export default function (scene, camera, cubeElements) {
    this.textlabels = [];
    this.camera = camera;
    this.scene = scene;
    this.cubeElements = cubeElements || defaultCubeData;
    this.currentInfoCube = null;
    var items = [];
    var elemntSize = {
        length: 400,
        width: 300,
        height: 1
    };

    var offset = {
        x: 200,
        y: 200,
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

    this.createCubeElements = function () {
        const geometry = new THREE.BoxGeometry( elemntSize.length, elemntSize.height, elemntSize.width );
        var texture = new THREE.TextureLoader().load( 'textures/trash.jpg' );
        this.cubeElements.forEach(el => {
            var materials = [
                new THREE.MeshBasicMaterial( { color: 'black' } ),
                new THREE.MeshBasicMaterial( { color: 'black' } ),
                new THREE.MeshBasicMaterial( { map: texture } ),
                new THREE.MeshBasicMaterial( { color: colors[el.layer] } ),
                new THREE.MeshBasicMaterial( { color: 'black' } ),
                new THREE.MeshBasicMaterial( { color: 'black' } ),
             ];
            var mesh = new THREE.Mesh( geometry, materials );
            mesh.material.forEach(m => {
               m.transparent = true;
               m.opacity = 1;
            });
            mesh.position.x = el.column * ( elemntSize.length + offset.x );
            mesh.position.y = - el.layer * offset.y;
            mesh.position.z = el.row * ( elemntSize.width + offset.z);
            mesh.userData.column = el.column;
            mesh.userData.layer = el.layer;
            mesh.userData.row = el.row;
            mesh.userData.type = 'cubeElement';
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = true;
            var text = this.__createTextLabel();
            text.setHTML(el.name);
            text.setParent(mesh);
            this.textlabels.push(text);
            document.body.appendChild(text.element);
            this.scene.add( mesh );
            items.push(mesh);
        });
        var planeGeo = new THREE.PlaneBufferGeometry( 4000.1, 4000.1 );
        // walls
				var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.2 } ) );
                planeTop.position.y = 1000;
                planeTop.position.x = 1000;
				planeTop.rotateX( Math.PI / 2 );
                this.scene.add( planeTop );
                
                var planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.2 } ) );
                planeBottom.position.y = -3000;
                planeBottom.position.x = 1000;

				planeBottom.rotateX( - Math.PI / 2 );
                this.scene.add( planeBottom );
                
                var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.2 } ) );
                planeFront.position.x = 1000;
				planeFront.position.z = 2000;
				planeFront.position.y = -1000;
				planeFront.rotateY( Math.PI );
                this.scene.add( planeFront );

                // var geometryy = new THREE.PlaneBufferGeometry( 4000, 4000 );
                // var planeBack = new THREE.Mesh( geometryy, new THREE.MeshBasicMaterial( { color: 'white' } ) );
                // planeBack.position.x = 1000;
				// planeBack.position.z = -2000;
				// planeBack.position.y = -1000;
				// planeBack.rotateY( Math.PI );
                // this.scene.add( planeBack );
                
                var planeRightt = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.2 } ) );
				planeRightt.position.x = 3000;
				planeRightt.position.y = -1000;
				planeRightt.rotateY( - Math.PI / 2 );
                this.scene.add( planeRightt );
                
                var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 'white', transparent: true, opacity: 0.2 } ) );
				planeLeft.position.x = - 1000;
				planeLeft.position.y = -1000;
				planeLeft.rotateY( Math.PI / 2 );
				this.scene.add( planeLeft );
        return {
            items: items,
            texts: this.textlabels
        };
    };

    this.createNavColumn = function () {
        var layersCount = getMaxLayer();
        var geometryC = new THREE.CylinderGeometry( offset.y/3, offset.y/3, offset.y, 32 );
        var items= [];
        for (var i = 0; i < layersCount + 1; i++) {
           var materialC = new THREE.MeshBasicMaterial( { color: colors[i] } );
           var meshC = new THREE.Mesh( geometryC, materialC );
           meshC.material.transparent = true;
           meshC.material.opacity = 1;
           meshC.position.x = 2000;
           meshC.position.y = -i*offset.y;
           meshC.position.z = 500;
           meshC.userData.type = 'navColumnElement';
           meshC.userData.layer = i;
           meshC.updateMatrix();
           scene.add( meshC );
           items.push(meshC);
        }
        return items;
    };

    this.createMesh = function(size, obj, type) {
        var geometryT = new THREE.BoxGeometry( size.lenght, size.height, size.width );
        var texture1 = new THREE.TextureLoader().load( 'textures/carts.jpg' );
        var texture2 = new THREE.TextureLoader().load( 'textures/column-charts.jpg' );
        var materialT = [
           new THREE.MeshBasicMaterial( { color: infoColors[obj.userData.layer],side: THREE.DoubleSide } ),
           new THREE.MeshBasicMaterial( { color: infoColors[obj.userData.layer],side: THREE.DoubleSide } ),

           new THREE.MeshBasicMaterial( { color: 'white', transparent: type==='infoCube'?true:false, opacity: 0,side: THREE.DoubleSide }),
           new THREE.MeshBasicMaterial( { color: 'white', transparent: type==='infoCube'?true:false, opacity: 0, side: THREE.DoubleSide } ),
           new THREE.MeshBasicMaterial( { map: texture1 , side: THREE.DoubleSide} ),
           new THREE.MeshBasicMaterial( { map: texture2 , side: THREE.DoubleSide} ),
        ];
        var meshT = new THREE.Mesh( geometryT, materialT );
        meshT.position.set(obj.position.x, obj.position.y - 200, obj.position.z);
        meshT.userData.type = 'infoCube';
        meshT.userData.layer = 1;
        meshT.updateMatrix();
        meshT.matrixAutoUpdate = false;
        this.currentInfoCube = meshT;
        this.scene.add(this.currentInfoCube);
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
                vec.addVectors(this.parent.parent.position, this.parent.position)
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

     this.getDiagramCenter = function() {
        if ( items.length ) {
            var maxRows = getMaxRow();
            var maxLayer = getMaxLayer();
            var maxColumn = getMaxColumn();
            var diagramLength = ( maxColumn + 1 ) * elemntSize.length + maxColumn * offset.x;
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
}