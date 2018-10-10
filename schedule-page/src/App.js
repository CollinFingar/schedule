import React, { Component } from 'react';
import axios from 'axios';
import DataService from './DataService'
import Schedule from './Schedule';

import './App.css';
import tv from './icons//tv-solid.svg';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {},
      series: {},
      filter: "Date",
      games: [],
      seriesOrder: [],
      datesOrder: {}
    }
  }

  componentDidMount() {
    this.retrieveData();
    setInterval(function(){
      this.retrieveData()}.bind(this), 10000);
  }

  retrieveData(){
    axios.get(DataService.urls.Data, { crossdomain: true })
      .then(res => {
        this.transformData(res);
        console.log("Updating Data");
      })
  }

  transformData(res){
    var data = res.data;
    var games = [];
    for(var s = 0; s < data.series.length; s++){
      var seriesGames = data.series[s].games;
      for(var g = 0; g < seriesGames.length; g++){
        var gameData = {
          data: seriesGames[g],
          seriesIndex: s,
          gameIndex: g,
          date: new Date(seriesGames[g].gameDate)
        }
        games.push(gameData)
      }
    }
    var set = new Set();
    var seriesOrder = [];
    var datesOrder = {};
    games.sort(function(a,b){
      if(a.date > b.date){
        return 1
      }
      return -1;
    })
    for(var g = 0; g < games.length; g++){
      // console.log(games[g].date);
      var date = games[g].date;
      var dateString = DataService.weekDays[date.getDay()]+", "+DataService.months[date.getMonth()]+" "+date.getDate();
      if(datesOrder[dateString] !== null && datesOrder[dateString] !== undefined){
        datesOrder[dateString].push(g);
      } else {
        datesOrder[dateString] = [g];
      }
      // console.log(dateString);

      var sIndex = games[g].seriesIndex;
      if(!set.has(sIndex)){
        set.add(sIndex);
        seriesOrder.push(sIndex);
      }
    }
    // console.log(seriesOrder);
    console.log(res.data);
    this.setState({ 
                    data: res.data,
                    series: res.data.series,
                    filter: this.state.filter,
                    games: games,
                    seriesOrder: seriesOrder,
                    datesOrder: datesOrder
                  });
    console.log(this.state);
  }

  filterByRound = () => {
    console.log("Filtering By Round");
    this.setState({ 
      data: this.state.data,
      series: this.state.series,
      filter: "Round",
      games: this.state.games,
      seriesOrder: this.state.seriesOrder,
      datesOrder: this.state.datesOrder
    });
    console.log(this.state);
  }

  filterByDate = () => {
    console.log("Filtering By Date");
    this.setState({ 
      data: this.state.data,
      series: this.state.series,
      filter: "Date",
      games: this.state.games,
      seriesOrder: this.state.seriesOrder,
      datesOrder: this.state.datesOrder
    });
    console.log(this.state);
  }

  render() {
    return (
      <div className="App">
        
        <div className="container bg-light AppContainer">
          <h3 className="ScheduleTitle"><span className="Text">Schedule</span></h3> 
          <div className="row">
            <div className="col-6 EasternExplain">
              All Times Eastern
            </div>
            <div className="col-6">
              <div className="FindNetwork">
                <img src={tv} alt="" className="TVIcon"/>
                <span>Find <a href="http://m.mlb.com/network/getmlbnetwork" target="_blank">MLB Network</a> and <a href="https://www.mlb.com/postseason" target="_blank">FS1</a></span>
              </div>
            </div>
          </div>
          
          <div className="ListExplain">List Games and Series</div>

          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-secondary active" onClick={this.filterByDate}>
              <input type="radio" name="options" id="option1" autoComplete="off"  checked/> By Date
            </label>
            <label className="btn btn-secondary" onClick={this.filterByRound}>
              <input type="radio" name="options" id="option2" autoComplete="off" /> By Round
            </label>
          </div>
          <div className="Divider"></div>
          <Schedule series={this.state.data.series} games={this.state.games} filter={this.state.filter} 
                  seriesOrder={this.state.seriesOrder} datesOrder={this.state.datesOrder}></Schedule>
        </div>
        <div className="Credits">Created by Collin Fingar</div>
      </div>
    );
  }
}

export default App;
