import React, { Component } from 'react';
import axios from 'axios';
import tv from './icons//tv-solid.svg';
import './App.css';
import Schedule from './Schedule';

const URL = "http://statsapi.mlb.com/api/v1/schedule/postseason/series?sportId=1&season=2018&hydrate=team,broadcasts(all),seriesStatus(useOverride=true),decisions,person,probablePitcher,linescore(matchup)"

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    axios.get(URL)
      .then(res => {
        this.setState({ data: res.data });
        console.log(this.state.data.series);
      })
  }

  render() {
    return (
      <div className="App">
        <h1 class="ScheduleTitle">Schedule</h1>
        <div class="container bg-light AppContainer">
          <div class="row">
            <div class="col-6 EasternExplain">
              All Times Eastern
            </div>
            <div class="col-6">
              <div class="FindNetwork">
                <img src={tv} alt="" class="TVIcon"/>
                <span>Find <a href="http://m.mlb.com/network/getmlbnetwork" target="_blank">MLB Network</a> and <a href="https://www.mlb.com/postseason" target="_blank">FS1</a></span>
              </div>
            </div>
          </div>
          
          <div class="ListExplain">List Games and Series</div>

          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary active">
              <input type="radio" name="options" id="option1" autocomplete="off" checked/> By Date
            </label>
            <label class="btn btn-secondary">
              <input type="radio" name="options" id="option2" autocomplete="off"/> By Round
            </label>
          </div>
          <Schedule series={this.state.data.series}></Schedule>
        </div>
        <div class="Credits">Created by Collin Fingar</div>
      </div>
    );
  }
}

export default App;
