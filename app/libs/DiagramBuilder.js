import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';

import meta from '../meta';

const defaultCubeData = meta.data;
const colors = ['#81d8d0', '#fff25d', '#3197e0'];
export default function (scene, cubeElements) {
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
            this.scene.add( mesh );
            items.push(mesh);
        });
        return items;
    };

    this.createNavColumn = function () {
        var layersCount = getMaxLayer();
        var geometryC = new THREE.CylinderGeometry( offset.y/3, offset.y/3, offset.y, 32 );
        for (var i = 0; i < layersCount + 1; i++) {
           var materialC = new THREE.MeshBasicMaterial( { color: colors[i] } );
           var meshC = new THREE.Mesh( geometryC, materialC );
           meshC.position.x = 2000;
           meshC.position.y = -i*offset.y;
           meshC.position.z = 500;
           meshC.userData.type = 'navColumnElement';
           meshC.userData.layer = i;
           meshC.updateMatrix();
           scene.add( meshC );
        }
    };

    this.createMesh = function(size, pos, type) {
        var geometryT = new THREE.BoxGeometry( size.lenght, size.height, size.width );
        var texture1 = new THREE.TextureLoader().load( 'textures/carts.jpg' );
        var texture2 = new THREE.TextureLoader().load( 'textures/column-charts.jpg' );
        var materialT = [
           new THREE.MeshBasicMaterial( { color: 'gray',side: THREE.DoubleSide } ),
           new THREE.MeshBasicMaterial( { color: 'gray',side: THREE.DoubleSide } ),

           new THREE.MeshBasicMaterial( { color: 'white', transparent: type==='infoCube'?true:false, opacity: 0,side: THREE.DoubleSide }),
           new THREE.MeshBasicMaterial( { color: 'white', transparent: type==='infoCube'?true:false, opacity: 0, side: THREE.DoubleSide } ),
           new THREE.MeshBasicMaterial( { map: texture1 , side: THREE.DoubleSide} ),
           new THREE.MeshBasicMaterial( { map: texture2 , side: THREE.DoubleSide} ),
        ];
        var meshT = new THREE.Mesh( geometryT, materialT );
        meshT.position.set(pos.x, pos.y - 200, pos.z);
        meshT.userData.type = 'infoCube';
        meshT.userData.layer = 1;
        meshT.updateMatrix();
        meshT.matrixAutoUpdate = false;
        this.currentInfoCube = meshT;
        this.scene.add(this.currentInfoCube);
        return this.currentInfoCube;
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