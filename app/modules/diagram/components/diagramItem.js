import * as THREE from 'three';

class BaseItem {
    constructor(options) {
        this.size = options.size;
        this.type = options.size;
        this.isExpandable = options.isExpandable;
        this.layer = options.layer;
        this.position = options.position;
        this.geometry = options.geometry;
        this.materials = options.materials;
        this.groupUuid = options.groupUuid
        this.mesh = this.__createMesh(option.materials, options.geometry);
    }

    __createMesh(geometry, materials) {
        return new THREE.Mesh( geometry, materials );
    }

}