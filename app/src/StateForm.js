import React from 'react';
import { connect } from "react-redux";
const changeMode = obj => ({ type: 'NAVIGATE', obj });

function mapDispatchToProps(dispatch) {
  return {
      changeMode: mode => dispatch(changeMode(mode))
  };
}
const mapStateToProps = state => {
  return { mode: state };
};

class StateFrom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: '',
            group: '',
            layer: '',
            row: '',
            column: '',
        };
    
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
      }

      componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.mode !== newProps.mode) {
          this.setState(newProps.mode);
        }
      }

      handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      handleButtonClick(event) {
        this.buttonClicked =
        event.preventDefault();
        this.props.changeMode(this.state);
      }

      render() {
        return (
          <form>
          <label>
            Mode:
            <input 
                id="mode" 
                type="text" 
                name="mode"
                value={this.state.mode}
                onChange={this.handleInputChange}/>
          </label>
          <br />
          <label>
            Group:
            <input 
                id="group" 
                type="text" 
                name="group"
                value={this.state.group}
                onChange={this.handleInputChange}/>
          </label>
          <br />
          <label>
            Row:
            <input 
                id="row" 
                type="text" 
                name="row"
                value={this.state.row}
                onChange={this.handleInputChange}/>
          </label>
          <br />
          <label>
            Column:
            <input 
                id="column" 
                type="text" 
                name="column"
                value={this.state.column}
                onChange={this.handleInputChange}/>
          </label>
          <br />
          <label>
            Layer:
            <input 
                id="layer" 
                type="text" 
                name="layer"
                value={this.state.layer}
                onChange={this.handleInputChange}/>
          </label>
          <br />
          <button type="button" onClick={this.handleButtonClick}>Go</button>
          </form>
        );
      }
}

const Form = connect(mapStateToProps, mapDispatchToProps)(StateFrom);
// const Form = connect(null, mapStateToProps)(StateFrom);


export default Form;