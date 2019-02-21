import * as TWEEN from '@tweenjs/tween.js';
const changeDuration = 700;

export default function(){
    this.animateCameraOnClickElement = function(camera, controls, object) {
        var fromControlsTarget = {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z
        };

        var toControlsTarget = {
            x: object.position.x,
            y: object.position.y - 200,
            z: object.position.z
        };
        var fromCameraPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var toCameraPosition = {
            x: object.position.x - 300,
            y: object.position.y + 200,
            z: object.position.z + 500
        };
        controls.reset();
        new TWEEN.Tween(fromControlsTarget)
            .to(toControlsTarget, changeDuration )
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                controls.target.set(this._object.x, this._object.y, this._object.z);
            })
            .start();

        new TWEEN.Tween(fromCameraPosition)
            .to(toCameraPosition, changeDuration)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this._object.x, this._object.y, this._object.z);
            })
            .start(); 
    };

    this.animateToInfoCube = function(camera, controls, object) {
        var fromControlsTarget = {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z
        };

        var toControlsTarget = {
            x: object.position.x,
            y: object.position.y - 200,
            z: object.position.z
        };
        var fromCameraPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var toCameraPosition = {
            x: object.position.x,
            y: object.position.y -200,
            z: object.position.z + 500
        };
        controls.reset();
        new TWEEN.Tween(fromControlsTarget)
            .to(toControlsTarget, changeDuration )
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                controls.target.set(this._object.x, this._object.y, this._object.z);
            })
            .start();

        new TWEEN.Tween(fromCameraPosition)
            .to(toCameraPosition, changeDuration)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this._object.x, this._object.y, this._object.z);
            })
            .start(); 
    };

    this.animateToLayer = function(camera, controls, diagramCenter, k) {
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
         controls.reset();
         new TWEEN.Tween(fromControlsTarget)
               .to(toControlsTarget, changeDuration )
               .easing(TWEEN.Easing.Linear.None)
               .onUpdate(function () {
                  controls.target.set(this._object.x, this._object.y, this._object.z);
               })
               .start();
         new TWEEN.Tween(fromCameraPosition)
            .to(toCameraPosition, changeDuration)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
               camera.position.set(this._object.x, this._object.y, this._object.z);
            })
            .start();
    };
}