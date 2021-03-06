import * as TWEEN from '@tweenjs/tween.js';
const changeDuration = 700;
const cameraPositionOffsets = {
    elClick :{
        x: -500,
        y: 800,
        z: 1500
    },
    elDblClick :{
        x: 0,
        y: -150,
        z: 550
    }
};
const controlTargetOffset = {
    elClick :{
        x: 0,
        y: -200,
        z: 0
    },
    elDblClick :{
        x: 0,
        y: -200,
        z: 0
    }
};
export default function( camera, controls ){

    this.animateCameraOnClickElement = function( object, type ) {
        var fromControlsTarget = {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z
        };

        var toControlsTarget = {
            x: object.position.x + controlTargetOffset[type].x,
            y: object.position.y + controlTargetOffset[type].y,
            z: object.position.z + controlTargetOffset[type].z
        };
        var fromCameraPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var toCameraPosition = {
            x: object.position.x + cameraPositionOffsets[type].x,
            y: object.position.y + cameraPositionOffsets[type].y,
            z: object.position.z + cameraPositionOffsets[type].z
        };

        console.log(object.uuid);

        new TWEEN.Tween(fromControlsTarget)
            .to(toControlsTarget, changeDuration )
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(function () {
                controls.target.set(this._object.x, this._object.y, this._object.z);
            })
            .start();

        new TWEEN.Tween(fromCameraPosition)
            .to(toCameraPosition, changeDuration)
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(function () {
                camera.position.set(this._object.x, this._object.y, this._object.z);
            })
            .start(); 
    };

    this.animateToLayer = function( diagramCenter, k ) {
        var fromControlsTarget = {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z
         };

         var toControlsTarget = {
            x: diagramCenter.x,
            y: 100 + k*-500,
            z: diagramCenter.z
         };
         var fromCameraPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
         };

         var toCameraPosition = {
            x: diagramCenter.x,
            y: 100 - diagramCenter.y - k*500,
            z: 2200
         };
         new TWEEN.Tween(fromControlsTarget)
               .to(toControlsTarget, changeDuration )
               .easing(TWEEN.Easing.Quadratic.Out)
               .onUpdate(function () {
                  controls.target.set(this._object.x, this._object.y, this._object.z);
               })
               .start();
         new TWEEN.Tween(fromCameraPosition)
            .to(toCameraPosition, changeDuration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {
               camera.position.set(this._object.x, this._object.y, this._object.z);
            })
            .start();
    };
}