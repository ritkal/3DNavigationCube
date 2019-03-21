import React from 'react';
import { connect } from "react-redux";
// import { Route, Redirect } from 'react-router'
import { withRouter } from 'react-router-dom'
// import { Link } from 'react-router-dom';
const changeMode = obj => ({ type: 'NAVIGATE', obj });

function mapDispatchToProps(dispatch) {
  return {
      changeMode: mode => dispatch(changeMode(mode))
  };
}
const mapStateToProps = state => {
  return { state };
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
            level: ''
        };
    
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
      }

      componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.state.state !== newProps.state.state ) {
          this.setState(newProps.state.state);
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
        const { history } = this.props;
        if(history) history.push('/home');
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

          <label>
            Level:
            <input 
                id="level" 
                type="text" 
                name="level"
                value={this.state.level}
                onChange={this.handleInputChange}/>
          </label>
          <br />
          {/* <Link to="/dashboard"> */}
            <button type="button" onClick={this.handleButtonClick}>Go</button>
          {/* </Link> */}
          </form>
        );
      }
}

const Form = connect(mapStateToProps, mapDispatchToProps)(StateFrom);
// const Form = connect(null, mapStateToProps)(StateFrom);


export default Form;