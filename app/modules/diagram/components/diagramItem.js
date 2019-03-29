import * as TWEEN  from '@tweenjs/tween.js';

class BaseItem {
    constructor(options) {
        this.mesh = options.mesh;
        this.group = options.group;
    }

    show() {
        this.group.add(this.mesh);
    }

    hide() {
        this.group.remove(this.mesh);
    }
    
    relocate(offset) {
        const newPos = {
            y: this.mesh.position.y + offset
        };
        const Pos = {
            y: this.mesh.position.y
        };

        new TWEEN.Tween(Pos)
            .to(newPos, 1000)
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(() => {
                this.setYPosition(Pos.y);

            })
            .start();
    }
    
    relocateAndHide(offset){
        const newPos = {
            y: this.mesh.position.y + offset
        };
        const pos = {
            y: this.mesh.position.y
        };

        new TWEEN.Tween(pos)
            .to(newPos, 1000)
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(() => {
                this.setYPosition(pos.y);
            })
            .onComplete(() => {
                this.hide();
                this.mesh.position.y -=offset;
            })
            .start();
    }

    changeOpacity(val) {
        this.mesh.material.forEach(m => {
            m.opacity = val;
        });
    }

    setXPosition(val){
        this.mesh.position.x = val;
    }
    setYPosition(val){
        this.mesh.position.y = val;
    }
    setZPosition(val){
        this.mesh.position.z = val;
    }
    setPosition(val) {
        this.mesh.position = val;
    }

    getXPosition(val){
        return this.mesh.position.x;
    }
    getYPosition(val){
        return this.mesh.position.y;
    }
    getZPosition(val){
        return this.mesh.position.z;
    }
}

export default BaseItem;