import MainDiagram from './modules/diagram/mainDiagram';
import {createStore} from 'redux';

const changeMode = obj => ({ type: 'NAVIGATE', obj });


function createDiagram(store) {
   const diagram = new MainDiagram({store});
   diagram.createDiagram();
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
   group: document.getElementById('mode').group,
   row: document.getElementById('mode').row,
   column: document.getElementById('mode').column,
   layer: document.getElementById('mode').layer,
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


      this.store = options.store;
      window.store.subscribe(() => this.update());
   }
 
   update() { 
      this.$mode
         .value = window.store.getState().mode;
      this.$group
         .value = window.store.getState().group;
      this.$layer
         .value = window.store.getState().layer;
      this.$row
         .value = window.store.getState().row;
      this.$column
         .value = window.store.getState().column;
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

 createDiagram();
