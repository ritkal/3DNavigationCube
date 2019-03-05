import MainDiagram from './modules/diagram/mainDiagram';
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
      if (state.mode === 'Group mode' && state.group !== undefined && state.group.toString() && state.layer !== undefined && state.layer.toString() && state.row !== undefined && state.row.toString() && state.row !== undefined && state.column.toString()) {
         this.diagram.INTERSECTEDMOUSEUP = this.diagram.currentModule.items.find(item=>(item.userData.layer.toString() === state.layer.toString()) && (item.userData.row.toString() === state.row.toString()) && (item.userData.column.toString() === state.column.toString()) && (item.parent.uuid === state.group));
         this.diagram.cameraAnimate.animateCameraOnClickElement(this.diagram.INTERSECTEDMOUSEUP, 'elClick');
      }
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
