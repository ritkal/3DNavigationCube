// import MainDiagram from './modules/diagram/mainDiagram';
import TWEEN from '@tweenjs/tween.js';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import React from 'react';
import App from './src/App.js';
import {createStore} from 'redux';
// reducer 
function counter(state = initState, action) {
   switch(action.type) {
      case 'NAVIGATE':
         return action.obj;
      default:
         return state;
   }
 }

const store = createStore(counter)

ReactDOM.render(  
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById('root')
);
const initState = {
   mode: 'Group mode',
   group: '',
   layer: '',
   row: '',
   column: '',
};