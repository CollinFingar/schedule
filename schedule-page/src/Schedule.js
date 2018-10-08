import React, { Component } from 'react';
import './Schedule.css';

class Schedule extends Component {

  renderList(){
    if(this.props.series){
      return (
        <div>
          {this.props.series.map((s) =>
              <div>{s.series.id}</div>

          )}
        </div>
        
      )
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
  render() {
    return (
      <div className="Schedule container">
        {this.renderList()}
        
        
      </div>
    );
  }
}

export default Schedule;
