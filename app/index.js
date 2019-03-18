// import MainDiagram from './modules/diagram/mainDiagram';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerReducer  } from 'react-router-redux';
import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import App from './src/App.js';
import {createStore, combineReducers } from 'redux';
const initState = {
   mode: 'Group',
   group: '0',
   layer: '0',
   row: '0',
   column: '0',
};
// reducer 
function state(state = initState, action) {
   switch(action.type) {
      case 'NAVIGATE':
         return action.obj;
      default:
         return state;
   }
 }

const store = createStore(
   combineReducers({
     state,
     routing: routerReducer
   })
 )
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
   <div>
      <Provider store={store}>
         <Router history={history}>
            <Route path="*" component={App}/>
        </Router>
      </Provider>
   </div>,
   document.getElementById('root')
);
