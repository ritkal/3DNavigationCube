import React, { Component } from 'react';
import { connect } from "react-redux";

import StateFrom from './StateForm';
import Diagram from '../modules/diagram/mainDiagram.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className = 'canvasDiagram'>
          <Diagram />
        </div>
        <div className ='State'>
          <StateFrom />
        </div>
      </div>
    );
  }
}



// export default connect(
//   (state, ownProps) => {
//     // tracks: state.counter.filter(track => track.name.includes(state.filterTracks)),
//     ownProps
//   }
// )(App);

export default connect((state, ownProps) => {
  const foo = state.state;
  Object.keys(foo).map(function(key, index) {
    foo[key] = foo[key].toString();
  });
  return {app: foo}
})(App);
