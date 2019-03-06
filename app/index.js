import MainDiagram from './modules/diagram/mainDiagram';
import TWEEN from '@tweenjs/tween.js';
import {createStore} from 'redux';

const changeMode = obj => ({ type: 'NAVIGATE', obj });


function createDiagram() {
   const diagram = new MainDiagram();
   diagram.createDiagram();
   return diagram;
}

function change(some) {
   window.store.dispatch(changeMode(some));
}


const initState = {
   mode: 'Group mode',
   group: '',
   layer: '',
   row: '',
   column: '',
};

const button = document.getElementById('button');
button.addEventListener('click', () => change({
   mode: document.getElementById('mode').value,
   group: document.getElementById('group').value,
   row: document.getElementById('row').value,
   column: document.getElementById('column').value,
   layer: document.getElementById('layer').value,
}));

// reducer 
function counter(state = initState, action) {
   switch(action.type) {
      case 'NAVIGATE':
         return action.obj;
      default:
         return state;
   }
 }
 
//create store
window.store = createStore(counter);

class State {
   constructor(options) {
      this.$mode = options.mode;
      this.$group = options.group;
      this.$layer = options.layer;
      this.$column = options.column;
      this.$row = options.row;
      this.diagram = createDiagram();

      this.store = options.store;
      window.store.subscribe(() => this.update());
   }
 
   update() {
      let navPos;
      const state = window.store.getState(); 
      this.$mode
         .value = state.mode;
      this.$group
         .value = state.group;
      this.$layer
         .value = state.layer;
      this.$row
         .value = state.row;
      this.$column
         .value = state.column;
      if (state.mode === 'Group mode' && state.group.toString() ) {
         if (state.layer.toString() && state.row.toString() && state.column.toString()) {
            this.fullState(state);
            return;
         }
         if (state.layer.toString()) {
            this.layerState(state);
            return;
         }
         if (!state.group.toString()) {
            const group = this.diagram.groups.find(item => item.uuid === this.diagram.INTERSECTEDMOUSEUP.userData.groupUuid);
            this.diagram.currentModule = this.diagram.modules.find(item => item.group === group);
               this.diagram.mode = 'Group mode';
               const newNavPos = {
                  x: 0,
                  y: 0,
                  z: 0,
               };
            this.diagram.items = this.diagram.currentModule.items;
            // this.textLabels = this.currentModule.texts;
            this.diagram.columnItems = this.diagram.currentModule.columnItems;
            navPos = group.position;
            new TWEEN.Tween(navPos)
               .to(newNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  group.position.x = navPos.x;
                  group.position.y = navPos.y;
                  group.position.z = navPos.z;
               })
               .start(); 
            this.diagram.cameraAnimate.animateToLayer(this.diagram.diagramCenter, 1);
         } else {
            let currentGroup;
            if (this.diagram.currentModule) {
               currentGroup = this.diagram.currentModule.group;
            }
            const group = this.diagram.groups.find(item => item.uuid === state.group.toString());

            if ( currentGroup && currentGroup !== group.uuid) {
               const currentNewNavPos = this.diagram.currentModule.pos;
               const currentNavPos = this.diagram.currentModule.group.position;
               new TWEEN.Tween(currentNavPos)
               .to(currentNewNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  currentGroup.position.x = currentNavPos.x;
                  currentGroup.position.y = currentNavPos.y;
                  currentGroup.position.z = currentNavPos.z;
               })
               .start(); 
            }
            this.diagram.currentModule = this.diagram.modules.find(item => item.group === group);
               this.diagram.mode = 'Group mode';
               const newNavPos = {
                  x: 0,
                  y: 0,
                  z: 0,
               };
            this.diagram.items = this.diagram.currentModule.items;
            // this.textLabels = this.currentModule.texts;
            this.diagram.columnItems = this.diagram.currentModule.columnItems;
            navPos = group.position;
            new TWEEN.Tween(navPos)
               .to(newNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  group.position.x = navPos.x;
                  group.position.y = navPos.y;
                  group.position.z = navPos.z;
               })
               .start(); 
            this.diagram.cameraAnimate.animateToLayer(this.diagram.diagramCenter, 1);
            this.diagram.items.forEach(item => {
               item.material.forEach(m => {
                  m.opacity = 1;
              });
            });
            this.diagram.columnItems.forEach(item => {
               item.material.opacity = 1;
            });
         }
      }
      if (state.mode === 'Global mode') {
         this.diagram.cameraAnimate.animateToLayer(this.diagram.diagramCenter, 1);
         let newNavPos = this.diagram.currentModule.pos;
         this.diagram.items.forEach(item => {
            item.material.forEach(m => {
               m.opacity = 1;
           });
         });
         this.diagram.columnItems.forEach(item => {
            item.material.opacity = 1;
         });
         this.diagram.items = [];
         // for(var k=0; k<this.textLabels.length; k++){
         //     this.textLabels[k].element.hidden = true;
         // }
     
     navPos = this.diagram.currentModule.group.position;
     this.module = this.diagram.currentModule;
     new TWEEN.Tween(navPos)
         .to(newNavPos, 1000)
         .easing(TWEEN.Easing. Quadratic.Out)
         .onUpdate(() => {
            this.module.group.position.x = navPos.x;
            this.module.group.position.y = navPos.y;
            this.module.group.position.z = navPos.z;
         })
         .start(); 
         this.diagram.currentModule = null;

      }
   }

   fullState(state) {
      let navPos;
      if (this.diagram.currentModule) {
         if (this.diagram.currentModule.group.uuid === state.group.toString()) {
            this.diagram.INTERSECTEDMOUSEUP = this.diagram.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
               (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
         } else {
            var currentGroup = this.diagram.currentModule.group;
            const group = this.diagram.groups.find(item => item.uuid === state.group.toString());

            const currentNewNavPos = this.diagram.currentModule.pos;
            const currentNavPos = this.diagram.currentModule.group.position;
            new TWEEN.Tween(currentNavPos)
            .to(currentNewNavPos, 1000)
            .easing(TWEEN.Easing. Quadratic.Out)
            .onUpdate(() => {
               currentGroup.position.x = currentNavPos.x;
               currentGroup.position.y = currentNavPos.y;
               currentGroup.position.z = currentNavPos.z;
            })
            .start(); 
            this.diagram.currentModule = this.diagram.modules.find(item => item.group === group);
            this.diagram.INTERSECTEDMOUSEUP = this.diagram.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
            (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
               this.diagram.mode = 'Group mode';
               const newNavPos = {
                  x: 0,
                  y: 0,
                  z: 0,
               };
            this.diagram.items = this.diagram.currentModule.items;
            // this.textLabels = this.currentModule.texts;
            this.diagram.columnItems = this.diagram.currentModule.columnItems;
            navPos = group.position;
            new TWEEN.Tween(navPos)
               .to(newNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  group.position.x = navPos.x;
                  group.position.y = navPos.y;
                  group.position.z = navPos.z;
               })
               .start();
         }
      } else {
         const group = this.diagram.groups.find(item => item.uuid === state.group.toString());
         this.diagram.currentModule = this.diagram.modules.find(item => item.group === group);
         this.diagram.INTERSECTEDMOUSEUP = this.diagram.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) &&
            (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
         this.diagram.mode = 'Group mode';
               const newNavPos = {
                  x: 0,
                  y: 0,
                  z: 0,
               };
            this.diagram.items = this.diagram.currentModule.items;
            // this.textLabels = this.currentModule.texts;
            this.diagram.columnItems = this.diagram.currentModule.columnItems;
            navPos = group.position;
            new TWEEN.Tween(navPos)
               .to(newNavPos, 1000)
               .easing(TWEEN.Easing. Quadratic.Out)
               .onUpdate(() => {
                  group.position.x = navPos.x;
                  group.position.y = navPos.y;
                  group.position.z = navPos.z;
               })
               .start(); 
            this.diagram.cameraAnimate.animateToLayer(this.diagram.diagramCenter, 1);
            this.diagram.cameraAnimate.animateCameraOnClickElement(this.diagram.INTERSECTEDMOUSEUP, 'elClick');
      }
      this.diagram.cameraAnimate.animateCameraOnClickElement(this.diagram.INTERSECTEDMOUSEUP, 'elClick');
      this.diagram.items.forEach(item => {
         if (item.userData.column === this.diagram.INTERSECTEDMOUSEUP.userData.column && item.userData.row === this.diagram.INTERSECTEDMOUSEUP.userData.row) {
             item.material.forEach(m => {
                 m.opacity = 1;
             });
         } else {
             item.material.forEach(m => {
                 m.opacity = 0.3;
             });
         }
      });
      this.diagram.columnItems.forEach(item => {
            item.material.opacity = 1;
      });
   }

   layerState(state) {
      this.diagram.INTERSECTEDMOUSEUP = this.diagram.currentModule.columnItems.find(item=>(item.userData.layer.toString() === state.layer.toString()) && (item.parent.uuid === state.group));
      this.diagram.cameraAnimate.animateToLayer(this.diagram.diagramCenter, this.diagram.INTERSECTEDMOUSEUP.userData.layer);
      this.diagram.columnItems.forEach(item => {
         if (item === this.diagram.INTERSECTEDMOUSEUP) {
             item.material.opacity = 1;
         } else {
             item.material.opacity = 0.3;
         }
     });
     this.diagram.items.forEach(item => {
         if (item.userData.layer === this.diagram.INTERSECTEDMOUSEUP.userData.layer) {
             item.material.forEach(m => {
                 m.opacity = 1;
             });
         } else {
             item.material.forEach(m => {
                 m.opacity = 0.3;
             });
         }
     });
   }

   render() {
      this.update();
   }
}
 
document.addEventListener("DOMContentLoaded", () => {
   const state = new State({
      mode: document.getElementById('mode'),
      group: document.getElementById('group'),
      row: document.getElementById('row'),
      layer: document.getElementById('layer'),
      column: document.getElementById('column'),
      store: window.store.getState()
   });
   state.render();
});

// createDiagram();

// window.addEventListener( 'keydown', ()=> {}, false );
