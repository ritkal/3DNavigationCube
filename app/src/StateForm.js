import React from 'react';
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

      handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      handleButtonClick(event) {
        event.preventDefault();
        console.log(this.state);
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

export default StateFrom;