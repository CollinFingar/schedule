import React, { Component } from 'react';
import axios from 'axios';
import DataService from './DataService'
import Schedule from './Schedule';

import './App.css';
import tv from './icons/tv-solid.svg';
import calendar from './icons/calendar-alt-regular.svg';
import list from './icons/list-ol-solid.svg';

/**
 * This component sets up the page for the Schedule component housed
 * inside at the bottom.
 */
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      dates: [],
      closestDateIndex: 0,
      data: {},
      series: {},
      filter: "Date",
      games: [],
      seriesOrder: [],
      datesOrder: {}
    }
  }

  /**
   * After the component is mounted, retrieve data from the endpoint
   */
  componentDidMount() {
    this.retrieveData();
    setInterval(function(){
      this.retrieveData()}.bind(this), 10000);
  }

  /**
   * Retrieves data from the url using "axios"
   */
  retrieveData(){
    axios.get(DataService.urls.Data, { crossdomain: true })
      .then(res => {
        this.transformData(res);
        console.log("Updating Data");
      })
  }

  /**
   * After data retrieval, it is transformed into a more useable form for
   * the children components.
   * Sets up dates for the date filter, the correct series order, and more.
   * @param {data} res 
   */
  transformData(res){
    var data = res.data;
    var games = [];
    // Loops through sereis and adds games to array for date filter
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
    var dates = [];
    var closestDate = games[0].date;
    var closestDateIndex = 0;
    var dateNeedsToBeSet = true;
    // Sorts games by date
    games.sort(function(a,b){
      if(a.date > b.date){
        return 1
      }
      return -1;
    })
    // Loops through sorted games and sets closest date,
    // the correct series order, and more.
    for(var g = 0; g < games.length; g++){
      var date = games[g].date;
      var dateString = DataService.weekDays[date.getDay()]+", "+DataService.months[date.getMonth()]+" "+date.getDate();
      var state = games[g].data.status.abstractGameState;
      if((state === "Live" || state === "Preview") && dateNeedsToBeSet ){
        dateNeedsToBeSet = false;
        closestDate = dateString;
        closestDateIndex = dates.length;
      }
      if(dates.length > 0){
        if(dates[dates.length-1] !== dateString){
          dates.push(dateString);
        }
      } else {
        dates.push(dateString);
      }
      if(datesOrder[dateString] !== null && datesOrder[dateString] !== undefined){
        datesOrder[dateString].push(g);
      } else {
        datesOrder[dateString] = [g];
      }

      var sIndex = games[g].seriesIndex;
      if(!set.has(sIndex)){
        set.add(sIndex);
        seriesOrder.push(sIndex);
      }
    }
    // Set the state using the transformed data. This will be passed to the chil
    // components
    this.setState({ 
                    dates: dates,
                    closestDateIndex: closestDateIndex,
                    data: res.data,
                    series: res.data.series,
                    games: games,
                    seriesOrder: seriesOrder,
                    datesOrder: datesOrder
                  });
    // console.log(this.state);
  }

  /**
   * Set the filter mode to "By Round"
   */
  filterByRound = () => {
    this.setState({
      filter: "Round"
    });
  }

  /**
   * Set the filter mode to "By Date"
   */
  filterByDate = () => {
    this.setState({
      filter: "Date"
    });
  }

  /**
   * Render the app
   * Creates network and time info at top,
   * toggle buttons,
   * and the "Schedule" component which does the rest.
   */
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
              <input type="radio" name="options" id="option1" autoComplete="off"  checked/><img src={calendar} alt="" className="ToggleIcon"/> By Date
            </label>
            <label className="btn btn-secondary" onClick={this.filterByRound}>
              <input type="radio" name="options" id="option2" autoComplete="off" /><img src={list} alt="" className="ToggleIcon"/> By Round
            </label>
          </div>
          <div className="Divider"></div>
          <Schedule series={this.state.data.series} games={this.state.games} filter={this.state.filter} 
                  seriesOrder={this.state.seriesOrder} datesOrder={this.state.datesOrder}
                  dates={this.state.dates} closestDateIndex={this.state.closestDateIndex}></Schedule>
        </div>
        <div className="Credits">Created by Collin Fingar</div>
      </div>
    );
  }
}

export default App;
